import { nodeFactory } from '../../../../awst/node-factory'
import type { BoxValueExpression, Expression } from '../../../../awst/nodes'
import type { SourceLocation } from '../../../../awst/source-location'
import { wtypes } from '../../../../awst/wtypes'

import { invariant } from '../../../../util'
import type { PType } from '../../../ptypes'
import { boolPType, BoxRefPType, boxRefType, bytesPType, stringPType, TuplePType, uint64PType, voidPType } from '../../../ptypes'
import { instanceEb } from '../../../type-registry'
import { FunctionBuilder, type NodeBuilder } from '../../index'
import { parseFunctionArgs } from '../../util/arg-parsing'
import { extractKey } from '../util'
import { boxExists, boxLength, BoxProxyExpressionBuilder, boxValue, BoxValueExpressionBuilder } from './base'

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
      case 'key':
        return instanceEb(this.toBytes(sourceLocation), bytesPType)
      case 'get':
        return new BoxRefGetFunctionBuilder(boxValueExpr)
      case 'delete':
        return new BoxRefDeleteFunctionBuilder(boxValueExpr)
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
        return boxExists(boxValueExpr, sourceLocation)
      case 'maybe':
        return new BoxRefMaybeFunctionBuilder(boxValueExpr)
      case 'length':
        return boxLength(boxValueExpr, sourceLocation)
      case 'value':
        return new BoxValueExpressionBuilder(boxValueExpr, this.ptype.contentType)
    }
    return super.memberAccess(name, sourceLocation)
  }
}

abstract class BoxRefBaseFunctionBuilder extends FunctionBuilder {
  constructor(protected readonly boxValue: BoxValueExpression) {
    super(boxValue.sourceLocation)
  }
}

class BoxRefCreateFunctionBuilder extends BoxRefBaseFunctionBuilder {
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
        stackArgs: [this.boxValue.key, size.resolve()],
        wtype: wtypes.boolWType,
        immediates: [],
        sourceLocation,
      }),
      boolPType,
    )
  }
}
class BoxRefResizeFunctionBuilder extends BoxRefBaseFunctionBuilder {
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
        stackArgs: [this.boxValue.key, size.resolve()],
        wtype: wtypes.voidWType,
        immediates: [],
        sourceLocation,
      }),
      voidPType,
    )
  }
}
class BoxRefExtractFunctionBuilder extends BoxRefBaseFunctionBuilder {
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
        stackArgs: [this.boxValue.key, start.resolve(), length.resolve()],
        wtype: wtypes.bytesWType,
        immediates: [],
        sourceLocation,
      }),
      bytesPType,
    )
  }
}
class BoxRefReplaceFunctionBuilder extends BoxRefBaseFunctionBuilder {
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
        stackArgs: [this.boxValue.key, start.resolve(), value.resolve()],
        wtype: wtypes.voidWType,
        immediates: [],
        sourceLocation,
      }),
      voidPType,
    )
  }
}
class BoxRefGetFunctionBuilder extends BoxRefBaseFunctionBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [{ default: defaultValue }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      funcName: 'BoxRef.get',
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      argSpec: (a) => [a.obj({ default: a.optional(bytesPType) })],
    })

    if (defaultValue) {
      return instanceEb(
        nodeFactory.stateGet({
          sourceLocation,
          default: defaultValue.resolve(),
          wtype: wtypes.bytesWType,
          field: this.boxValue,
        }),
        bytesPType,
      )
    } else {
      return new BoxValueExpressionBuilder(this.boxValue, bytesPType)
    }
  }
}

class BoxRefPutFunctionBuilder extends BoxRefBaseFunctionBuilder {
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
        stackArgs: [this.boxValue.key, value.resolve()],
        wtype: wtypes.voidWType,
        immediates: [],
        sourceLocation,
      }),
      voidPType,
    )
  }
}
class BoxRefSpliceFunctionBuilder extends BoxRefBaseFunctionBuilder {
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
        stackArgs: [this.boxValue.key, start.resolve(), stop.resolve(), value.resolve()],
        wtype: wtypes.voidWType,
        immediates: [],
        sourceLocation,
      }),
      voidPType,
    )
  }
}

class BoxRefMaybeFunctionBuilder extends BoxRefBaseFunctionBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    parseFunctionArgs({
      args,
      typeArgs,
      funcName: 'BoxRef.maybe',
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      argSpec: () => [],
    })
    const type = new TuplePType({ items: [bytesPType, boolPType] })

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

class BoxRefDeleteFunctionBuilder extends BoxRefBaseFunctionBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    parseFunctionArgs({
      args,
      typeArgs,
      funcName: 'BoxRef.delete',
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      argSpec: () => [],
    })

    return instanceEb(
      nodeFactory.stateDelete({
        field: this.boxValue,
        sourceLocation,
        wtype: wtypes.boolWType,
      }),
      boolPType,
    )
  }
}
