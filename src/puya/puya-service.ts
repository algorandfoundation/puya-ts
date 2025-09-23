import { AwstSerializer, SnakeCaseSerializer } from '../awst/json-serialize-awst'
import type { RootNode } from '../awst/nodes'
import { logger } from '../logger'
import type { PuyaOptions } from '../options'
import { spawn } from 'cross-spawn'
import * as rpc from 'vscode-jsonrpc/node'
import type { SourceLocation } from '../awst/source-location'

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

export interface PuyaService {
  analyse(programDirectory: string, awst: RootNode[]): Promise<LogResult>
  compile(options: CompileParams): Promise<LogResult>
  shutdown(): Promise<void>
}

export function getPuyaService(puyaPath: string): PuyaService {
  const connection = getPuyaServiceConnection(puyaPath)
  async function analyse(programDirectory: string, awst: RootNode[]) {
    logger.debug(undefined, `puya serve: analyse: ${programDirectory}`)
    const type = new rpc.RequestType<AnalyseParams, LogResult, void>('analyse')
    return await connection.sendRequest(type, { awst, base_path: programDirectory })
  }

  async function compile(params: CompileParams) {
    logger.debug(undefined, `puya serve: compile ${params.base_path}`)
    const type = new rpc.RequestType<CompileParams, LogResult, void>('compile')
    return await connection.sendRequest(type, params)
  }

  async function shutdown() {
    const type = new rpc.NotificationType('shutdown')
    await connection.sendNotification(type)
    connection.end()
  }

  return {
    analyse,
    compile,
    shutdown,
  }
}

function getPuyaServiceConnection(path: string) {
  logger.debug(undefined, `puya serve: using ${path}`)
  const childProcess = spawn(path, ['serve'])
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
      serializer = new AwstSerializer({ sourcePaths: 'absolute', programDirectory })
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
