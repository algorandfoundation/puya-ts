import type { SourceLocation } from './source-location'

export enum OnCompletionAction {
  NoOp = 0,
  OptIn = 1,
  CloseOut = 2,
  ClearState = 3,
  UpdateApplication = 4,
  DeleteApplication = 5,
}

export enum ARC4CreateOption {
  Allow = 'allow',
  Require = 'require',
  Disallow = 'disallow',
}

class ModelBase {
  /**
   * This field prevents us from accidentally passing an object literal with structural equality to
   * a model class instead of any instance of the class, which would stuff up the serialization
   * @private
   */
  #isModel = true
}

export interface ARC4BareMethodConfig {
  source_location: SourceLocation | undefined
  allowed_completion_types: [...OnCompletionAction[]]
  create: ARC4CreateOption
  is_bare: true
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

export interface ARC4ABIMethodConfig {
  source_location: SourceLocation | undefined
  name: string
  is_bare: false
  create: ARC4CreateOption
  readonly: boolean
  allowed_completion_types: [...OnCompletionAction[]]
  defaultArgs: Record<string, DefaultArgumentSource>
  structs: Record<string, ARC32StructDef>
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
}
export class LogicSigReference extends ModelBase {
  constructor({ name, moduleName }: { name: string; moduleName: string }) {
    super()
    this.name = name
    this.moduleName = moduleName
  }
  readonly name: string
  readonly moduleName: string
}
