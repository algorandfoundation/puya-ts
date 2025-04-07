import { spawn } from 'child_process'
import * as rpc from 'vscode-jsonrpc/node'
import type { SourceLocation } from '../awst/source-location'
import { logger } from '../logger'
import { resolvePuyaPath } from './resolve-puya-path'

// Service configuration
const SERVICE_TIMEOUT_MS = 30000

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

interface AnalyseParams {
  awst: unknown
  compilation_set: Record<string, string>
  source_annotations?: unknown
}

interface AnalyseResult {
  logs: Array<PuyaServiceLog & { level: number }>
  cancelled: boolean
}

export class PuyaService {
  private process: ReturnType<typeof spawn> | null = null
  private _connection: rpc.MessageConnection | null = null
  private analyseRequest = new rpc.RequestType<AnalyseParams, AnalyseResult, void>('analyse')

  constructor(private cwd: string) {}

  private get connection(): rpc.MessageConnection {
    if (!this._connection) {
      throw new Error('Connection not initialized. Call start() first.')
    }
    return this._connection
  }

  private log(message: string, level: 'debug' | 'error' = 'debug') {
    level === 'error' ? logger.error(undefined, message) : logger.debug(undefined, message)
  }

  private cleanup() {
    if (this._connection) {
      this._connection.dispose()
      this._connection = null
    }

    if (this.process) {
      this.process.kill()
      this.process = null
    }
  }

  private setupProcessListeners(process: ReturnType<typeof spawn>): void {
    process.on('error', (err) => {
      this.log(`Failed to start puya service: ${err.message}`, 'error')
      this.cleanup()
    })

    process.on('exit', (code) => {
      this.log(`Puya service exited with code ${code}`, 'error')
      this.cleanup()
    })

    process.stderr?.on('data', (data: Buffer) => {
      this.log(`Puya stderr: ${data.toString()}`, 'debug')
    })
  }

  private createConnection(process: ReturnType<typeof spawn>): rpc.MessageConnection {
    const connection = rpc.createMessageConnection(
      new rpc.StreamMessageReader(process.stdout!),
      new rpc.StreamMessageWriter(process.stdin!),
    )
    connection.listen()
    return connection
  }

  async start(): Promise<void> {
    if (this.process && this._connection) return

    try {
      const puyaPath = await resolvePuyaPath()
      this.process = spawn(puyaPath, ['serve'], {
        cwd: this.cwd,
        stdio: ['pipe', 'pipe', 'pipe'],
      })

      this.setupProcessListeners(this.process)
      this._connection = this.createConnection(this.process)
    } catch (err) {
      this.cleanup()
      this.log(`Failed to start puya service: ${err}`, 'error')
      throw err
    }
  }

  async compile(options: {
    awst: string
    compilationSet: Record<string, string>
    sourceAnnotations?: string
  }): Promise<{ logs: PuyaServiceLog[]; cancelled: boolean }> {
    // Ensure service is started
    await this.start()

    const params: AnalyseParams = {
      awst: JSON.parse(options.awst),
      compilation_set: options.compilationSet,
      source_annotations: options.sourceAnnotations ? JSON.parse(options.sourceAnnotations) : undefined,
    }

    try {
      const result = (await Promise.race([
        this.connection.sendRequest(this.analyseRequest, params),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Compilation request timed out')), SERVICE_TIMEOUT_MS)),
      ])) as AnalyseResult

      return {
        logs: result.logs.map((log) => ({
          ...log,
          level: mapLogLevel(log.level),
        })),
        cancelled: result.cancelled,
      }
    } catch (error) {
      this.log(`Error during compilation: ${error}`, 'error')
      throw error
    }
  }

  async stop() {
    this.cleanup()
  }
}
