import type { SourceLocation } from '../awst/source-location'
import type { LogLevel } from '../logger'

export type Position = {
  line: number
  col: number
}

export type Range = {
  start: Position
  end: Position
}

export type TextEdit = {
  range: Range
  newText: string
}

export abstract class QuickFix {
  readonly logLevel: LogLevel
  readonly message: string
  readonly sourceLocation: SourceLocation
  readonly edits: TextEdit[]

  protected constructor({
    logLevel,
    message,
    sourceLocation,
    edits,
  }: {
    logLevel: LogLevel
    sourceLocation: SourceLocation
    message: string
    edits: TextEdit[]
  }) {
    this.logLevel = logLevel
    this.message = message
    this.sourceLocation = sourceLocation
    this.edits = edits
  }

  get logData(): [logLevel: LogLevel, sourceLocation: SourceLocation, message: string] {
    return [this.logLevel, this.sourceLocation, this.message]
  }
}
