import type { SourceLocation } from './source-location'
import type { Props } from '../typescript-helpers'
import type { ContractClassPType } from '../awst_build/ptypes'

export enum OnCompletionAction {
  NoOp = 0,
  OptIn = 1,
  CloseOut = 2,
  ClearState = 3,
  UpdateApplication = 4,
  DeleteApplication = 5,
}

export enum ARC4CreateOption {
  Allow = 1,
  Require = 2,
  Disallow = 3,
}

class ModelBase {
  /**
   * This field prevents us from accidentally passing an object literal with structural equality to
   * a model class instead of any instance of the class, which would stuff up the serialization
   * @private
   */
  #isModel = true
}

export class ARC4BareMethodConfig extends ModelBase {
  readonly sourceLocation: SourceLocation | undefined
  readonly allowedCompletionTypes: OnCompletionAction[]
  readonly create: ARC4CreateOption
  readonly isBare = true as const
  constructor(props: Omit<Props<ARC4BareMethodConfig>, 'isBare'>) {
    super()
    this.sourceLocation = props.sourceLocation
    this.allowedCompletionTypes = props.allowedCompletionTypes
    this.create = props.create
  }
}

export type DefaultArgumentSource =
  | {
      source: 'constant'
      value: string | bigint | number | boolean | Uint8Array
    }
  | {
      source: 'global-state'
      memberName: string
    }
  | {
      source: 'local-state'
      memberName: string
    }
  | {
      source: 'abi-method'
      memberName: string
    }

export class ARC4ABIMethodConfig extends ModelBase {
  readonly sourceLocation: SourceLocation | undefined
  readonly name: string
  readonly isBare = false as const
  readonly create: ARC4CreateOption
  readonly readonly: boolean
  readonly allowedCompletionTypes: OnCompletionAction[]
  readonly defaultArgs: Record<string, DefaultArgumentSource>
  readonly structs: Record<string, ARC32StructDef>
  constructor(props: Omit<Props<ARC4ABIMethodConfig>, 'isBare'>) {
    super()
    this.sourceLocation = props.sourceLocation
    this.name = props.name
    this.create = props.create
    this.readonly = props.readonly
    this.allowedCompletionTypes = props.allowedCompletionTypes
    this.defaultArgs = props.defaultArgs
    this.structs = props.structs
  }
}

export interface ARC32StructDef {
  name: string
  elements: [...[string, string][]]
}

export class ContractReference extends ModelBase {
  constructor({ className, moduleName }: { className: string; moduleName: string }) {
    super()
    this.className = className
    this.moduleName = moduleName
  }
  readonly className: string
  readonly moduleName: string

  toString(): string {
    return `${this.moduleName}::${this.className}`
  }

  static fromPType(contractPType: ContractClassPType): ContractReference {
    return new ContractReference({
      className: contractPType.name,
      moduleName: contractPType.module,
    })
  }
}
export class LogicSigReference extends ModelBase {
  constructor({ name, moduleName }: { name: string; moduleName: string }) {
    super()
    this.name = name
    this.moduleName = moduleName
  }
  readonly name: string
  readonly moduleName: string

  toString(): string {
    return `${this.moduleName}::${this.name}`
  }
}

export enum TransactionKind {
  Payment = 1,
  KeyRegistration = 2,
  AssetConfig = 3,
  AssetTransfer = 4,
  AssetFreeze = 5,
  Application = 6,
}
