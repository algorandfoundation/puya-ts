import { SourceLocation } from './awst/source-location'
import chalk from 'chalk'
import { AwstBuildFailureError, CodeError, PuyaError, TodoError } from './errors'

type ColorFn = (text: string) => string
const levelConfig: Record<LogEvent['level'], { colorFn: ColorFn; writeFn: (...args: unknown[]) => void; order: number }> = {
  /* eslint-disable no-console */
  debug: { colorFn: chalk.green, writeFn: console.debug, order: 0 },
  info: { colorFn: chalk.green, writeFn: console.info, order: 1 },
  warn: { colorFn: chalk.yellow, writeFn: console.warn, order: 2 },
  error: { colorFn: chalk.red, writeFn: console.error, order: 3 },
  critical: { colorFn: chalk.red, writeFn: console.error, order: 4 },
  /* eslint-enable no-console */
}

type NodeOrSourceLocation = SourceLocation | { sourceLocation: SourceLocation }

export enum LogLevel {
  Error = 'error',
  Info = 'info',
  Warn = 'warn',
  Debug = 'debug',
  Critical = 'critical',
}

export type LogEvent = {
  level: LogLevel
  message: string
  sourceLocation: SourceLocation | undefined
}

class PuyaLogger {
  private logEvents: LogEvent[] = []
  private minLogLevel: LogLevel = LogLevel.Debug

  public configure(options?: { outputToConsole?: boolean; minLogLevel?: LogLevel }) {
    if (options?.outputToConsole !== undefined) this.outputToConsole = options.outputToConsole
    if (options?.minLogLevel !== undefined) {
      this.minLogLevel = options.minLogLevel
    }
  }

  outputToConsole: boolean = true
  constructor() {}

  private addLog(level: LogEvent['level'], source: NodeOrSourceLocation | undefined, message: string) {
    const config = levelConfig[level]
    if (config.order < levelConfig[this.minLogLevel].order) return

    const logEvent: LogEvent = {
      sourceLocation: source ? (source instanceof SourceLocation ? source : source.sourceLocation) : undefined,
      message,
      level,
    }
    this.logEvents.push(logEvent)
    if (!this.outputToConsole) return

    let logText = `${config.colorFn(logEvent.level)}: ${logEvent.message}`
    if (logEvent.sourceLocation) {
      logText = `${logEvent.sourceLocation} ${logText}`
    }
    config.writeFn(logText)
  }

  reset(): void {
    this.logEvents = []
  }

  hasErrors(): boolean {
    return this.logEvents.some((e) => e.level === 'error')
  }

  export(): LogEvent[] {
    return this.logEvents.slice()
  }

  error(error: Error): void
  error(source: NodeOrSourceLocation | undefined, message: string): void
  error(source: NodeOrSourceLocation | undefined | Error, message?: string): void {
    if (source instanceof Error) {
      const stack = source instanceof CodeError ? '' : source.stack
      this.addLog(LogLevel.Error, tryGetSourceLocationFromError(source), `${source.message} \n${stack}`)
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
  fatal(source: NodeOrSourceLocation | undefined, message: string): void {
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
      logger.warn(sourceLocation, `TODO: ${e.message}`)
    } else if (e instanceof PuyaError) {
      logger.error(sourceLocation, e.message)
    } else {
      throw e
    }
    throw new AwstBuildFailureError()
  }
}
