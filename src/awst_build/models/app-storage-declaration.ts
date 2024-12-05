import { nodeFactory } from '../../awst/node-factory'
import type { AppStorageDefinition, BytesConstant } from '../../awst/nodes'
import { AppStorageKind, BytesEncoding } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { CodeError } from '../../errors'
import { invariant, utf8ToUint8Array } from '../../util'
import type { ContractClassPType, StorageProxyPType } from '../ptypes'
import { BoxMapPType, BoxPType, BoxRefPType, GlobalStateType, LocalStateType } from '../ptypes'

export class AppStorageDeclaration {
  readonly memberName: string
  readonly ptype: GlobalStateType | LocalStateType | BoxMapPType | BoxPType | BoxRefPType
  readonly keyOverride: BytesConstant | null
  readonly sourceLocation: SourceLocation
  readonly definedIn: ContractClassPType
  readonly description: string | null
  constructor(props: {
    memberName: string
    ptype: StorageProxyPType
    keyOverride: BytesConstant | null
    sourceLocation: SourceLocation
    definedIn: ContractClassPType
    description: string | null
  }) {
    this.memberName = props.memberName
    this.ptype = props.ptype
    this.keyOverride = props.keyOverride
    this.sourceLocation = props.sourceLocation
    this.definedIn = props.definedIn
    this.description = props.description
  }

  get kind(): AppStorageKind {
    if (this.ptype instanceof GlobalStateType) {
      return AppStorageKind.appGlobal
    }
    if (this.ptype instanceof LocalStateType) {
      return AppStorageKind.appGlobal
    }
    invariant(
      this.ptype instanceof BoxPType || this.ptype instanceof BoxRefPType || this.ptype instanceof BoxMapPType,
      'Must be exhaustive check on ptype',
    )
    return AppStorageKind.box
  }

  get key(): BytesConstant {
    if (this.keyOverride) {
      invariant(this.keyOverride.wtype.equals(this.ptype.wtype), 'Key wtype must match ptype')
      return this.keyOverride
    } else {
      return nodeFactory.bytesConstant({
        value: utf8ToUint8Array(this.memberName),
        sourceLocation: this.sourceLocation,
        encoding: BytesEncoding.utf8,
        wtype: this.ptype.wtype,
      })
    }
  }

  get definition(): AppStorageDefinition {
    if (!this.ptype.contentType.wtype || !this.ptype.contentType.wtype.scalarType) {
      throw new CodeError(`${this.ptype.contentType.fullName} is not a valid type for storage`, { sourceLocation: this.sourceLocation })
    }
    return nodeFactory.appStorageDefinition({
      ...this,
      kind: this.kind,
      key: this.key,
      keyWtype: null,
      storageWtype: this.ptype.contentType.wtypeOrThrow,
    })
  }
}
