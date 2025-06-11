import { logger } from '../../logger'
import { instanceOfAny } from '../../util'
import type { AssignmentExpression } from '../nodes'
import {
  AppAccountStateExpression,
  AppStateExpression,
  BoxValueExpression,
  ConvertArray,
  FieldExpression,
  IndexExpression,
  StateGet,
  StateGetEx,
  TupleExpression,
  TupleItemExpression,
  VarExpression,
  type AssignmentStatement,
  type AWST,
  type Expression,
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

  visitAssignmentStatement(assignment: AssignmentStatement) {
    checkAssignment(assignment.target, assignment.value)
    assignment.value.accept(this)
  }

  visitAssignmentExpression(expression: AssignmentExpression): void {
    checkAssignment(expression.target, expression.value)
    expression.value.accept(this)
  }
}

/**
 * Checks if an assignment needs to use .copy() for ARC-4 mutable values
 */
function checkAssignment(target: Expression, value: Expression): void {
  if (!(target instanceof TupleExpression)) {
    checkForArc4Copy(value, 'being assigned to another variable')
  } else if (isReferableExpression(value) && target.wtype.types.some((t) => isArc4Mutable(t))) {
    logger.error(
      value.sourceLocation,
      'tuples containing a mutable reference to an ARC-4-encoded value cannot be unpacked,' + ' use index access instead',
    )
  }
}

function checkForArc4Copy(expr: Expression, contextDesc: string): void {
  if (expr instanceof ConvertArray) return checkForArc4Copy(expr.expr, contextDesc)
  if (isArc4Mutable(expr.wtype) && isReferableExpression(expr)) {
    logger.error(expr.sourceLocation, `mutable reference to ARC-4-encoded value must be copied using .copy() when ${contextDesc}`)
  }
}

/**
 * Returns true if the type represents an arc4 type that is mutable
 */
function isArc4Mutable(wtype: wtypes.WType): boolean {
  if (wtype instanceof wtypes.ARC4Type && !wtype.immutable) {
    return true
  } else if (wtype instanceof wtypes.WTuple) {
    return wtype.types.some((t) => isArc4Mutable(t))
  }
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
