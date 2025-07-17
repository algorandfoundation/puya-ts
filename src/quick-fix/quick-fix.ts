import type { SourceLocation } from '../awst/source-location'
import type { LogLevel } from '../logger'
import type { TextEdit } from '../text-edit'

export type RequiredSymbol = {
  name: string
  module: string
  typeOnly?: boolean
}

export abstract class QuickFix {
  readonly logLevel: LogLevel
  readonly message: string
  readonly sourceLocation: SourceLocation
  readonly edits: readonly TextEdit[]
  readonly requiredSymbols: readonly RequiredSymbol[]

  protected constructor({
    logLevel,
    message,
    sourceLocation,
    edits,
    requiredSymbols,
  }: {
    logLevel: LogLevel
    sourceLocation: SourceLocation
    message: string
    edits: TextEdit[]
    requiredSymbols: RequiredSymbol[]
  }) {
    this.logLevel = logLevel
    this.message = message
    this.sourceLocation = sourceLocation
    this.edits = edits
    this.requiredSymbols = requiredSymbols
  }

  get logData(): [logLevel: LogLevel, sourceLocation: SourceLocation, message: string] {
    return [this.logLevel, this.sourceLocation, this.message]
  }
}
