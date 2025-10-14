import { AsyncLocalStorage } from 'node:async_hooks'
import { SourceLocation } from '../awst/source-location'
import { PuyaError } from '../errors'
import { invariant } from '../util'
import type { LogSink } from './sinks'

type NodeOrSourceLocation = SourceLocation | { sourceLocation: SourceLocation }

export enum LogLevel {
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
  Debug = 'debug',
  Critical = 'critical',
}
export const logLevelToInt = {
  // values match puya values
  [LogLevel.Critical]: 50,
  [LogLevel.Error]: 40,
  [LogLevel.Info]: 30,
  [LogLevel.Warning]: 20,
  [LogLevel.Debug]: 10,
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
  stack?: string
}

class PuyaLogger {
  private logSinks: LogSink[] = []
  public configure(sinks: LogSink[]) {
    this.logSinks = sinks
  }

  addLog(level: LogEvent['level'], source: NodeOrSourceLocation | undefined, message: string, stack?: string) {
    const logEvent: LogEvent = {
      sourceLocation: source ? (source instanceof SourceLocation ? source : source.sourceLocation) : undefined,
      message,
      level,
      stack,
    }
    LoggingContext.current.logEvents.push(logEvent)
    for (const sink of this.logSinks) {
      if (isMinLevel(logEvent.level, sink.minLogLevel)) {
        sink.add(logEvent)
      }
    }
  }

  error(error: Error): void
  error(source: NodeOrSourceLocation | undefined, message: string): void
  error(sourceOrError: NodeOrSourceLocation | undefined | Error, message?: string): void {
    if (sourceOrError instanceof Error) {
      // Don't include the stack for user errors as the message and source location is what's relevant
      this.addLog(LogLevel.Error, tryGetSourceLocationFromError(sourceOrError), `${sourceOrError.message}`, sourceOrError.stack)
      if (sourceOrError.cause) {
        this.addLog(
          LogLevel.Debug,
          tryGetSourceLocationFromError(sourceOrError.cause),
          `Caused by: ${sourceOrError.cause}`,
          (sourceOrError.cause as Error).stack,
        )
      }
    } else {
      invariant(message, 'Log should include either a message or an error')
      this.addLog(LogLevel.Error, sourceOrError, message, new Error().stack)
    }
  }
  info(source: NodeOrSourceLocation | undefined, message: string): void {
    this.addLog(LogLevel.Info, source, message)
  }
  debug(source: NodeOrSourceLocation | undefined, message: string): void {
    this.addLog(LogLevel.Debug, source, message)
  }
  warn(source: NodeOrSourceLocation | undefined, message: string): void {
    this.addLog(LogLevel.Warning, source, message)
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

export const patchErrorLocation = <TArgs extends unknown[], TReturn>(
  action: (...args: TArgs) => TReturn,
  sourceLocation: SourceLocation,
) => {
  return (...args: TArgs) => {
    try {
      return action(...args)
    } catch (e) {
      if (e instanceof PuyaError && !e.sourceLocation) {
        Object.assign(e, { sourceLocation })
      }
      throw e
    }
  }
}

export class LoggingContext {
  logEvents: LogEvent[] = []
  sourcesByPath: Record<string, string[]> = {}

  private constructor() {}

  hasErrors(): boolean {
    return this.logEvents.some((e) => isErrorOrCritical(e.level))
  }

  exitIfErrors(): void {
    if (this.hasErrors()) process.exit(1)
  }

  enterContext() {
    LoggingContext.asyncStore.enterWith(this)
    return this
  }

  run<R>(cb: () => R) {
    return LoggingContext.asyncStore.run(this, cb)
  }
  private static fallbackContext = new LoggingContext()
  private static asyncStore = new AsyncLocalStorage<LoggingContext>()

  static create(): LoggingContext {
    return new LoggingContext()
  }
  static get current() {
    const ctx = this.asyncStore.getStore()
    if (!ctx) {
      return this.fallbackContext
    }
    return ctx
  }
}
