import { intrinsicFactory } from '../../../../awst/intrinsic-factory'
import type { Expression } from '../../../../awst/nodes'
import type { SourceLocation } from '../../../../awst/source-location'
import { wtypes } from '../../../../awst/wtypes'

import { invariant } from '../../../../util'
import type { PType } from '../../../ptypes'
import { BoxMapPType, BoxPType, bytesPType, stringPType } from '../../../ptypes'
import { instanceEb } from '../../../type-registry'
import { FunctionBuilder, type NodeBuilder } from '../../index'
import { parseFunctionArgs } from '../../util/arg-parsing'
import { extractKey } from '../util'
import { BoxProxyExpressionBuilder } from './base'
import { BoxExpressionBuilder } from './box'
import { checkBoxType } from './util'

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
    checkBoxType(contentPType, sourceLocation)

    const ptype = new BoxMapPType({ content: contentPType, keyType: keySuffixType })
    return new BoxMapExpressionBuilder(extractKey(keyPrefix, wtypes.boxKeyWType), ptype)
  }
}

export class BoxMapExpressionBuilder extends BoxProxyExpressionBuilder<BoxMapPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof BoxMapPType, 'BoxMapExpressionBuilder must be constructed with ptype of BoxMapPType')
    super(expr, ptype)
  }
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [key],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      argSpec: (a) => [a.required(this.ptype.keyType)],
      funcName: 'BoxMap',
    })

    return new BoxExpressionBuilder(
      intrinsicFactory.bytesConcat({
        left: this._expr,
        right: key.toBytes(sourceLocation),
        sourceLocation: this.sourceLocation,
      }),
      new BoxPType({
        content: this.ptype.contentType,
      }),
    )
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'keyPrefix':
        return instanceEb(this.toBytes(sourceLocation), bytesPType)
    }
    return super.memberAccess(name, sourceLocation)
  }
}
