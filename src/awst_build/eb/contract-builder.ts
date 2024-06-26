import { PType } from '../ptypes'
import { NodeBuilder } from './index'
import { SourceLocation } from '../../awst/source-location'
import { ContractClassType } from '../ptypes/ptype-classes'

export class ContractThisBuilder extends NodeBuilder {
  private readonly _ptype: ContractClassType
  constructor(ptype: ContractClassType, sourceLocation: SourceLocation) {
    super(sourceLocation)
    this._ptype = ptype
  }

  get ptype(): PType {
    return this._ptype
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    return super.memberAccess(name, sourceLocation)
  }
}
