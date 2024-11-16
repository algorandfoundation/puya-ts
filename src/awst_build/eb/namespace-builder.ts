import type { SourceLocation } from '../../awst/source-location'
import { invariant } from '../../util'
import type { PType } from '../ptypes'
import { NamespacePType } from '../ptypes'
import { NodeBuilder } from './index'

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
}
