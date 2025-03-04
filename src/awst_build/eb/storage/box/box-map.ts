import { intrinsicFactory } from '../../../../awst/intrinsic-factory'
import { nodeFactory } from '../../../../awst/node-factory'
import type { BoxValueExpression, Expression } from '../../../../awst/nodes'
import type { SourceLocation } from '../../../../awst/source-location'
import { wtypes } from '../../../../awst/wtypes'

import { invariant } from '../../../../util'
import type { PType } from '../../../ptypes'
import { boolPType, BoxMapPType, bytesPType, stringPType, TuplePType, voidPType } from '../../../ptypes'
import { instanceEb } from '../../../type-registry'
import { FunctionBuilder, type NodeBuilder } from '../../index'
import { parseFunctionArgs } from '../../util/arg-parsing'
import { extractKey } from '../util'
import { boxExists, boxLength, BoxProxyExpressionBuilder, BoxValueExpressionBuilder } from './base'

export class BoxMapFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      ptypes: [keySuffixType, contentPType],
      args: [{ keyPrefix }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      funcName: `BoxMap`,
      callLocation: sourceLocation,
      genericTypeArgs: 2,
      argSpec: (a) => [a.obj({ keyPrefix: a.required(bytesPType, stringPType) })],
    })

    const ptype = new BoxMapPType({ content: contentPType, keyType: keySuffixType })
    return new BoxMapExpressionBuilder(extractKey(keyPrefix, wtypes.boxKeyWType), ptype)
  }
}

export class BoxMapExpressionBuilder extends BoxProxyExpressionBuilder<BoxMapPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof BoxMapPType, 'BoxMapExpressionBuilder must be constructed with ptype of BoxMapPType')
    super(expr, ptype)
  }
  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'keyPrefix':
        return instanceEb(this.toBytes(sourceLocation), bytesPType)
      case 'set':
        return new BoxMapSetFunctionBuilder(this._expr, this.ptype, sourceLocation)
      case 'delete':
        return new BoxMapDeleteFunctionBuilder(this._expr, this.ptype, sourceLocation)
      case 'get':
        return new BoxMapGetFunctionBuilder(this._expr, this.ptype, sourceLocation)
      case 'has':
        return new BoxMapHasFunctionBuilder(this._expr, this.ptype, sourceLocation)
      case 'maybe':
        return new BoxMapMaybeFunctionBuilder(this._expr, this.ptype, sourceLocation)
      case 'length':
        return new BoxMapLengthFunctionBuilder(this._expr, this.ptype, sourceLocation)
    }
    return super.memberAccess(name, sourceLocation)
  }
}

abstract class BoxMapFunctionBuilderBase extends FunctionBuilder {
  #mapPType: BoxMapPType
  #boxMapExpr: Expression
  constructor(boxMapExpr: Expression, mapPType: BoxMapPType, sourceLocation: SourceLocation) {
    super(sourceLocation)
    this.#mapPType = mapPType
    this.#boxMapExpr = boxMapExpr
  }
  protected get contentType() {
    return this.#mapPType.contentType
  }
  protected get keyType() {
    return this.#mapPType.keyType
  }
  protected boxValueExpression(key: Expression): BoxValueExpression {
    const keyBytes = instanceEb(key, this.keyType).toBytes(this.sourceLocation)

    return nodeFactory.boxValueExpression({
      sourceLocation: this.sourceLocation,
      existsAssertionMessage: 'Box must have value',
      key: intrinsicFactory.bytesConcat({
        left: this.#boxMapExpr,
        right: keyBytes,
        sourceLocation: this.sourceLocation,
      }),
      wtype: this.contentType.wtypeOrThrow,
    })
  }
}
class BoxMapHasFunctionBuilder extends BoxMapFunctionBuilderBase {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [key],
    } = parseFunctionArgs({
      args,
      typeArgs,
      funcName: 'BoxMap.has',
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      argSpec: (a) => [a.required(this.keyType)],
    })
    return boxExists(this.boxValueExpression(key.resolve()), sourceLocation)
  }
}

class BoxMapGetFunctionBuilder extends BoxMapFunctionBuilderBase {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [key, { default: defaultValue }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      funcName: 'BoxMap.get',
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      argSpec: (a) => [a.required(this.keyType), a.obj({ default: a.optional(this.contentType) })],
    })

    if (defaultValue) {
      return instanceEb(
        nodeFactory.stateGet({
          sourceLocation,
          default: defaultValue.resolve(),
          wtype: this.contentType.wtypeOrThrow,
          field: this.boxValueExpression(key.resolve()),
        }),
        this.contentType,
      )
    } else {
      return new BoxValueExpressionBuilder(this.boxValueExpression(key.resolve()), this.contentType)
    }
  }
}
class BoxMapSetFunctionBuilder extends BoxMapFunctionBuilderBase {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [key, value],
    } = parseFunctionArgs({
      args,
      typeArgs,
      funcName: 'BoxMap.set',
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      argSpec: (a) => [a.required(this.keyType), a.required(this.contentType)],
    })

    return instanceEb(
      nodeFactory.assignmentExpression({
        target: this.boxValueExpression(key.resolve()),
        sourceLocation,
        value: value.resolve(),
      }),
      this.contentType,
    )
  }
}
class BoxMapMaybeFunctionBuilder extends BoxMapFunctionBuilderBase {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [key],
    } = parseFunctionArgs({
      args,
      typeArgs,
      funcName: 'BoxMap.maybe',
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      argSpec: (a) => [a.required(this.keyType)],
    })
    const type = new TuplePType({ items: [this.contentType, boolPType] })

    return instanceEb(
      nodeFactory.stateGetEx({
        field: this.boxValueExpression(key.resolve()),
        sourceLocation,
        wtype: type.wtype,
      }),
      type,
    )
  }
}
class BoxMapLengthFunctionBuilder extends BoxMapFunctionBuilderBase {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [key],
    } = parseFunctionArgs({
      args,
      typeArgs,
      funcName: 'BoxMap.length',
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      argSpec: (a) => [a.required(this.keyType)],
    })

    return boxLength(this.boxValueExpression(key.resolve()), sourceLocation)
  }
}
class BoxMapDeleteFunctionBuilder extends BoxMapFunctionBuilderBase {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [key],
    } = parseFunctionArgs({
      args,
      typeArgs,
      funcName: 'BoxMap.delete',
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      argSpec: (a) => [a.required(this.keyType)],
    })

    return instanceEb(
      nodeFactory.stateDelete({
        field: this.boxValueExpression(key.resolve()),
        sourceLocation,
        wtype: wtypes.voidWType,
      }),
      voidPType,
    )
  }
}
