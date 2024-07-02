import { AppStorageDefinition, AppStorageKind, BytesConstant, BytesEncoding } from '../awst/nodes'
import { SourceLocation } from '../awst/source-location'
import { ContractClassType, GlobalStateType, LocalStateType } from './ptypes/ptype-classes'
import { invariant, utf8ToUint8Array } from '../util'
import { TodoError } from '../errors'
import { nodeFactory } from '../awst/node-factory'

export class AppStorageDeclaration {
  readonly memberName: string
  readonly ptype: GlobalStateType | LocalStateType
  readonly keyOverride: BytesConstant | undefined
  readonly sourceLocation: SourceLocation
  readonly definedIn: ContractClassType
  readonly description: string | undefined
  constructor(props: {
    memberName: string
    ptype: GlobalStateType | LocalStateType
    keyOverride: BytesConstant | undefined
    sourceLocation: SourceLocation
    definedIn: ContractClassType
    description: string | undefined
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
    throw new TodoError('Handle remaining ptypes')
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
    return {
      ...this,
      kind: this.kind,
      key: this.key,
      keyWtype: undefined,
      storageWtype: this.ptype.contentType.wtypeOrThrow,
    }
  }
}
