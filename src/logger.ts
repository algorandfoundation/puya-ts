import { createColorFormatter } from '@makerx/color-console'
import { SourceLocation } from './awst/source-location'
import chalk from 'chalk'
import ts from 'typescript'
import Log = ts.server.typingsInstaller.Log
import { CodeError, PuyaError, TodoError } from './errors'

const colorLogger = {
  info: createColorFormatter(chalk.cyan, chalk.blue, 'info', console),
  debug: createColorFormatter(chalk.white, chalk.white.bold, 'log', console),
  warn: createColorFormatter(chalk.yellow, chalk.yellow.bold, 'warn', console),
  // success: createColorFormatter(chalk.green, chalk.green.bold, 'log', console),
  error: createColorFormatter(chalk.red, chalk.red.bold, 'error', console),
  fatal: createColorFormatter(chalk.redBright, chalk.red.bold, 'error', console),
}

type NodeOrSourceLocation = SourceLocation | { sourceLocation: SourceLocation }

type LogEvent = {
  level: 'error' | 'info' | 'warn' | 'debug' | 'fatal'
  message: string
  sourceLocation: SourceLocation | undefined
}

class PuyaLogger {
  private logEvents: LogEvent[] = []
  constructor() {}

  private addLog(level: LogEvent['level'], source: NodeOrSourceLocation | undefined, message: string) {
    const logEvent: LogEvent = {
      sourceLocation: source ? (source instanceof SourceLocation ? source : source.sourceLocation) : undefined,
      message,
      level,
    }
    this.logEvents.push(logEvent)
    const paddedLevel = `     ${logEvent.level}`.slice(-5)
    if (logEvent.sourceLocation) {
      colorLogger[logEvent.level]`${logEvent.sourceLocation} [${paddedLevel}] ${logEvent.message}`
    } else {
      colorLogger[logEvent.level]`[${paddedLevel}] ${logEvent.message}`
    }
  }

  error(error: Error): void
  error(source: NodeOrSourceLocation | undefined, message: string): void
  error(source: NodeOrSourceLocation | undefined | Error, message?: string): void {
    if (source instanceof Error) {
      const stack = source instanceof CodeError ? '' : source.stack
      this.addLog('error', tryGetSourceLocationFromError(source), `${source.message} \n${stack}`)
      if (source.cause) {
        this.addLog('error', tryGetSourceLocationFromError(source.cause), `Caused by: ${source.cause}`)
      }
    } else {
      this.addLog('error', source, message ?? '')
    }
  }
  info(source: NodeOrSourceLocation | undefined, message: string): void {
    this.addLog('info', source, message)
  }
  debug(source: NodeOrSourceLocation | undefined, message: string): void {
    this.addLog('debug', source, message)
  }
  warn(source: NodeOrSourceLocation | undefined, message: string): void {
    this.addLog('warn', source, message)
  }
  fatal(source: NodeOrSourceLocation | undefined, message: string): void {
    this.addLog('fatal', source, message)
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
    // TODO: Maybe remove this
    return undefined as T
  }
}
