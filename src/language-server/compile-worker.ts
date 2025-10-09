import type * as lsp from 'vscode-languageserver'
import type { TextDocument } from 'vscode-languageserver-textdocument'
import type { TextDocuments } from 'vscode-languageserver/node.js'
import { URI } from 'vscode-uri'
import { validateAwst } from '../awst/validation'
import { buildAwst } from '../awst_build'
import { registerPTypes } from '../awst_build/ptypes/register'
import { typeRegistry } from '../awst_build/type-registry'
import { processInputPaths } from '../input-paths/process-input-paths'
import { LoggingContext, LogLevel, LogSource } from '../logger'
import type { AlgoFile } from '../options'
import { CompileOptions } from '../options'
import { createTsProgram } from '../parser'
import { deserializeAndLog } from '../puya/log-deserializer'
import type { PuyaService } from '../puya/puya-service'
import { getPuyaService } from '../puya/puya-service'
import { isIn } from '../util'
import { DefaultMap } from '../util/default-map'
import { sleep } from '../util/sleep'
import type { CompileTriggerQueue, WorkspaceCompileTrigger } from './compile-trigger-queue'
import type { DiagnosticsManager } from './diagnostics-manager'
import type { LsLogger } from './ls-logger'
import { type LogEventWithSource, mapper } from './mapping'
import { LogExceptions } from './util/log-exceptions'

export class CompileWorker {
  stopping: boolean = false
  private stopped = Promise.withResolvers<void>()
  puyaService: PuyaService
  constructor(
    private readonly queue: CompileTriggerQueue,
    private readonly documents: TextDocuments<TextDocument>,
    private readonly logger: LsLogger,
    private readonly diagnostics: DiagnosticsManager,
    puyaPath: string,
  ) {
    this.puyaService = getPuyaService(puyaPath)
  }

  start() {
    setTimeout(async () => {
      while (!this.stopping) {
        const work = this.queue.tryDequeue()
        if (work) {
          switch (work.type) {
            case 'workspace':
              await this.compileWorkspaces(work)
              break
          }
        } else {
          await sleep(1000)
        }
      }
      this.stopped.resolve()
    })
  }

  async stop() {
    this.stopping = true
    await this.puyaService.shutdown()
    await this.stopped.promise
  }

  @LogExceptions
  private async compileWorkspaces(workspaceTrigger: WorkspaceCompileTrigger) {
    try {
      this.logger.debug(`[Workspace Compile] \n${workspaceTrigger.workspaces.join('\n')}`)

      const workspacePaths = workspaceTrigger.workspaces.map((ws) => URI.parse(ws).fsPath)
      this.logger.debug(`[Workspace Compile] \n${workspacePaths.join('\n')}`)

      const algoFiles = processInputPaths({ paths: workspacePaths, ignoreUnmatchedPaths: true })
      if (algoFiles.length === 0) {
        this.logger.debug('[Workspace Compile] Skipping compilation as there are no matched algo files')
        return
      }

      await this.compileAlgoFiles(algoFiles)
    } catch (e) {
      this.logger.error(`Unhandled error in compilation ${e}`)
    }
  }

  private async compileAlgoFiles(algoFiles: AlgoFile[]) {
    const documents = this.documents
    const documentVersions: Record<string, number | undefined> = {}
    this.logger.debug(`[Compiling Files]: \n${algoFiles.map((f) => f.sourceFile).join('\n')}`)

    const logCtx = LoggingContext.create()
    await logCtx.run(
      async () =>
        await analyse(this.puyaService, {
          filePaths: algoFiles,
          sourceFileProvider({ readFile, fileExists }) {
            return {
              readFile(fileName) {
                const fileUri = URI.file(fileName).toString()
                const doc = documents.get(fileUri)
                if (doc) {
                  documentVersions[fileUri] = doc.version
                  return doc.getText()
                }
                return readFile(fileName)
              },
              fileExists(fileName) {
                const fileUri = URI.file(fileName).toString()
                return Boolean(documents.get(fileUri)) || fileExists(fileName)
              },
            }
          },
        }),
    )

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
      await sleep(0) // surrender thread between each file
    }
  }
}

async function analyse(puyaService: PuyaService, options: Pick<CompileOptions, 'filePaths' | 'sourceFileProvider'>): Promise<void> {
  const loggerCtx = LoggingContext.current
  registerPTypes(typeRegistry)
  const compileOptions = new CompileOptions(options)
  const programResult = createTsProgram(compileOptions)
  if (loggerCtx.hasErrors()) {
    return
  }
  const { moduleAwst } = buildAwst(programResult, compileOptions)
  validateAwst(moduleAwst)

  if (loggerCtx.hasErrors()) {
    return
  }
  const response = await puyaService.analyse(programResult.programDirectory, moduleAwst)
  for (const log of response.logs) {
    deserializeAndLog(log)
  }
}
