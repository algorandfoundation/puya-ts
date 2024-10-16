import { SourceLocation } from '../awst/source-location'
import { AwstBuildFailureError, CodeError, PuyaError, TodoError } from '../errors'
import type { LogSink } from './sinks'

type NodeOrSourceLocation = SourceLocation | { sourceLocation: SourceLocation }

export enum LogLevel {
  Error = 'error',
  Info = 'info',
  Warn = 'warn',
  Debug = 'debug',
  Critical = 'critical',
}
const logLevelToInt = {
  [LogLevel.Critical]: 4,
  [LogLevel.Error]: 3,
  [LogLevel.Info]: 1,
  [LogLevel.Warn]: 2,
  [LogLevel.Debug]: 0,
}

export const isMinLevel = (logLevel: LogLevel, minLevel: LogLevel): boolean => {
  return logLevelToInt[minLevel] <= logLevelToInt[logLevel]
}

const errorOrCritical = new Set([LogLevel.Error, LogLevel.Critical])

export const isErrorOrCritical = (l: LogLevel) => errorOrCritical.has(l)

export type LogEvent = {
  level: LogLevel
  message: string
  sourceLocation: SourceLocation | undefined
}

class PuyaLogger {
  private logSinks: LogSink[] = []
  public configure(sinks: LogSink[]) {
    this.logSinks = sinks
  }

  private addLog(level: LogEvent['level'], source: NodeOrSourceLocation | undefined, message: string) {
    const logEvent: LogEvent = {
      sourceLocation: source ? (source instanceof SourceLocation ? source : source.sourceLocation) : undefined,
      message,
      level,
    }
    LoggingContext.current.logEvents.push(logEvent)
    for (const sink of this.logSinks) {
      if (isMinLevel(logEvent.level, sink.minLogLevel)) sink.add(logEvent)
    }
  }

  error(error: Error): void
  error(source: NodeOrSourceLocation | undefined, message: string): void
  error(source: NodeOrSourceLocation | undefined | Error, message?: string): void {
    if (source instanceof Error) {
      const stack = source instanceof CodeError ? '' : `\n ${source.stack}`
      this.addLog(LogLevel.Error, tryGetSourceLocationFromError(source), `${source.message}${stack}`)
      if (source.cause) {
        this.addLog(LogLevel.Error, tryGetSourceLocationFromError(source.cause), `Caused by: ${source.cause}`)
      }
    } else {
      this.addLog(LogLevel.Error, source, message ?? '')
    }
  }
  info(source: NodeOrSourceLocation | undefined, message: string): void {
    this.addLog(LogLevel.Info, source, message)
  }
  debug(source: NodeOrSourceLocation | undefined, message: string): void {
    this.addLog(LogLevel.Debug, source, message)
  }
  warn(source: NodeOrSourceLocation | undefined, message: string): void {
    this.addLog(LogLevel.Warn, source, message)
  }
  critical(source: NodeOrSourceLocation | undefined, message: string): void {
    this.addLog(LogLevel.Critical, source, message)
  }
}

const tryGetSourceLocationFromError = (error: unknown): SourceLocation | undefined => {
  if (error instanceof PuyaError) {
    return error.sourceLocation
  }
  return undefined
}

export const logger = new PuyaLogger()

export const logPuyaExceptions = <T>(action: () => T, sourceLocation: SourceLocation): T => {
  try {
    return action()
  } catch (e) {
    if (e instanceof TodoError) {
      logger.warn(e.sourceLocation ?? sourceLocation, `TODO: ${e.message}`)
    } else if (e instanceof PuyaError) {
      logger.error(e.sourceLocation ?? sourceLocation, e.message)
    } else {
      throw e
    }
    throw new AwstBuildFailureError()
  }
}

export class LoggingContext implements Disposable {
  logEvents: LogEvent[] = []
  sourcesByPath: Record<string, string[]> = {}

  private constructor() {}

  hasErrors(): boolean {
    return this.logEvents.some((e) => isErrorOrCritical(e.level))
  }

  exitIfErrors(): void {
    if (this.hasErrors()) process.exit(1)
  }

  private static contexts: LoggingContext[] = []

  static create(): Disposable & LoggingContext {
    const ctx = new LoggingContext()
    this.contexts.push(ctx)
    return ctx
  }
  static get current() {
    const top = LoggingContext.contexts.at(-1)
    if (!top) {
      throw new Error('There is no current context')
    }
    return top
  }

  [Symbol.dispose]() {
    const top = LoggingContext.contexts.pop()
    if (top !== this) throw new Error('Parent context is being disposed before a child context')
  }
}
