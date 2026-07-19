import type ts from 'typescript'
import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import { BytesConstant } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { wtypes } from '../../../awst/wtypes'
import { codeInvariant, invariant } from '../../../util'
import { AppStorageDeclaration } from '../../models/app-storage-declaration'
import type { ContractClassPType, PType } from '../../ptypes'
import { bytesPType, GlobalMapType, GlobalStateType, stringPType } from '../../ptypes'
import { instanceEb } from '../../type-registry'
import { FunctionBuilder, InstanceExpressionBuilder, type NodeBuilder } from '../index'
import { parseFunctionArgs } from '../util/arg-parsing'
import { GlobalStateExpressionBuilder } from './global-state'
import { extractKey } from './util'

export class GlobalMapFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation<ts.CallExpression>): NodeBuilder {
    const {
      ptypes: [keySuffixType, contentPType],
      args: [{ keyPrefix }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      funcName: 'GlobalMap',
      callLocation: sourceLocation,
      genericTypeArgs: 2,
      argSpec: (a) => [a.obj({ keyPrefix: a.optional(bytesPType, stringPType) })],
    })

    const ptype = new GlobalMapType({ content: contentPType, keyType: keySuffixType })
    return new GlobalMapFunctionResultBuilder(extractKey(keyPrefix, wtypes.stateKeyWType, sourceLocation), ptype, sourceLocation)
  }
}

export class GlobalMapExpressionBuilder extends InstanceExpressionBuilder<GlobalMapType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof GlobalMapType, 'ptype must be instance of GlobalMapType')
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
      funcName: 'GlobalMap',
    })

    return new GlobalStateExpressionBuilder(
      nodeFactory.mapPrefixedKeyExpression({
        key: key.resolve(),
        prefix: this._expr,
        sourceLocation: this.sourceLocation,
        wtype: wtypes.stateKeyWType,
      }),
      new GlobalStateType({
        content: this.ptype.contentType,
      }),
    )
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'keyPrefix':
        return instanceEb(nodeFactory.reinterpretCast({ expr: this.resolve(), wtype: wtypes.bytesWType, sourceLocation }), bytesPType)
    }
    return super.memberAccess(name, sourceLocation)
  }
}

export class GlobalMapFunctionResultBuilder extends GlobalMapExpressionBuilder {
  private readonly _keyPrefixExpr: Expression | undefined

  constructor(expr: Expression | undefined, ptype: PType, sourceLocation: SourceLocation) {
    super(expr ?? nodeFactory.voidConstant({ sourceLocation }), ptype)
    this._keyPrefixExpr = expr
  }

  resolve(): Expression {
    codeInvariant(
      this._keyPrefixExpr,
      'Global map must have explicit key prefix provided if not being assigned to a contract property',
      this.sourceLocation,
    )
    return this._keyPrefixExpr
  }

  buildStorageDeclaration(
    memberName: string,
    memberLocation: SourceLocation,
    memberDescription: string | null,
    contractType: ContractClassPType,
  ): AppStorageDeclaration {
    if (this._keyPrefixExpr)
      codeInvariant(
        this._keyPrefixExpr instanceof BytesConstant,
        `key prefix must be a compile time constant value if ${this.typeDescription} is assigned to a contract member`,
      )
    return new AppStorageDeclaration({
      sourceLocation: memberLocation,
      ptype: this.ptype,
      memberName: memberName,
      keyOverride: this._keyPrefixExpr ?? null,
      description: memberDescription,
      definedIn: contractType,
    })
  }
}
