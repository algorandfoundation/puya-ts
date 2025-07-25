import type { SourceLocation } from '../awst/source-location'
import type { LogEvent, LogLevel } from '../logger'
import { LogSource } from '../logger'
import type { TextEdit } from '../text-edit'

export type RequiredSymbol = {
  name: string
  module: string
  typeOnly?: boolean
}

export abstract class CodeFix {
  readonly logLevel: LogLevel
  readonly errorMessage: string
  readonly fixMessage: string
  readonly sourceLocation: SourceLocation
  readonly edits: readonly TextEdit[]
  readonly requiredSymbols: readonly RequiredSymbol[]

  protected constructor({
    logLevel,
    errorMessage,
    fixMessage,
    sourceLocation,
    edits,
    requiredSymbols,
  }: {
    logLevel: LogLevel
    sourceLocation: SourceLocation
    errorMessage: string
    fixMessage: string
    edits: TextEdit[]
    requiredSymbols: RequiredSymbol[]
  }) {
    this.logLevel = logLevel
    this.errorMessage = errorMessage
    this.fixMessage = fixMessage
    this.sourceLocation = sourceLocation
    this.edits = edits
    this.requiredSymbols = requiredSymbols
  }

  get logData(): LogEvent {
    return {
      level: this.logLevel,
      sourceLocation: this.sourceLocation,
      message: this.errorMessage,
      logSource: LogSource.CodeFix,
      codeFix: this,
    }
  }
}
