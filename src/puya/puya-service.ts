import { spawn } from 'cross-spawn'
import * as rpc from 'vscode-jsonrpc/node'
import { AwstSerializer, SnakeCaseSerializer } from '../awst/json-serialize-awst'
import type { RootNode } from '../awst/nodes'
import type { SourceLocation } from '../awst/source-location'
import { InternalError } from '../errors'
import { logger } from '../logger'
import type { PuyaOptions } from '../options'
import type { AbsolutePath } from '../util/absolute-path'

interface AnalyseParams {
  awst: RootNode[]
  base_path: string
}
interface CompileParams {
  awst: RootNode[]
  options: PuyaOptions
  base_path: string
  log_level: string
  source_annotations: Record<string, string[]>
}
interface Log {
  level: string
  message: string
  location?: SourceLocation
}
interface LogResult {
  logs: Log[]
}

export type PuyaServiceOptions = {
  puyaPath: string
}

export class PuyaService {
  private static _instance: PuyaService | null = null
  private readonly connection: rpc.MessageConnection
  static getInstance(options: PuyaServiceOptions): PuyaService {
    return this._instance ?? (this._instance = new PuyaService(options))
  }

  private constructor(options: PuyaServiceOptions) {
    this.connection = getPuyaServiceConnection(options.puyaPath)
  }

  async analyse(programDirectory: AbsolutePath, awst: RootNode[]): Promise<LogResult> {
    logger.debug(undefined, `puya serve: analyse: ${programDirectory}`)
    const type = new rpc.RequestType<AnalyseParams, LogResult, void>('analyse')
    return await this.connection.sendRequest(type, { awst, base_path: programDirectory.toString() })
  }
  async compile(params: CompileParams): Promise<LogResult> {
    logger.debug(undefined, `puya serve: compile ${params.base_path}`)
    const type = new rpc.RequestType<CompileParams, LogResult, void>('compile')
    return await this.connection.sendRequest(type, params)
  }
  async shutdown(): Promise<void> {
    const type = new rpc.NotificationType('shutdown')
    await this.connection.sendNotification(type)
    this.connection.end()
    PuyaService._instance = null
  }
}

function getPuyaServiceConnection(path: string) {
  logger.debug(undefined, `puya serve: using ${path}`)
  const childProcess = spawn(path, ['serve'], {
    stdio: ['pipe', 'pipe', process.stderr],
  })
  childProcess.stdout.pipe(process.stderr)
  logger.debug(undefined, `puya serve: running`)
  const connection = rpc.createMessageConnection(
    new rpc.StreamMessageReader(childProcess.stdout),
    new rpc.StreamMessageWriter(childProcess.stdin, {
      contentTypeEncoder: {
        name: 'awst',
        encode: encodeMessage,
      },
    }),
  )
  childProcess.once('error', (e) => {
    throw new InternalError(`puya server: exited prematurely ${e}`)
  })
  connection.onError(([error]) => {
    throw new InternalError('puya server: connection error', { cause: error })
  })

  connection.listen()
  logger.debug(undefined, `puya serve: connection listening`)
  return connection
}

function encodeMessage(msg: rpc.Message, options: rpc.ContentTypeEncoderOptions): Promise<Uint8Array> {
  const params = 'params' in msg ? msg.params : undefined
  let serializer = undefined
  if (typeof params === 'object' && params !== null) {
    const programDirectory = 'base_path' in params ? params.base_path : undefined
    if (typeof programDirectory === 'string') {
      serializer = new AwstSerializer()
    }
  }
  if (serializer === undefined) {
    serializer = new SnakeCaseSerializer()
  }
  const json = serializer.serialize(msg)
  const encoder = new TextEncoder()
  const uint8Array = encoder.encode(json)
  return Promise.resolve(uint8Array)
}
