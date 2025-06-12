import { logger } from '../../logger'
import { instanceOfAny } from '../../util'
import type { ArrayConcat, AssignmentExpression, NewArray, SubmitInnerTransaction } from '../nodes'
import {
  AppAccountStateExpression,
  AppStateExpression,
  type AssignmentStatement,
  type AWST,
  BoxValueExpression,
  ConvertArray,
  type Expression,
  FieldExpression,
  IndexExpression,
  StateGet,
  StateGetEx,
  TupleExpression,
  TupleItemExpression,
  VarExpression,
} from '../nodes'
import { wtypes } from '../wtypes'
import { AwstTraverser } from './awst-traverser'

export class ARC4CopyValidator extends AwstTraverser {
  static validate(awst: AWST[]) {
    const validator = new ARC4CopyValidator()
    validator.validate(awst)
  }

  validate(awst: AWST[]) {
    for (const item of awst) {
      item.accept(this)
    }
  }

  // for nodes that can't modify the input don't need to check for copies unless an assignment
  // expression is being used
  visitSubmitInnerTransaction(call: SubmitInnerTransaction) {
    if (HasAssignmentVisitor.check(call)) {
      super.visitSubmitInnerTransaction(call)
    }
  }

  visitAssignmentStatement(assignment: AssignmentStatement) {
    checkAssignment(assignment.target, assignment.value)
    assignment.value.accept(this)
  }

  visitAssignmentExpression(expression: AssignmentExpression): void {
    checkAssignment(expression.target, expression.value)
    expression.value.accept(this)
  }

  visitArrayConcat(expression: ArrayConcat) {
    checkShallowCopy(expression.left, 'being concatenated')
    checkShallowCopy(expression.right, 'being concatenated')
  }

  visitTupleExpression(expression: TupleExpression) {
    super.visitTupleExpression(expression)
    for (const item of expression.items) {
      checkForArc4Copy(item, 'being passed to a tuple expression')
    }
  }

  visitNewArray(expression: NewArray): void {
    super.visitNewArray(expression)
    if (expression.wtype instanceof wtypes.ARC4Array) {
      expression.values.forEach((v) => {
        checkForArc4Copy(v, 'being passed to an array constructor')
      })
    }
  }
}

class HasAssignmentVisitor extends AwstTraverser {
  hasAssignment: boolean = false

  static check(expr: Expression): boolean {
    const visitor = new HasAssignmentVisitor()
    expr.accept(visitor)
    return visitor.hasAssignment
  }

  visitAssignmentExpression(_expression: AssignmentExpression): void {
    this.hasAssignment = true
  }
}

function checkShallowCopy(target: Expression, contextDesc: string) {
  if (containsMutable(target.wtype) && isReferableExpression(target)) {
    logger.error(
      target.sourceLocation,
      `expression containing a reference to value with nested mutable types must be cloned when ${contextDesc}`,
    )
  }
}

/**
 * Checks if an assignment needs to use clone(...) for ARC-4 mutable values
 */
function checkAssignment(target: Expression, value: Expression): void {
  if (!(target instanceof TupleExpression)) {
    checkForArc4Copy(value, 'being assigned to another variable')
  } else if (isReferableExpression(value) && containsMutable(target.wtype)) {
    logger.error(
      value.sourceLocation,
      'tuples containing a reference to a mutable stack type cannot be destructured, use index access with clone(...) instead',
    )
  }
}

function checkForArc4Copy(expr: Expression, contextDesc: string): void {
  if (expr instanceof ConvertArray) return checkForArc4Copy(expr.expr, contextDesc)
  if (isMutableOrContainsMutable(expr.wtype) && isReferableExpression(expr)) {
    logger.error(
      expr.sourceLocation,
      `cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when ${contextDesc}`,
    )
  }
}

function isArc4Mutable(wtype: wtypes.WType): boolean {
  return wtype instanceof wtypes.ARC4Type && !wtype.immutable
}

function isMutableOrContainsMutable(wtype: wtypes.WType) {
  return isArc4Mutable(wtype) || containsMutable(wtype)
}

function anyMutableOrContainsMutable(types: wtypes.WType[]) {
  return types.some(isMutableOrContainsMutable)
}

function containsMutable(wtype: wtypes.WType): boolean {
  if (wtype instanceof wtypes.WTuple) return anyMutableOrContainsMutable(wtype.types)
  if (wtype instanceof wtypes.ARC4Struct) return anyMutableOrContainsMutable(Object.values(wtype.fields))
  if (wtype instanceof wtypes.ARC4Array) return isMutableOrContainsMutable(wtype.elementType)
  return false
}

/**
 * Returns true if expr represents something that can be referenced multiple times.
 */
function isReferableExpression(expr: Expression): boolean {
  if (instanceOfAny(expr, VarExpression, AppStateExpression, AppAccountStateExpression, StateGet, StateGetEx, BoxValueExpression)) {
    return true
  } else if (instanceOfAny(expr, IndexExpression, TupleItemExpression, FieldExpression)) {
    return isReferableExpression(expr.base)
  }
  return false
}
