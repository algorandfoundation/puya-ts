import type * as lsp from 'vscode-languageserver/node'
import type { LogEvent } from '../index'
import { LogLevel } from '../index'
import type { LogSink } from './index'

export class LanguageServerLogSink implements LogSink {
  constructor(private connection: lsp.Connection) {}

  minLogLevel = LogLevel.Debug

  add(e: LogEvent): void {
    if (e.sourceLocation) return // Ignore code specific logs

    switch (e.level) {
      case 'error':
      case 'info':
      case 'debug':
        this.connection.console[e.level](e.message)
        break
      case 'warning':
        this.connection.console.warn(e.message)
        break
      case 'critical':
        this.connection.console.error(e.message)
        break
    }
  }
}
