import type * as lsp from 'vscode-languageserver/node'

type LogLevel = 'info' | 'debug' | 'log' | 'warn' | 'error'
export class LsLogger {
  constructor(private readonly connection: lsp.Connection) {}

  info(message: string) {
    return this.#sendLog('info', message)
  }
  debug(message: string) {
    return this.#sendLog('debug', message)
  }
  log(message: string) {
    return this.#sendLog('log', message)
  }
  warn(message: string) {
    return this.#sendLog('warn', message)
  }
  error(message: string) {
    return this.#sendLog('error', message)
  }

  #sendLog(type: LogLevel, message: string) {
    this.connection.console[type](message)
  }
}
