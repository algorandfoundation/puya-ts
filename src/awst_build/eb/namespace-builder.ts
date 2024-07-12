import { NodeBuilder } from './index'
import { PType } from '../ptypes'
import { SourceLocation } from '../../awst/source-location'
import { NamespacePType } from '../ptypes/ptype-classes'
import { codeInvariant, invariant } from '../../util'
import { SymbolName } from '../symbol-name'
import { typeRegistry } from '../type-registry'

export class NamespaceBuilder extends NodeBuilder {
  private readonly _ptype: NamespacePType
  constructor(sourceLocation: SourceLocation, ptype: PType) {
    super(sourceLocation)
    invariant(ptype instanceof NamespacePType, 'NamespaceBuilder must be constructed with NamespacePType')
    this._ptype = ptype
  }

  get ptype(): PType {
    return this._ptype
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    const symbolName = new SymbolName({ module: this._ptype.module, name })

    const type = typeRegistry.tryResolveSingletonName(symbolName)
    codeInvariant(type, `${name} does not exist in namespace ${this._ptype}`)

    return typeRegistry.getSingletonEb(type, sourceLocation)
  }
}
