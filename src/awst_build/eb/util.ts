import { InstanceBuilder, LiteralExpressionBuilder, NodeBuilder } from './index'
import { awst } from '../../awst'
import { CodeError } from '../../errors'
import { PType } from '../ptypes'
import { SourceLocation } from '../../awst/source-location'
import { DeliberateAny } from '../../typescript-helpers'

export function requireExpressionOfType(builder: NodeBuilder, ptype: PType, sourceLocation: SourceLocation): awst.Expression {
  if (builder instanceof LiteralExpressionBuilder) {
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

export function requireConstant(
  builder: NodeBuilder,
  sourceLocation: SourceLocation,
): awst.StringConstant | awst.BytesConstant | awst.IntegerConstant | awst.BoolConstant {
  const expr = requireInstanceBuilder(builder, sourceLocation).resolve()
  if (expr instanceof awst.StringConstant) {
    return expr
  }
  if (expr instanceof awst.BytesConstant) {
    return expr
  }
  if (expr instanceof awst.IntegerConstant) {
    return expr
  }
  if (expr instanceof awst.BoolConstant) {
    return expr
  }
  throw new CodeError(`Expected compile time constant value`, { sourceLocation })
}
export function requireSpecificConstant<T extends awst.Constant>(
  builder: InstanceBuilder,
  sourceLocation: SourceLocation,
  constantType: { new (...args: DeliberateAny): T },
): T {
  const expr = builder.resolve()
  if (expr instanceof constantType) {
    return expr
  }
  throw new CodeError(`Expected compile time constant value`, { sourceLocation })
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
