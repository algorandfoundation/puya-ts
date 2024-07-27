import { InstanceBuilder, LiteralExpressionBuilder, NodeBuilder } from './index'
import { awst, ConstantValue } from '../../awst'
import { CodeError } from '../../errors'
import { biguintPType, boolPType, bytesPType, PType, stringPType, uint64PType } from '../ptypes'
import { SourceLocation } from '../../awst/source-location'
import { codeInvariant } from '../../util'
import { StringConstant } from '../../awst/nodes'
import { ScalarLiteralExpressionBuilder } from './scalar-literal-expression-builder'
import { ConditionalExpressionBuilder } from './conditional-expression-builder'

export function requireExpressionOfType(builder: NodeBuilder, ptype: PType, sourceLocation: SourceLocation): awst.Expression {
  if (builder instanceof LiteralExpressionBuilder || builder instanceof ConditionalExpressionBuilder) {
    return builder.resolveToPType(ptype, sourceLocation).resolve()
  }
  if (builder instanceof InstanceBuilder && builder.ptype?.equals(ptype)) {
    return builder.resolve()
  }
  throw new CodeError(`Expected expression of type ${ptype}, got ${builder.typeDescription}`, {
    sourceLocation,
  })
}

export function requestExpressionOfType(builder: NodeBuilder, ptype: PType, sourceLocation: SourceLocation): awst.Expression | undefined {
  if (builder instanceof LiteralExpressionBuilder) {
    if (builder.resolvableToPType(ptype, sourceLocation)) {
      return builder.resolveToPType(ptype, sourceLocation).resolve()
    }
    return undefined
  }
  if (builder instanceof InstanceBuilder && builder.ptype?.equals(ptype)) {
    return builder.resolve()
  }
  return undefined
}

export function requireInstanceBuilder(builder: NodeBuilder, sourceLocation: SourceLocation): InstanceBuilder {
  if (builder instanceof InstanceBuilder) return builder
  throw new CodeError(`Expected instance of a type, got ${builder.typeDescription}`, { sourceLocation })
}

export function requireExpressionsOfType<const TPTypes extends [...PType[]]>(
  builders: ReadonlyArray<InstanceBuilder>,
  ptypes: TPTypes,
  sourceLocation: SourceLocation,
): Array<awst.Expression> {
  if (builders.length === ptypes.length) {
    return builders.map((builder, i) => requireExpressionOfType(builder, ptypes[i], sourceLocation))
  }
  throw new CodeError(`Expected ${ptypes.length} args with types ${ptypes.join(', ')}`, { sourceLocation })
}

export function requireStringConstant(builder: InstanceBuilder, sourceLocation: SourceLocation): awst.StringConstant {
  const constant = requireConstantOfType(builder, stringPType, sourceLocation)
  codeInvariant(constant instanceof StringConstant, 'Expected string constant')
  return constant
}

export function requestConstantOfType(builder: NodeBuilder, ptype: PType, sourceLocation: SourceLocation): awst.Constant | undefined {
  if (builder instanceof LiteralExpressionBuilder) {
    if (builder.resolvableToPType(ptype, sourceLocation)) {
      const expr = builder.resolveToPType(ptype, sourceLocation).resolve()
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

function isConstant(expr: awst.Expression): expr is awst.Constant {
  return (
    expr instanceof awst.StringConstant ||
    expr instanceof awst.BytesConstant ||
    expr instanceof awst.IntegerConstant ||
    expr instanceof awst.BoolConstant
  )
}

export function requireConstantOfType(builder: NodeBuilder, ptype: PType, sourceLocation: SourceLocation): awst.Constant {
  const constExpr = requestConstantOfType(builder, ptype, sourceLocation)
  if (constExpr) return constExpr
  throw new CodeError(`Expected constant of type ${ptype}`, { sourceLocation })
}

export function requireConstantValue(builder: NodeBuilder, sourceLocation: SourceLocation): ConstantValue {
  if (builder instanceof ScalarLiteralExpressionBuilder) {
    return builder.value
  }
  const value = requireInstanceBuilder(builder, sourceLocation).resolve()
  codeInvariant(isConstant(value), 'Expected compile time constant')
  return value.value
}

export function isValidLiteralForPType(literalValue: ConstantValue, ptype: PType): boolean {
  if (ptype.equals(stringPType)) {
    return typeof literalValue === 'string'
  }
  if (ptype.equals(uint64PType)) {
    return typeof literalValue === 'bigint' && 0 <= literalValue && literalValue <= 2n ** 64n
  }
  if (ptype.equals(biguintPType)) {
    return typeof literalValue === 'bigint' && 0 <= literalValue && literalValue <= 2n ** 512n
  }
  if (ptype.equals(boolPType)) {
    return typeof literalValue === 'boolean'
  }
  if (ptype.equals(bytesPType)) {
    return literalValue instanceof Uint8Array
  }
  return false
}
