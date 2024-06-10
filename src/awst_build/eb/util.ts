import { InstanceBuilder, NodeBuilder } from './index'
import { awst } from '../../awst'
import { CodeError } from '../../errors'
import { bytesPType, PType, uint64PType } from '../ptypes'
import { SourceLocation } from '../../awst/source-location'
import { LiteralExpressionBuilder } from './literal-expression-builder'
import { BytesExpressionBuilder } from './bytes-expression-builder'
import { nodeFactory } from '../../awst/node-factory'
import { UInt64ExpressionBuilder } from './uint64-expression-builder'

export function requireExpressionOfType(builder: InstanceBuilder, ptype: PType, sourceLocation: SourceLocation): awst.Expression {
  if (builder instanceof LiteralExpressionBuilder) {
    return convertLiteral(builder, ptype, sourceLocation).resolve()
  }
  if (builder.ptype?.equals(ptype)) {
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

function convertLiteral(builder: LiteralExpressionBuilder, ptype: PType, sourceLocation: SourceLocation): InstanceBuilder {
  if (ptype.equals(bytesPType)) {
    if (builder.value instanceof Uint8Array) {
      return new BytesExpressionBuilder(nodeFactory.bytesConstant({ value: builder.value, sourceLocation }))
    }
  } else if (ptype.equals(uint64PType)) {
    if (typeof builder.value === 'bigint') {
      return new UInt64ExpressionBuilder(nodeFactory.uInt64Constant({ value: builder.value, sourceLocation }))
    }
  }

  throw new CodeError(`Literal cannot be converted to type ${ptype.name}`, { sourceLocation })
}
