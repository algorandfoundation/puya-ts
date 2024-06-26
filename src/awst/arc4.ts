import { SourceLocation } from './source-location'

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

export interface ARC4BareMethodConfig {
  source_location: SourceLocation | undefined
  allowed_completion_types: [...OnCompletionAction[]]
  create: ARC4CreateOption
  is_bare: true
}

export interface ARC4ABIMethodConfig {
  source_location: SourceLocation | undefined
  name: string
  is_bare: false
  create: ARC4CreateOption
  readonly: boolean
  allowed_completion_types: [...OnCompletionAction[]]
  default_args: Record<string, string>
  structs: Readonly<Record<string, ARC32StructDef>>
}

export interface ARC32StructDef {
  name: string
  elements: [...[string, string][]]
}
