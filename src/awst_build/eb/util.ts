import { ExpressionBuilder } from './index'
import { awst, wtypes } from '../../awst'
import { CodeError, InternalError } from '../../errors'
import { BytesExpressionBuilder } from './bytes-expression-builder'
import { nodeFactory } from '../../awst/node-factory'
import { UInt64ExpressionBuilder } from './uint64-expression-builder'
import { BoolExpressionBuilder } from './bool-expression-builder'

export function requireExpressionOfType(ebOrLit: ExpressionBuilder | awst.Literal, wtype: wtypes.WType): awst.Expression {
  const expr = requireExpression(ebOrLit)
  if (expr.wtype.equals(wtype)) {
    return expr
  }
  throw new CodeError(`Expected expression of type ${wtype}, got ${expr.wtype}`, {
    sourceLocation: expr.sourceLocation,
  })
}

export function requireExpressionsOfType<const TWTypes extends [...wtypes.WType[]]>(
  ebOrLits: ReadonlyArray<ExpressionBuilder | awst.Literal>,
  wtypes: TWTypes,
): Array<awst.Expression> {
  if (ebOrLits.length === wtypes.length) {
    return ebOrLits.map((ebOrLit, i) => requireExpressionOfType(ebOrLit, wtypes[i]))
  }
  throw new CodeError(`Expected ${wtypes.length} args with types ${wtypes.join(', ')}`, { sourceLocation: ebOrLits[0]?.sourceLocation })
}

export function requireLiteral(ebOrLit: ExpressionBuilder | awst.Literal): awst.Literal {
  if (!(ebOrLit instanceof awst.Literal))
    throw new CodeError(`Expected a literal value`, {
      sourceLocation: ebOrLit.sourceLocation,
    })
  return ebOrLit
}

export function requireExpression(ebOrLit: ExpressionBuilder | awst.Literal): awst.Expression {
  if (ebOrLit instanceof ExpressionBuilder) {
    return ebOrLit.rvalue()
  }
  if (ebOrLit.value instanceof Uint8Array) {
    return nodeFactory.bytesConstant({
      value: ebOrLit.value,
      sourceLocation: ebOrLit.sourceLocation,
    })
  }
  switch (typeof ebOrLit.value) {
    case 'bigint':
      return nodeFactory.uInt64Constant({
        value: ebOrLit.value,
        sourceLocation: ebOrLit.sourceLocation,
      })
    case 'boolean':
      return nodeFactory.boolConstant({
        value: ebOrLit.value,
        sourceLocation: ebOrLit.sourceLocation,
      })
    default:
      throw new InternalError(`Unsupported literal: ${typeof ebOrLit.value}`)
  }
}

export function requireExpressionBuilder(ebOrLit: ExpressionBuilder | awst.Literal): ExpressionBuilder {
  if (ebOrLit instanceof ExpressionBuilder) {
    return ebOrLit
  }
  if (ebOrLit.value instanceof Uint8Array) {
    return new BytesExpressionBuilder(
      nodeFactory.bytesConstant({
        value: ebOrLit.value,
        sourceLocation: ebOrLit.sourceLocation,
      }),
    )
  }
  switch (typeof ebOrLit.value) {
    case 'bigint':
      return new UInt64ExpressionBuilder(
        nodeFactory.uInt64Constant({
          value: ebOrLit.value,
          sourceLocation: ebOrLit.sourceLocation,
        }),
      )
    case 'boolean':
      return new BoolExpressionBuilder(
        nodeFactory.boolConstant({
          value: ebOrLit.value,
          sourceLocation: ebOrLit.sourceLocation,
        }),
      )
    default:
      throw new InternalError(`Unsupported literal: ${typeof ebOrLit.value}`)
  }
}
