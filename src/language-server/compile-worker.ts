import type * as lsp from 'vscode-languageserver'
import type { TextDocument } from 'vscode-languageserver-textdocument'
import type { TextDocuments } from 'vscode-languageserver/node.js'
import { URI } from 'vscode-uri'
import { validateAwst } from '../awst/validation'
import { buildAwst } from '../awst_build'
import { registerPTypes } from '../awst_build/ptypes/register'
import { typeRegistry } from '../awst_build/type-registry'
import { processInputPaths } from '../input-paths/process-input-paths'
import { logger, LoggingContext, LogLevel, LogSource } from '../logger'
import type { AlgoFile } from '../options'
import { CompileOptions } from '../options'
import { createTsProgram } from '../parser'
import { deserializeAndLog } from '../puya/log-deserializer'
import { PuyaService } from '../puya/puya-service'
import { isIn } from '../util'
import { DefaultMap } from '../util/default-map'
import { sleep } from '../util/sleep'
import type { CompileTriggerQueue, WorkspaceCompileTrigger } from './compile-trigger-queue'
import type { DiagnosticsManager } from './diagnostics-manager'
import { type LogEventWithSource, mapper } from './mapping'
import { logCaughtExpression, LogExceptions } from './util/log-exceptions'

export class CompileWorker {
  stopping: boolean = false
  private stopped = Promise.withResolvers<void>()
  constructor(
    private readonly queue: CompileTriggerQueue,
    private readonly documents: TextDocuments<TextDocument>,
    private readonly diagnostics: DiagnosticsManager,
    private readonly puyaPath: string,
  ) {}

  start() {
    setTimeout(async () => {
      while (!this.stopping) {
        try {
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
    await this.stopped.promise
  }

  @LogExceptions
  private async compileWorkspaces(workspaceTrigger: WorkspaceCompileTrigger) {
    logger.debug(undefined, `[Workspace Compile] \n${workspaceTrigger.workspaces.join('\n')}`)

    const workspacePaths = workspaceTrigger.workspaces.map((ws) => URI.parse(ws).fsPath)
    logger.debug(undefined, `[Workspace Compile] \n${workspacePaths.join('\n')}`)

    const algoFiles = processInputPaths({ paths: workspacePaths, ignoreUnmatchedPaths: true })
    if (algoFiles.length === 0) {
      logger.debug(undefined, '[Workspace Compile] Skipping compilation as there are no matched algo files')
      return
    }

    await this.compileAlgoFiles(algoFiles)
  }
  @LogExceptions
  private async compileAlgoFiles(algoFiles: AlgoFile[]) {
    const documents = this.documents
    const documentVersions: Record<string, number | undefined> = {}
    logger.debug(undefined, `[Compiling Files]: \n${algoFiles.map((f) => f.sourceFile).join('\n')}`)

    const logCtx = LoggingContext.create()
    await logCtx.run(
      async () =>
        await analyse({
          puyaPath: this.puyaPath,
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
    }
  }
}

async function analyse(options: Pick<CompileOptions, 'filePaths' | 'sourceFileProvider'> & { puyaPath: string }): Promise<void> {
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

  const puyaService = PuyaService.getInstance(options)
  const response = await puyaService.analyse(programResult.programDirectory, moduleAwst)
  for (const log of response.logs) {
    deserializeAndLog(log)
  }
}
