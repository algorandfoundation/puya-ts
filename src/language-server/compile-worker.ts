import type * as lsp from 'vscode-languageserver'
import type { TextDocument } from 'vscode-languageserver-textdocument'
import type { TextDocuments } from 'vscode-languageserver/node.js'
import { URI } from 'vscode-uri'
import { processInputPaths } from '../input-paths/process-input-paths'
import { logger, LoggingContext, LogLevel, LogSource } from '../logger'
import type { AlgoFile } from '../options'
import { DependencyGraph } from '../parser/dependency-graph'
import type { PuyaService } from '../puya/puya-service'
import { isIn } from '../util'
import { AbsolutePath } from '../util/absolute-path'
import { DefaultMap } from '../util/default-map'
import { sleep } from '../util/sleep'
import { analyse } from './analyse'
import type { CompileTrigger, CompileTriggerQueue, FileCompileTrigger, WorkspaceCompileTrigger } from './compile-trigger-queue'
import type { DiagnosticsManager } from './diagnostics-manager'
import { type LogEventWithSource, mapper } from './mapping'
import { logCaughtExpression, LogExceptions } from './util/log-exceptions'
import { normalisedUri } from './util/uris'

type ActiveBuild = {
  trigger: CompileTrigger
  abort: AbortController
}

export class CompileWorker {
  stopping: boolean = false
  private graph: DependencyGraph = new DependencyGraph()
  private stopped = Promise.withResolvers<void>()
  private sleeping: PromiseWithResolvers<void> | undefined = undefined
  private activeBuild: ActiveBuild | undefined = undefined
  private debounce = 250
  constructor(
    private readonly queue: CompileTriggerQueue,
    private readonly documents: TextDocuments<TextDocument>,
    private readonly diagnostics: DiagnosticsManager,
    private readonly puyaService: PuyaService,
  ) {
    this.queue.onItemEnqueued(this.onCompileTriggerQueueItemQueued.bind(this))
  }

  start() {
    setTimeout(async () => {
      while (!this.stopping) {
        try {
          const trigger = this.queue.tryDequeue()
          if (trigger) {
            if (trigger.type === 'workspace') {
              logger.debug(undefined, `[Compile Worker] Found workspace compile ${trigger.uris.join(', ')}`)
              this.activeBuild = { abort: new AbortController(), trigger }
              await this.compileWorkspaces(trigger, this.activeBuild.abort.signal)
              delete this.activeBuild
            } else {
              logger.debug(undefined, `[Compile Worker] Found file compile ${trigger.uris.join(', ')}`)
              this.activeBuild = { abort: new AbortController(), trigger }
              await this.compileFile(trigger, this.activeBuild.abort.signal)
              delete this.activeBuild
            }
          } else {
            logger.debug(undefined, `[Compile Worker] No work, sleeping`)
            this.sleeping = Promise.withResolvers()
            await this.sleeping.promise
            delete this.sleeping
            await sleep(this.debounce)
          }
        } catch (e) {
          logCaughtExpression(e)
        }
      }
      this.stopped.resolve()
    })
  }

  @LogExceptions
  async stop() {
    this.stopping = true
    this.sleeping?.resolve()
    await this.stopped.promise
  }

  configure(options: { debounce?: number }) {
    if (options.debounce !== undefined) this.debounce = options.debounce
  }

  onCompileTriggerQueueItemQueued(trigger: CompileTrigger) {
    if (this.activeBuild) {
      if (this.activeBuild.trigger.type === trigger.type) {
        if (new Set(this.activeBuild.trigger.uris).isSubsetOf(new Set(trigger.uris))) {
          logger.debug(undefined, `[Compile Worker] Aborting build, newer version of file is available`)
          this.activeBuild.abort.abort('Build superseded')
        }
      }
    }
    if (this.sleeping) {
      logger.debug(undefined, `[Compile Worker] New work, waking worker`)
      this.sleeping.resolve()
    }
  }

  @LogExceptions
  private async compileFile(fileTrigger: FileCompileTrigger, abortSignal: AbortSignal) {
    logger.debug(undefined, `[File Compile] trigger uris:\n${fileTrigger.uris.join('\n')}`)

    const filePaths = fileTrigger.uris.map((ws) => AbsolutePath.resolve({ path: URI.parse(ws).fsPath }).toString())
    logger.debug(undefined, `[File Compile] trigger files:\n${filePaths.join('\n')}`)

    const dependantFiles = Array.from(this.graph.getDependants(filePaths))
    logger.debug(undefined, `[File Compile] dependant files \n${dependantFiles.join('\n')}`)

    const algoFiles = processInputPaths({ paths: dependantFiles, ignoreUnmatchedPaths: true })
    if (algoFiles.length === 0) {
      logger.debug(undefined, '[File Compile] Skipping compilation as there are no matched algo files')
      return
    }

    await this.compileAlgoFiles(algoFiles, abortSignal)
  }

  @LogExceptions
  private async compileWorkspaces(workspaceTrigger: WorkspaceCompileTrigger, abortSignal: AbortSignal) {
    logger.debug(undefined, `[Workspace Compile] \n${workspaceTrigger.uris.join('\n')}`)

    const workspacePaths = workspaceTrigger.uris.map((ws) => URI.parse(ws).fsPath)
    logger.debug(undefined, `[Workspace Compile] \n${workspacePaths.join('\n')}`)

    const algoFiles = processInputPaths({ paths: workspacePaths, ignoreUnmatchedPaths: true })
    if (algoFiles.length === 0) {
      logger.debug(undefined, '[Workspace Compile] Skipping compilation as there are no matched algo files')
      return
    }

    await this.compileAlgoFiles(algoFiles, abortSignal)
  }
  @LogExceptions
  private async compileAlgoFiles(algoFiles: AlgoFile[], abortSignal: AbortSignal) {
    const documents = this.documents
    const documentVersions: Record<string, number | undefined> = {}
    logger.debug(undefined, `[Compiling Files]: \n${algoFiles.map((f) => f.sourceFile).join('\n')}`)

    const logCtx = LoggingContext.create()
    await logCtx.run(async () => {
      const { graph } = await analyse({
        puyaService: this.puyaService,
        filePaths: algoFiles,
        abortSignal,
        sourceFileProvider({ readFile, fileExists }) {
          return {
            readFile(fileName) {
              const fileUri = normalisedUri({ fsPath: fileName }).toString()
              const doc = documents.get(fileUri)
              if (doc) {
                documentVersions[fileUri] = doc.version
                return doc.getText()
              }
              return readFile(fileName)
            },
            fileExists(fileName) {
              const fileUri = normalisedUri({ fsPath: fileName }).toString()
              return Boolean(documents.get(fileUri)) || fileExists(fileName)
            },
          }
        },
      })
      if (graph) {
        this.graph.updateWith(graph)
      }
    })

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

    for (const [file, diagnostics] of results.entries()) {
      const fileUri = URI.file(file).toString()
      this.diagnostics.setDiagnostics({ fileUri, diagnostics, version: documentVersions[fileUri] })
    }
  }
}
