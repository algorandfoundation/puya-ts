import { PType } from '../ptypes'
import { NodeBuilder } from './index'
import { SourceLocation } from '../../awst/source-location'
import { ContractClassPType, GlobalStateType } from '../ptypes/ptype-classes'
import { BaseContractMethodExpressionBuilder, ContractMethodExpressionBuilder } from './free-subroutine-expression-builder'
import { GlobalStateExpressionBuilder } from './storage/global-state'
import { nodeFactory } from '../../awst/node-factory'

export class ContractThisBuilder extends NodeBuilder {
  private readonly _ptype: ContractClassPType
  constructor(ptype: ContractClassPType, sourceLocation: SourceLocation) {
    super(sourceLocation)
    this._ptype = ptype
  }

  get ptype(): PType {
    return this._ptype
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    const property = this._ptype.properties[name]
    if (property) {
      if (property instanceof GlobalStateType) {
        // TODO: Retrieve key for global state
        return new GlobalStateExpressionBuilder(nodeFactory.bytesConstant({ value: new Uint8Array(), sourceLocation }), property)
      }
    }
    const method = this._ptype.methods[name]
    if (method) {
      return new ContractMethodExpressionBuilder(sourceLocation, method)
    }
    return super.memberAccess(name, sourceLocation)
  }
}

export class ContractSuperBuilder extends NodeBuilder {
  private readonly _ptype: ContractClassPType
  constructor(ptype: ContractClassPType, sourceLocation: SourceLocation) {
    super(sourceLocation)
    this._ptype = ptype
  }

  get ptype(): PType {
    return this._ptype
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    const property = this._ptype.properties[name]
    if (property) {
      if (property instanceof GlobalStateType) {
        // TODO: Retrieve key for global state
        return new GlobalStateExpressionBuilder(nodeFactory.bytesConstant({ value: new Uint8Array(), sourceLocation }), property)
      }
    }
    const method = this._ptype.methods[name]
    if (method) {
      return new BaseContractMethodExpressionBuilder(sourceLocation, method, this._ptype)
    }
    return super.memberAccess(name, sourceLocation)
  }
}
