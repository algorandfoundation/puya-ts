import type { NodeBuilder } from '../index'
import { InstanceBuilder } from '../index'
import type { awst, ConstantValue } from '../../../awst'
import { isConstant } from '../../../awst'
import { CodeError } from '../../../errors'
import type { PType, PTypeOrClass } from '../../ptypes'
import { UintNType } from '../../ptypes/arc4-types'
import { biguintPType, boolPType, bytesPType, stringPType, uint64PType } from '../../ptypes'
import type { SourceLocation } from '../../../awst/source-location'
import { codeInvariant } from '../../../util'
import type { Expression } from '../../../awst/nodes'
import { BoolConstant, IntegerConstant } from '../../../awst/nodes'
import { StringConstant } from '../../../awst/nodes'
import { LiteralExpressionBuilder } from '../literal-expression-builder'

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
  if (builder instanceof InstanceBuilder) return builder
  throw new CodeError(`Expected instance of a type, got ${builder.typeDescription}`, { sourceLocation: builder.sourceLocation })
}

export function requireExpressionsOfType<const TPTypes extends [...PType[]]>(
  builders: ReadonlyArray<InstanceBuilder>,
  ptypes: TPTypes,
  sourceLocation: SourceLocation,
): Array<awst.Expression> {
  if (builders.length === ptypes.length) {
    return builders.map((builder, i) => requireExpressionOfType(builder, ptypes[i]))
  }
  throw new CodeError(`Expected ${ptypes.length} args with types ${ptypes.join(', ')}`, { sourceLocation })
}

export function requireStringConstant(builder: InstanceBuilder): awst.StringConstant {
  const constant = requireConstantOfType(builder, stringPType)
  codeInvariant(constant instanceof StringConstant, 'Expected string literal', builder.sourceLocation)
  return constant
}
export function requireIntegerConstant(builder: InstanceBuilder): awst.IntegerConstant {
  const constant = requestConstantOfType(builder, uint64PType) ?? requestConstantOfType(builder, biguintPType)
  codeInvariant(constant instanceof IntegerConstant, 'Expected integer literal')
  return constant
}
export function requireBooleanConstant(builder: InstanceBuilder): awst.BoolConstant {
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

export function isValidLiteralForPType(literalValue: ConstantValue, ptype: PTypeOrClass): boolean {
  if (ptype.equals(stringPType)) {
    return typeof literalValue === 'string'
  }
  if (ptype.equals(uint64PType)) {
    return typeof literalValue === 'bigint' && 0 <= literalValue && literalValue < 2n ** 64n
  }
  if (ptype.equals(biguintPType)) {
    return typeof literalValue === 'bigint' && 0 <= literalValue && literalValue < 2n ** 512n
  }
  if (ptype instanceof UintNType) {
    return typeof literalValue === 'bigint' && 0 <= literalValue && literalValue < 2n ** ptype.n
  }
  if (ptype.equals(boolPType)) {
    return typeof literalValue === 'boolean'
  }
  if (ptype.equals(bytesPType)) {
    return literalValue instanceof Uint8Array
  }
  return false
}
