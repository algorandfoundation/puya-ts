import { InstanceBuilder, NodeBuilder } from './index'
import { awst } from '../../awst'
import { CodeError } from '../../errors'
import { PType } from '../ptypes'
import { SourceLocation } from '../../awst/source-location'
import { LiteralExpressionBuilder } from './literal-expression-builder'

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
  builder: InstanceBuilder,
  sourceLocation: SourceLocation,
): awst.StringConstant | awst.BytesConstant | awst.IntegerConstant | awst.BoolConstant {
  const expr = builder.resolve()
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
