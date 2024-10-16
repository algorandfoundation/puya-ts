import chalk from 'chalk'
import type { SourceLocation } from '../../awst/source-location'
import type { LogEvent, LogLevel } from '../index'
import { LoggingContext } from '../index'
import type { LogSink } from './index'

type ColorFn = (text: string) => string
const levelConfig: Record<LogEvent['level'], { colorFn: ColorFn; writeFn: (...args: unknown[]) => void }> = {
  /* eslint-disable no-console */
  debug: { colorFn: chalk.green, writeFn: console.debug },
  info: { colorFn: chalk.green, writeFn: console.info },
  warn: { colorFn: chalk.yellow, writeFn: console.warn },
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

      logText = `${sourceLocationText} ${logText}${this.getSourceSummary(logEvent.sourceLocation, indentSize)}`
    }
    config.writeFn(logText)
  }

  getSourceSummary(sourceLocation: SourceLocation, indent: number): string {
    const sourceFile = LoggingContext.current.sourcesByPath[sourceLocation.file]
    if (!sourceFile) return ''

    const line = sourceFile[sourceLocation.line - 1]
    const trimmedLine = line.trimStart()
    const marker = `${''.padStart(sourceLocation.column - (line.length - trimmedLine.length))}^${''.padStart(Math.max(sourceLocation.endColumn - sourceLocation.column - 1, 0), '~')}`
    const indentChars = ''.padStart(indent, ' ')
    return `\n${indentChars}${trimmedLine}\n${indentChars}${marker}`
  }
}
