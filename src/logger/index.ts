import { AsyncLocalStorage } from 'node:async_hooks'
import type { SourceLocation } from '../awst/source-location'
import type { CodeFix } from '../code-fix/code-fix'
import { FixableCodeError, PuyaError } from '../errors'
import { invariant } from '../util'
import type { LogSink } from './sinks'

type NodeOrSourceLocation = SourceLocation //| { sourceLocation: SourceLocation }

export enum LogLevel {
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
  Debug = 'debug',
  Critical = 'critical',
}

export enum LogSource {
  Unspecified,
  TypeScript,
  Puya,
  CodeFix,
}
const logLevelToInt = {
  [LogLevel.Critical]: 4,
  [LogLevel.Error]: 3,
  [LogLevel.Info]: 1,
  [LogLevel.Warning]: 2,
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
  stack?: string
  logSource: LogSource
  codeFix?: CodeFix
}

class PuyaLogger {
  private logSinks: LogSink[] = []
  public configure(sinks: LogSink[]) {
    this.logSinks = sinks
  }

  addCodeFix(codeFix: CodeFix) {
    invariant(codeFix.sourceLocation.file, 'Code fix cannot be added without a well-formed source location')
    this.addLog(codeFix.logData)
  }

  addLog(logEvent: LogEvent) {
    LoggingContext.current.addLog(logEvent)
    for (const sink of this.logSinks) {
      if (isMinLevel(logEvent.level, sink.minLogLevel)) {
        sink.add(logEvent)
      }
    }
  }

  error(error: Error): void
  error(source: NodeOrSourceLocation | undefined, message: string): void
  error(sourceOrError: NodeOrSourceLocation | undefined | Error, message?: string): void {
    if (sourceOrError instanceof FixableCodeError) {
      this.addCodeFix(sourceOrError.codeFix)
    } else if (sourceOrError instanceof Error) {
      // Don't include the stack for user errors as the message and source location is what's relevant
      this.addLog({
        level: LogLevel.Error,
        sourceLocation: tryGetSourceLocationFromError(sourceOrError),
        message: `${sourceOrError.message}`,
        stack: sourceOrError.stack,
        logSource: LogSource.Unspecified,
      })
      if (sourceOrError.cause) {
        this.addLog({
          level: LogLevel.Debug,
          sourceLocation: tryGetSourceLocationFromError(sourceOrError.cause),
          message: `Caused by: ${sourceOrError.cause}`,
          stack: (sourceOrError.cause as Error).stack,
          logSource: LogSource.Unspecified,
        })
      }
    } else {
      invariant(message, 'Log should include either a message or an error')
      this.addLog({
        level: LogLevel.Error,
        sourceLocation: sourceOrError,
        message,
        stack: new Error().stack,
        logSource: LogSource.Unspecified,
      })
    }
  }
  info(source: NodeOrSourceLocation | undefined, message: string): void {
    this.addLog({ level: LogLevel.Info, sourceLocation: source, message, logSource: LogSource.Unspecified })
  }
  debug(source: NodeOrSourceLocation | undefined, message: string): void {
    this.addLog({ level: LogLevel.Debug, sourceLocation: source, message, logSource: LogSource.Unspecified })
  }
  warn(source: NodeOrSourceLocation | undefined, message: string): void {
    this.addLog({ level: LogLevel.Warning, sourceLocation: source, message, logSource: LogSource.Unspecified })
  }
  critical(source: NodeOrSourceLocation | undefined, message: string): void {
    this.addLog({ level: LogLevel.Critical, sourceLocation: source, message, logSource: LogSource.Unspecified })
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
  #logEvents: LogEvent[] = []
  #sourcesByPath: Record<string, string[]> = {}
  #logEventsByPath: Record<string, LogEvent[]> = {}

  get logEvents(): readonly LogEvent[] {
    return this.#logEvents
  }
  get logEventsByPath(): { readonly [path: string]: readonly LogEvent[] } {
    return this.#logEventsByPath
  }

  get sourcesByPath(): { readonly [path: string]: readonly string[] } {
    return this.#sourcesByPath
  }

  setSourcesByPath(sourcesByPath: Record<string, string[]>) {
    this.#sourcesByPath = sourcesByPath
    // Ensure every source file has an entry in #logEventsByPath
    for (const filePath of Object.keys(sourcesByPath)) {
      if (filePath in this.#logEventsByPath) continue
      this.#logEventsByPath[filePath] = []
    }
  }

  addLog(log: LogEvent) {
    this.#logEvents.push(log)
    const filePath = log.sourceLocation?.file
    if (filePath) {
      if (filePath in this.#logEventsByPath) {
        this.#logEventsByPath[filePath].push(log)
      } else {
        this.#logEventsByPath[filePath] = [log]
      }
    }
  }

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
