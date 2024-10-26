import { nodeFactory } from '../../../../awst/node-factory'
import type { BoxValueExpression, Expression } from '../../../../awst/nodes'
import type { SourceLocation } from '../../../../awst/source-location'
import { wtypes } from '../../../../awst/wtypes'

import { invariant } from '../../../../util'
import type { PType } from '../../../ptypes'
import { boolPType, BoxRefPType, boxRefType, bytesPType, stringPType, uint64PType, voidPType } from '../../../ptypes'
import { instanceEb } from '../../../type-registry'
import { FunctionBuilder, type NodeBuilder } from '../../index'
import { parseFunctionArgs } from '../../util/arg-parsing'
import { extractKey } from '../util'
import { BoxProxyExpressionBuilder, boxValue, BoxValueExpressionBuilder } from './base'

export class BoxRefFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [{ key }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      funcName: `BoxRef`,
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      argSpec: (a) => [a.obj({ key: a.required(bytesPType, stringPType) })],
    })

    return new BoxRefExpressionBuilder(extractKey(key, wtypes.boxKeyWType), boxRefType)
  }
}

export class BoxRefExpressionBuilder extends BoxProxyExpressionBuilder<BoxRefPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof BoxRefPType, 'BoxRefExpressionBuilder must be constructed with ptype of BoxRefPType')
    super(expr, ptype)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    const boxValueExpr = boxValue({
      key: this._expr,
      sourceLocation,
      contentType: this.ptype.contentType,
    })
    switch (name) {
      case 'put':
        return new BoxRefPutFunctionBuilder(boxValueExpr)
      case 'splice':
        return new BoxRefSpliceFunctionBuilder(boxValueExpr)
      case 'create':
        return new BoxRefCreateFunctionBuilder(boxValueExpr)
      case 'resize':
        return new BoxRefResizeFunctionBuilder(boxValueExpr)
      case 'extract':
        return new BoxRefExtractFunctionBuilder(boxValueExpr)
      case 'replace':
        return new BoxRefReplaceFunctionBuilder(boxValueExpr)
      case 'exists':
      case 'length': {
        const boxLength = nodeFactory.intrinsicCall({
          opCode: 'box_len',
          stackArgs: [boxValueExpr],
          wtype: new wtypes.WTuple({ types: [wtypes.uint64WType, wtypes.boolWType], immutable: true }),
          immediates: [],
          sourceLocation,
        })
        if (name === 'exists') {
          return instanceEb(
            nodeFactory.tupleItemExpression({
              base: boxLength,
              sourceLocation,
              index: 1n,
            }),
            boolPType,
          )
        } else {
          return instanceEb(
            nodeFactory.checkedMaybe({
              expr: boxLength,
              comment: 'Box must exist',
            }),
            uint64PType,
          )
        }
      }
      case 'value':
        return new BoxValueExpressionBuilder(boxValueExpr, this.ptype.contentType)
    }
    return super.memberAccess(name, sourceLocation)
  }
}

export abstract class BoxRefBaseFunctionBuilder extends FunctionBuilder {
  constructor(protected readonly boxValue: BoxValueExpression) {
    super(boxValue.sourceLocation)
  }
}

export class BoxRefCreateFunctionBuilder extends BoxRefBaseFunctionBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [{ size }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      funcName: 'BoxRef.create',
      callLocation: sourceLocation,
      argSpec: (a) => [a.obj({ size: a.required(uint64PType) })],
    })
    return instanceEb(
      nodeFactory.intrinsicCall({
        opCode: 'box_create',
        stackArgs: [this.boxValue, size.resolve()],
        wtype: wtypes.boolWType,
        immediates: [],
        sourceLocation,
      }),
      boolPType,
    )
  }
}
export class BoxRefResizeFunctionBuilder extends BoxRefBaseFunctionBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [size],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      funcName: 'BoxRef.resize',
      callLocation: sourceLocation,
      argSpec: (a) => [a.required(uint64PType)],
    })
    return instanceEb(
      nodeFactory.intrinsicCall({
        opCode: 'box_resize',
        stackArgs: [this.boxValue, size.resolve()],
        wtype: wtypes.voidWType,
        immediates: [],
        sourceLocation,
      }),
      voidPType,
    )
  }
}
export class BoxRefExtractFunctionBuilder extends BoxRefBaseFunctionBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [start, length],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      funcName: 'BoxRef.extract',
      callLocation: sourceLocation,
      argSpec: (a) => [a.required(uint64PType), a.required(uint64PType)],
    })
    return instanceEb(
      nodeFactory.intrinsicCall({
        opCode: 'box_extract',
        stackArgs: [this.boxValue, start.resolve(), length.resolve()],
        wtype: wtypes.bytesWType,
        immediates: [],
        sourceLocation,
      }),
      bytesPType,
    )
  }
}
export class BoxRefReplaceFunctionBuilder extends BoxRefBaseFunctionBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [start, value],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      funcName: 'BoxRef.replace',
      callLocation: sourceLocation,
      argSpec: (a) => [a.required(uint64PType), a.required(bytesPType)],
    })
    return instanceEb(
      nodeFactory.intrinsicCall({
        opCode: 'box_replace',
        stackArgs: [this.boxValue, start.resolve(), value.resolve()],
        wtype: wtypes.voidWType,
        immediates: [],
        sourceLocation,
      }),
      voidPType,
    )
  }
}

export class BoxRefPutFunctionBuilder extends BoxRefBaseFunctionBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [value],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      funcName: 'BoxRef.put',
      callLocation: sourceLocation,
      argSpec: (a) => [a.required(bytesPType)],
    })
    return instanceEb(
      nodeFactory.intrinsicCall({
        opCode: 'box_put',
        stackArgs: [this.boxValue, value.resolve()],
        wtype: wtypes.voidWType,
        immediates: [],
        sourceLocation,
      }),
      voidPType,
    )
  }
}
export class BoxRefSpliceFunctionBuilder extends BoxRefBaseFunctionBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [start, stop, value],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      funcName: 'BoxRef.splice',
      callLocation: sourceLocation,
      argSpec: (a) => [a.required(uint64PType), a.required(uint64PType), a.required(bytesPType)],
    })
    return instanceEb(
      nodeFactory.intrinsicCall({
        opCode: 'box_splice',
        stackArgs: [this.boxValue, start.resolve(), stop.resolve(), value.resolve()],
        wtype: wtypes.voidWType,
        immediates: [],
        sourceLocation,
      }),
      voidPType,
    )
  }
}
