import type { LogEvent, LogLevel } from '../index'

export type LogSink = {
  readonly minLogLevel: LogLevel
  add(e: LogEvent): void
}
