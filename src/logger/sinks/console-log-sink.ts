import chalk from 'chalk'
import type { SourceLocation } from '../../awst/source-location'
import type { LogEvent } from '../index'
import { isMinLevel, LoggingContext, LogLevel } from '../index'
import type { LogSink } from './index'

type ColorFn = (text: string) => string
const levelConfig: Record<LogEvent['level'], { colorFn: ColorFn; writeFn: (...args: unknown[]) => void }> = {
  /* eslint-disable no-console */
  debug: { colorFn: chalk.green, writeFn: console.debug },
  info: { colorFn: chalk.green, writeFn: console.info },
  warning: { colorFn: chalk.yellow, writeFn: console.warn },
  error: { colorFn: chalk.red, writeFn: console.error },
  critical: { colorFn: chalk.red, writeFn: console.error },
  /* eslint-enable no-console */
}

export class ConsoleLogSink implements LogSink {
  constructor(public readonly minLogLevel: LogLevel) {}

  add(logEvent: LogEvent): void {
    const config = levelConfig[logEvent.level]

    let logText = `${config.colorFn(logEvent.level)}: ${logEvent.message}`
    if (logEvent.sourceLocation) {
      const sourceLocationText = logEvent.sourceLocation.toString()
      const indentSize = sourceLocationText.length + logEvent.level.length + 4

      const sourceSummary = isMinLevel(logEvent.level, LogLevel.Warning) ? this.getSourceSummary(logEvent.sourceLocation, indentSize) : ''
      logText = `${sourceLocationText} ${logText}${sourceSummary}`
    }
    if (isMinLevel(LogLevel.Debug, this.minLogLevel) && logEvent.stack) {
      logText += `\n ${logEvent.stack}`
    }
    config.writeFn(logText)
  }

  getSourceSummary(sourceLocation: SourceLocation, indent: number): string {
    const sourceFile = sourceLocation.file && LoggingContext.current.sourcesByPath[sourceLocation.file.toString()]
    if (!sourceFile || sourceLocation.scope === 'file') return ''

    const line = sourceFile[sourceLocation.line - 1]
    const trimmedLine = line.trimStart()
    const marker = `${''.padStart(sourceLocation.column - (line.length - trimmedLine.length))}^${''.padStart(Math.max(sourceLocation.endColumn - sourceLocation.column - 1, 0), '~')}`
    const indentChars = ''.padStart(indent, ' ')
    return `\n${indentChars}${trimmedLine}\n${indentChars}${marker}`
  }
}
