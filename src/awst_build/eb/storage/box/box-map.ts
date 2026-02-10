import type ts from 'typescript'
import { nodeFactory } from '../../../../awst/node-factory'
import type { Expression } from '../../../../awst/nodes'
import type { SourceLocation } from '../../../../awst/source-location'
import { wtypes } from '../../../../awst/wtypes'

import { invariant } from '../../../../util'
import type { PType } from '../../../ptypes'
import { BoxMapPType, BoxPType, bytesPType, stringPType } from '../../../ptypes'
import { FunctionBuilder, type NodeBuilder } from '../../index'
import { parseFunctionArgs } from '../../util/arg-parsing'
import { assertCanBeUsedForStorage, extractKey } from '../util'
import { BoxProxyExpressionBuilder } from './base'
import { BoxExpressionBuilder } from './box'

export class BoxMapFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation<ts.CallExpression>): NodeBuilder {
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
    assertCanBeUsedForStorage(contentPType, sourceLocation)

    const ptype = new BoxMapPType({ content: contentPType, keyType: keySuffixType })
    return new BoxMapExpressionBuilder(extractKey(keyPrefix, wtypes.boxKeyWType, sourceLocation), ptype)
  }
}

export class BoxMapExpressionBuilder extends BoxProxyExpressionBuilder<BoxMapPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof BoxMapPType, 'BoxMapExpressionBuilder must be constructed with ptype of BoxMapPType')
    super(expr, ptype)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation<ts.CallExpression>): NodeBuilder {
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
      nodeFactory.boxPrefixedKeyExpression({
        key: key.resolve(),
        prefix: this._expr,
        sourceLocation: this.sourceLocation,
        wtype: wtypes.boxKeyWType,
      }),
      new BoxPType({
        content: this.ptype.contentType,
      }),
    )
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'keyPrefix':
        return this.toBytes(sourceLocation)
    }
    return super.memberAccess(name, sourceLocation)
  }
}
