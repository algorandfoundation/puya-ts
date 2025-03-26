import { spawn } from 'child_process'
import type { SourceLocation } from '../awst/source-location'
import { logger } from '../logger'
import { resolvePuyaPath } from './resolve-puya-path'

// LSP Protocol constants
const LSP_CONTENT_LENGTH_HEADER = 'Content-Length: '
const LSP_HEADER_DELIMITER = '\r\n\r\n'
const LSP_HEADER_DELIMITER_SIZE = 4

// Service configuration
const SERVICE_TIMEOUT_MS = 30000
const SERVICE_THREADS = 2
const MAX_BUFFER_SIZE = 10 * 1024 * 1024 // 10MB buffer limit

// Log levels
const LOG_LEVELS = {
  CRITICAL: 50,
  ERROR: 40,
  WARNING: 30,
  INFO: 20,
  DEBUG: 10,
  NOTSET: 0,
} as const

interface PuyaServiceLog {
  level: string
  message: string
  location?: SourceLocation
}

export type DebugCallback = (message: string) => void

/**
 * Maps numeric log levels to string literals
 */
function mapLogLevel(level: number): string {
  switch (level) {
    case LOG_LEVELS.CRITICAL:
      return 'critical'
    case LOG_LEVELS.ERROR:
      return 'error'
    case LOG_LEVELS.WARNING:
      return 'warning'
    case LOG_LEVELS.INFO:
      return 'info'
    case LOG_LEVELS.DEBUG:
      return 'debug'
    default:
      return 'notset'
  }
}

export class PuyaService {
  private process: ReturnType<typeof spawn> | null = null
  private messageId = 0
  private responseCallbacks = new Map<number, (result: unknown) => void>()
  private buffer = ''
  private debugCallback?: DebugCallback
  private headerRegex = new RegExp(`${LSP_CONTENT_LENGTH_HEADER}(\\d+)`)

  constructor(
    private cwd: string,
    debugCallback?: DebugCallback,
  ) {
    this.debugCallback = debugCallback
  }

  /**
   * Sets or updates the debug callback function
   */
  setDebugCallback(callback: DebugCallback) {
    this.debugCallback = callback
  }

  private log(message: string, level: 'debug' | 'error' = 'debug') {
    level === 'error' ? logger.error(undefined, message) : logger.debug(undefined, message)
    this.debugCallback?.(message)
  }

  private rejectAllCallbacks(reason: string) {
    for (const [id, callback] of this.responseCallbacks.entries()) {
      this.log(`Rejecting callback ${id}: ${reason}`, 'error')
      callback({ error: reason })
      this.responseCallbacks.delete(id)
    }
  }

  async start() {
    if (this.process) return

    try {
      const puyaPath = await resolvePuyaPath()
      this.process = spawn(puyaPath, ['--service', '--service-threads', `${SERVICE_THREADS}`], {
        cwd: this.cwd,
        stdio: ['pipe', 'pipe', 'pipe'],
      })

      this.process.on('error', (err) => {
        this.log(`Failed to start puya service: ${err.message}`, 'error')
        this.rejectAllCallbacks(`Service error: ${err.message}`)
      })

      this.process.on('exit', (code) => {
        this.log(`Puya service exited with code ${code}`, 'error')
        this.rejectAllCallbacks(`Service exited with code ${code}`)
        this.process = null
      })

      this.process.stdout?.on('data', this.handleStdout.bind(this))
      this.process.stderr?.on('data', this.handleStderr.bind(this))
    } catch (err) {
      this.log(`Failed to start puya service: ${err}`, 'error')
      throw err
    }
  }

  private handleStderr(data: Buffer) {
    const str = data.toString()
    this.log(`Puya stderr: ${str}`, 'debug')

    // Extract JSON responses from logs (as fallback)
    const match = str.match(/Sending data: ({.*})/)
    if (match) {
      try {
        const message = JSON.parse(match[1])
        if (message.id && this.responseCallbacks.has(message.id)) {
          this.responseCallbacks.get(message.id)!(message.result)
          this.responseCallbacks.delete(message.id)
        }
      } catch (err) {
        this.log(`Failed to parse JSON from stderr: ${err}`, 'error')
      }
    }
  }

  private handleStdout(data: Buffer) {
    this.buffer += data.toString()

    // Check buffer size limit
    if (this.buffer.length > MAX_BUFFER_SIZE) {
      this.log(`Buffer size exceeded ${MAX_BUFFER_SIZE} bytes, clearing buffer`, 'error')
      this.buffer = ''
      return
    }

    // Process complete LSP messages from buffer
    while (true) {
      const headerMatch = this.buffer.match(this.headerRegex)
      if (!headerMatch) break

      const contentLength = parseInt(headerMatch[1])
      const headerEndIndex = this.buffer.indexOf(LSP_HEADER_DELIMITER)

      if (headerEndIndex === -1) break

      const contentStartIndex = headerEndIndex + LSP_HEADER_DELIMITER_SIZE

      // Wait for complete message
      if (this.buffer.length < contentStartIndex + contentLength) break

      // Extract and process the message
      const content = this.buffer.substring(contentStartIndex, contentStartIndex + contentLength)
      this.buffer = this.buffer.substring(contentStartIndex + contentLength)

      try {
        const message = JSON.parse(content)
        if (message.id && this.responseCallbacks.has(message.id)) {
          this.responseCallbacks.get(message.id)!(message.result)
          this.responseCallbacks.delete(message.id)
        }
      } catch (err) {
        this.log(`Failed to parse LSP message: ${err}`, 'error')
      }
    }
  }

  /**
   * Creates and formats a JSON-RPC message with proper LSP headers
   */
  private createJsonRpcMessage(method: string, params: unknown, id: number): string {
    const request = {
      jsonrpc: '2.0',
      id,
      method,
      params,
    }

    const jsonContent = JSON.stringify(request)
    return `${LSP_CONTENT_LENGTH_HEADER}${Buffer.byteLength(jsonContent)}${LSP_HEADER_DELIMITER}${jsonContent}`
  }

  async compile(options: {
    awst: string
    compilationSet: Record<string, string>
    sourceAnnotations?: string
  }): Promise<{ logs: PuyaServiceLog[]; cancelled: boolean }> {
    if (!this.process) {
      await this.start()
      if (!this.process) throw new Error('Failed to start puya service')
    }

    const messageId = ++this.messageId
    const params = {
      awst: JSON.parse(options.awst),
      compilation_set: options.compilationSet,
      source_annotations: options.sourceAnnotations ? JSON.parse(options.sourceAnnotations) : undefined,
    }

    const message = this.createJsonRpcMessage('analyse', params, messageId)

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.responseCallbacks.delete(messageId)
        reject(new Error('Compilation request timed out'))
      }, SERVICE_TIMEOUT_MS)

      this.responseCallbacks.set(messageId, (result) => {
        clearTimeout(timeout)

        // Map numeric log levels to string literals
        const mappedResult = {
          ...(result as { logs: PuyaServiceLog[]; cancelled: boolean }),
          logs: (result as { logs: (PuyaServiceLog & { level: number })[]; cancelled: boolean }).logs.map((log) => ({
            ...log,
            level: mapLogLevel(log.level),
          })),
        }

        resolve(mappedResult)
      })

      this.process?.stdin?.write(message, (err) => {
        if (err) {
          clearTimeout(timeout)
          this.responseCallbacks.delete(messageId)
          reject(new Error(`Error writing to puya service: ${err}`))
        }
      })
    })
  }

  async stop() {
    if (!this.process) return

    // Clean up all pending callbacks
    this.rejectAllCallbacks('Service stopped')

    this.process.kill()
    this.process = null
    this.buffer = ''
  }
}
