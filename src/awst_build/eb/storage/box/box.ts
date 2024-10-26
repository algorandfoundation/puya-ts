import { nodeFactory } from '../../../../awst/node-factory'
import type { BoxValueExpression, Expression } from '../../../../awst/nodes'
import type { SourceLocation } from '../../../../awst/source-location'
import { wtypes } from '../../../../awst/wtypes'
import { invariant } from '../../../../util'
import type { PType } from '../../../ptypes'
import { boolPType, BoxPType, bytesPType, stringPType, TuplePType, uint64PType } from '../../../ptypes'
import { instanceEb } from '../../../type-registry'
import { BooleanExpressionBuilder } from '../../boolean-expression-builder'
import { FunctionBuilder, type NodeBuilder, ParameterlessFunctionBuilder } from '../../index'
import { parseFunctionArgs } from '../../util/arg-parsing'
import { VoidExpressionBuilder } from '../../void-expression-builder'
import { extractKey } from '../util'
import { BoxProxyExpressionBuilder, boxValue, BoxValueExpressionBuilder } from './base'

export class BoxFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      ptypes: [contentPType],
      args: [{ key }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      funcName: `Box`,
      callLocation: sourceLocation,
      genericTypeArgs: 1,
      argSpec: (a) => [a.obj({ key: a.required(bytesPType, stringPType) })],
    })

    const ptype = new BoxPType({ content: contentPType })
    return new BoxExpressionBuilder(extractKey(key, wtypes.boxKeyWType), ptype)
  }
}

export class BoxExpressionBuilder extends BoxProxyExpressionBuilder<BoxPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof BoxPType, 'BoxExpressionBuilder must be constructed with ptype of BoxPType')
    super(expr, ptype)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    const boxValueExpr = boxValue({
      key: this._expr,
      sourceLocation,
      contentType: this.ptype.contentType,
    })
    switch (name) {
      case 'value':
        return new BoxValueExpressionBuilder(boxValueExpr, this.ptype.contentType)
      case 'exists':
        return new BooleanExpressionBuilder(
          nodeFactory.stateExists({
            field: boxValueExpr,
            sourceLocation,
            wtype: wtypes.boolWType,
          }),
        )
      case 'length':
        return instanceEb(
          nodeFactory.checkedMaybe({
            expr: nodeFactory.intrinsicCall({
              opCode: 'box_len',
              stackArgs: [boxValueExpr],
              wtype: new wtypes.WTuple({ types: [wtypes.uint64WType, wtypes.boolWType], immutable: true }),
              immediates: [],
              sourceLocation,
            }),
            comment: 'Box must exist',
          }),
          uint64PType,
        )
      case 'delete':
        return new BoxDeleteFunctionBuilder(boxValueExpr, sourceLocation)
      case 'get':
        return new BoxGetFunctionBuilder(boxValueExpr, this.ptype.contentType, sourceLocation)
      case 'maybe':
        return new BoxMaybeFunctionBuilder(boxValueExpr, this.ptype.contentType, sourceLocation)
    }
    return super.memberAccess(name, sourceLocation)
  }
}

class BoxDeleteFunctionBuilder extends ParameterlessFunctionBuilder {
  constructor(boxValue: BoxValueExpression, sourceLocation: SourceLocation) {
    super(
      boxValue,
      (expr) =>
        new VoidExpressionBuilder(
          nodeFactory.stateDelete({
            sourceLocation,
            field: boxValue,
            wtype: wtypes.voidWType,
          }),
        ),
    )
  }
}

class BoxGetFunctionBuilder extends FunctionBuilder {
  constructor(
    private readonly boxValue: BoxValueExpression,
    private readonly contentType: PType,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [{ default: defaultValue }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      funcName: 'Box.get',
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      argSpec: (a) => [a.obj({ default: a.optional(this.contentType) })],
    })

    if (defaultValue) {
      return instanceEb(
        nodeFactory.stateGet({
          sourceLocation,
          default: defaultValue.resolve(),
          wtype: this.contentType.wtypeOrThrow,
          field: this.boxValue,
        }),
        this.contentType,
      )
    } else {
      return new BoxValueExpressionBuilder(this.boxValue, this.contentType)
    }
  }
}
class BoxMaybeFunctionBuilder extends FunctionBuilder {
  constructor(
    private readonly boxValue: BoxValueExpression,
    private readonly contentType: PType,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    parseFunctionArgs({
      args,
      typeArgs,
      funcName: 'Box.maybe',
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      argSpec: () => [],
    })
    const type = new TuplePType({ items: [this.contentType, boolPType] })

    return instanceEb(
      nodeFactory.stateGetEx({
        sourceLocation,
        wtype: type.wtype,
        field: this.boxValue,
      }),
      type,
    )
  }
}
