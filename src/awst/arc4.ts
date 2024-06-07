import { SourceLocation } from './source-location'

export enum OnCompletionAction {
  NoOp = 0,
  OptIn = 1,
  CloseOut = 2,
  ClearState = 3,
  UpdateApplication = 4,
  DeleteApplication = 5,
}

export interface ARC4MethodConfig {
  source_location: SourceLocation | undefined
  name: string
  is_bare: boolean
  allow_create: boolean
  require_create: boolean
  readonly: boolean
  allowed_completion_types: [...OnCompletionAction[]]

  default_args: Record<string, string>
  structs: Readonly<Record<string, ARC32StructDef>>
}

export interface ARC32StructDef {
  name: string
  elements: [...[string, string][]]
}
