import { randomUUID } from 'crypto'
import { parentPort, Worker, workerData } from 'node:worker_threads'
import type * as lsp from 'vscode-languageserver'
import { URI } from 'vscode-uri'
import { InternalError } from '../errors'
import { processInputPaths } from '../input-paths/process-input-paths'
import type { LogEvent } from '../logger'
import { logger, LoggingContext, LogLevel, LogSource } from '../logger'
import type { AlgoFile } from '../options'
import { DependencyGraph } from '../parser/dependency-graph'
import { PuyaService } from '../puya/puya-service'
import type { DeliberateAny } from '../typescript-helpers'
import { isIn } from '../util'
import { AbsolutePath } from '../util/absolute-path'
import { DefaultMap } from '../util/default-map'
import type { TypedMessagePort } from '../util/typed-message-port'
import { createTypedMessagePort } from '../util/typed-message-port'
import { analyse } from './analyse'
import type { FileWithDiagnostics } from './diagnostics-manager'
import { type LogEventWithSource, mapper } from './mapping'
import { normalisedUri } from './util/uris'
import '../util/polyfills'

type AnalyseServiceOptions = {
  puyaPath: string
}

export type OpenDocuments = Record<string, { contents: string; version: number }>

type AnalyseArgs = { uris: lsp.URI[]; openDocuments: OpenDocuments }

type Commands =
  | {
      type: 'analyse'
      args: AnalyseArgs
      correlationId: string
    }
  | {
      type: 'abort-analysis'
      correlationId: string
    }
  | {
      type: 'shutdown'
      correlationId: string
    }

type Notifications =
  | {
      type: 'analysis-complete'
      diagnostics: FileWithDiagnostics[]
      correlationId: string
    }
  | {
      type: 'analysis-incomplete'
      error: Error | 'aborted'
      correlationId: string
    }
  | {
      type: 'shutdown-complete'
      correlationId: string
    }
  | {
      type: 'log'
      log: LogEvent
    }
type ActiveBuild = {
  correlationId: string
  abort: AbortController
}

class AnalyseWorker {
  readonly puyaService: PuyaService
  readonly graph = new DependencyGraph()
  activeBuild: ActiveBuild | undefined = undefined

  constructor(port: TypedMessagePort<Notifications, Commands>, options: AnalyseServiceOptions) {
    this.puyaService = new PuyaService({ puyaPath: options.puyaPath })
    port.onMessage(async (command) => {
      switch (command.type) {
        case 'analyse': {
          try {
            this.activeBuild = { abort: new AbortController(), correlationId: command.correlationId }

            const result = await this.analyse(command.args, this.activeBuild.abort.signal)
            port.postMessage({ type: 'analysis-complete', diagnostics: result, correlationId: command.correlationId })
          } catch (e) {
            const error = e instanceof Error || e === 'aborted' ? e : new InternalError(`Unexpected error: ${e}`)
            port.postMessage({ type: 'analysis-incomplete', correlationId: command.correlationId, error })
          } finally {
            delete this.activeBuild
          }
          break
        }
        case 'shutdown': {
          await this.puyaService.shutdown()
          port.postMessage({ type: 'shutdown-complete', correlationId: command.correlationId })
          break
        }
        case 'abort-analysis': {
          if (this.activeBuild?.correlationId === command.correlationId) {
            this.activeBuild.abort.abort()
          }
          break
        }
      }
    })
  }

  private async compileAlgoFiles(
    algoFiles: AlgoFile[],
    documents: OpenDocuments,
    abortSignal: AbortSignal,
  ): Promise<FileWithDiagnostics[]> {
    logger.debug(undefined, `[Compiling Files]: \n${algoFiles.map((f) => f.sourceFile).join('\n')}`)

    const logCtx = LoggingContext.create()
    const { graph } = await logCtx.run(
      async () =>
        await analyse({
          puyaService: this.puyaService,
          filePaths: algoFiles,
          abortSignal,
          sourceFileProvider({ readFile, fileExists }) {
            return {
              readFile(fileName) {
                const fileUri = normalisedUri({ fsPath: fileName }).toString()
                const doc = documents[fileUri]
                if (doc) {
                  return doc.contents
                }
                return readFile(fileName)
              },
              fileExists(fileName) {
                const fileUri = normalisedUri({ fsPath: fileName }).toString()
                return fileUri in documents || fileExists(fileName)
              },
            }
          },
        }),
    )
    if (graph) {
      this.graph.updateWith(graph)
    }
    const results = new DefaultMap<string, lsp.Diagnostic[]>()

    for (const [path, events] of Object.entries(logCtx.logEventsByPath)) {
      results
        .getOrDefault(path, () => [])
        .push(
          ...events.flatMap((logEvent) => {
            if (
              !isIn(logEvent.level, [LogLevel.Error, LogLevel.Warning]) ||
              isIn(logEvent.logSource, [LogSource.TypeScript]) ||
              !logEvent.sourceLocation?.file
            )
              return []
            return [mapper.logToDiagnostic(logEvent as LogEventWithSource)]
          }),
        )
    }

    return Array.from(
      results.entries().map(([file, diagnostics]) => {
        const fileUri = normalisedUri({ fsPath: file }).toString()

        return { uri: fileUri, diagnostics, version: documents[fileUri]?.version }
      }),
    )
  }

  async analyse(options: AnalyseArgs, abortSignal: AbortSignal) {
    logger.debug(undefined, `[Analyse] trigger uris:\n${options.uris.join('\n')}`)

    const filePaths = options.uris.map((ws) => AbsolutePath.resolve({ path: URI.parse(ws).fsPath }).toString())

    const dependantFiles = Array.from(this.graph.getDependants(filePaths))
    logger.debug(undefined, `[Analyse] dependant files \n${dependantFiles.join('\n')}`)

    const algoFiles = processInputPaths({ paths: dependantFiles, ignoreUnmatchedPaths: true })
    if (algoFiles.length === 0) {
      logger.debug(undefined, '[Analyse] Skipping compilation as there are no matched algo files')
      return []
    }

    return await this.compileAlgoFiles(algoFiles, options.openDocuments, abortSignal)
  }
}

export interface AnalyserService {
  analyse(options: AnalyseArgs, abort: AbortSignal): Promise<FileWithDiagnostics[]>
  shutdown(): Promise<void>
}

if (parentPort) {
  const typedPort = createTypedMessagePort<Notifications, Commands>(parentPort)

  logger.configure([
    {
      minLogLevel: LogLevel.Debug,
      add(log: LogEvent) {
        // Forward any non code specific log to the main thread
        if (log.sourceLocation) return
        typedPort.postMessage({
          type: 'log',
          log,
        })
      },
    },
  ])

  new AnalyseWorker(typedPort, workerData)
}

function buildWorker({ workerData }: { workerData: AnalyseServiceOptions }) {
  const workerFile = import.meta.filename ?? __filename
  if (workerFile.endsWith('.ts')) {
    const resolve = import.meta.resolve ?? require.resolve
    const tsx = resolve('tsx')
    return new Worker(workerFile, {
      execArgv: ['--require', tsx],
      workerData,
    })
  } else {
    return new Worker(workerFile, {
      workerData,
    })
  }
}

export function createAnalyserService(options: AnalyseServiceOptions): AnalyserService {
  const worker = buildWorker({ workerData: options })
  worker.on('error', (err) => logger.error(err))
  const typedWorker = createTypedMessagePort<Commands, Notifications>(worker)

  const responses = new Map<string, PromiseWithResolvers<DeliberateAny>>()

  typedWorker.onMessage((message) => {
    if (message.type === 'log') {
      logger.addLog(message.log)
      return
    }

    const res = responses.get(message.correlationId)
    responses.delete(message.correlationId)

    switch (message.type) {
      case 'analysis-complete':
        res?.resolve(message.diagnostics)
        break
      case 'shutdown-complete':
        res?.resolve(undefined)
        break
      case 'analysis-incomplete':
        res?.reject(message.error)
        break
      default:
        throw new InternalError(`Unhandled message from analyser service`)
    }
  })

  function waitForNotification<T>(correlationId: string): Promise<T> {
    const response = Promise.withResolvers<T>()
    responses.set(correlationId, response)
    return response.promise
  }

  return {
    async analyse(options, abort: AbortSignal) {
      const correlationId = randomUUID()
      const onAbort = () => typedWorker.postMessage({ type: 'abort-analysis', correlationId })

      try {
        abort.addEventListener('abort', onAbort)
        typedWorker.postMessage({ type: 'analyse', args: options, correlationId })
        return await waitForNotification(correlationId)
      } finally {
        abort.removeEventListener('abort', onAbort)
      }
    },
    shutdown(): Promise<void> {
      const correlationId = randomUUID()
      typedWorker.postMessage({ type: 'shutdown', correlationId })
      return waitForNotification(correlationId)
    },
  }
}
