import type { awst } from '../../../awst'
import { isConstant } from '../../../awst'
import type { Expression } from '../../../awst/nodes'
import { BoolConstant, IntegerConstant, StringConstant } from '../../../awst/nodes'
import { CodeError } from '../../../errors'
import { codeInvariant } from '../../../util'
import type { PType, PTypeOrClass } from '../../ptypes'
import { biguintPType, boolPType, stringPType, uint64PType } from '../../ptypes'
import type { NodeBuilder } from '../index'
import { InstanceBuilder } from '../index'
import { LiteralExpressionBuilder } from '../literal-expression-builder'
import { BigIntLiteralExpressionBuilder } from '../literal/big-int-literal-expression-builder'

export function requireExpressionOfType(builder: NodeBuilder, ptype: PTypeOrClass): Expression {
  if (builder instanceof InstanceBuilder) {
    if (builder.resolvableToPType(ptype)) {
      return builder.resolveToPType(ptype).resolve()
    }
  }
  throw new CodeError(`Expected expression of type ${ptype}, got ${builder.typeDescription}`, {
    sourceLocation: builder.sourceLocation,
  })
}
export function requireBuilderOfType(builder: NodeBuilder, ptype: PTypeOrClass): InstanceBuilder {
  if (builder instanceof InstanceBuilder) {
    if (builder.resolvableToPType(ptype)) {
      return builder.resolveToPType(ptype)
    }
  }
  throw new CodeError(`Expected expression of type ${ptype}, got ${builder.typeDescription}`, {
    sourceLocation: builder.sourceLocation,
  })
}

export function resolvableToType(builder: NodeBuilder, ptype: PTypeOrClass): builder is InstanceBuilder {
  if (builder instanceof InstanceBuilder) {
    return builder.resolvableToPType(ptype)
  }
  return false
}

export function requestExpressionOfType(builder: NodeBuilder, ptype: PTypeOrClass): Expression | undefined {
  if (builder instanceof InstanceBuilder) {
    if (builder.resolvableToPType(ptype)) {
      return builder.resolveToPType(ptype).resolve()
    }
    return undefined
  }
  return undefined
}
export function requestBuilderOfType(builder: NodeBuilder, ptype: PTypeOrClass): InstanceBuilder | undefined {
  if (builder instanceof InstanceBuilder) {
    if (builder.resolvableToPType(ptype)) {
      return builder.resolveToPType(ptype)
    }
    return undefined
  }
  return undefined
}

export function requireInstanceBuilder(builder: NodeBuilder): InstanceBuilder {
  if (builder instanceof InstanceBuilder) {
    return builder
  }
  throw new CodeError(`Expected instance of a type, got ${builder.typeDescription}`, { sourceLocation: builder.sourceLocation })
}

export function requireStringConstant(builder: NodeBuilder): awst.StringConstant {
  const constant = requireConstantOfType(builder, stringPType)
  codeInvariant(constant instanceof StringConstant, 'Expected string literal', builder.sourceLocation)
  return constant
}
export function requireIntegerConstant(builder: NodeBuilder): awst.IntegerConstant {
  const constant = requestConstantOfType(builder, uint64PType) ?? requestConstantOfType(builder, biguintPType)
  codeInvariant(constant instanceof IntegerConstant, 'Expected integer literal')
  return constant
}
export function requireBooleanConstant(builder: NodeBuilder): awst.BoolConstant {
  const constant = requireConstantOfType(builder, boolPType)
  codeInvariant(constant instanceof BoolConstant, 'Expected boolean literal')
  return constant
}

export function requestConstantOfType(builder: NodeBuilder, ptype: PType): awst.Constant | undefined {
  if (builder instanceof LiteralExpressionBuilder) {
    if (builder.resolvableToPType(ptype)) {
      const expr = builder.resolveToPType(ptype).resolve()
      if (isConstant(expr)) return expr
    }
    return undefined
  }
  if (builder instanceof InstanceBuilder && builder.ptype?.equals(ptype)) {
    const expr = builder.resolve()
    if (isConstant(expr)) return expr
  }
  return undefined
}

export function requireConstantOfType(builder: NodeBuilder, ptype: PType, messageOverride?: string): awst.Constant {
  const constExpr = requestConstantOfType(builder, ptype)
  if (constExpr) return constExpr
  throw new CodeError(messageOverride ?? `Expected constant of type ${ptype}`, { sourceLocation: builder.sourceLocation })
}

export function requireLiteralNumber(builder: NodeBuilder) {
  codeInvariant(builder instanceof BigIntLiteralExpressionBuilder, 'Expected numeric literal', builder.sourceLocation)
  return builder.value
}
