import type { SourceLocation } from '../awst/source-location'
import type { PType } from '../awst_build/ptypes'
import type { LogLevel } from '../logger'
import type { TextEdit } from '../text-edit'

export abstract class QuickFix {
  readonly logLevel: LogLevel
  readonly message: string
  readonly sourceLocation: SourceLocation
  readonly edits: readonly TextEdit[]
  readonly requiredSymbols: readonly PType[]

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
    requiredSymbols: PType[]
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
