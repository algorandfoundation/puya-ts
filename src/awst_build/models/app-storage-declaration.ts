import { nodeFactory } from '../../awst/node-factory'
import type { AppStorageDefinition, BytesConstant } from '../../awst/nodes'
import { AppStorageKind, BytesEncoding } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { CodeError } from '../../errors'
import { invariant, utf8ToUint8Array } from '../../util'
import type { AppStorageType, ContractClassPType } from '../ptypes'
import { BoxMapPType, BoxPType, GlobalStateType, LocalStateType, TransientType, UnsupportedType } from '../ptypes'

export class AppStorageDeclaration {
  readonly memberName: string
  readonly ptype: AppStorageType
  readonly keyOverride: BytesConstant | null
  readonly sourceLocation: SourceLocation
  readonly definedIn: ContractClassPType
  readonly description: string | null
  constructor(props: {
    memberName: string
    ptype: AppStorageType
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
      return AppStorageKind.accountLocal
    }
    invariant(this.ptype instanceof BoxPType || this.ptype instanceof BoxMapPType, 'Must be exhaustive check on ptype')
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
    if (this.ptype.contentType instanceof UnsupportedType || this.ptype.contentType instanceof TransientType) {
      throw new CodeError(`Type ${this.ptype.contentType} cannot be used for storage`, { sourceLocation: this.sourceLocation })
    }
    return nodeFactory.appStorageDefinition({
      ...this,
      kind: this.kind,
      key: this.key,
      keyWtype: this.ptype instanceof BoxMapPType ? this.ptype.keyType.wtypeOrThrow : null,
      storageWtype: this.ptype.contentType.wtypeOrThrow,
    })
  }
}
