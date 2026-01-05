import type { TextDocument } from 'vscode-languageserver-textdocument'
import type { TextDocuments } from 'vscode-languageserver/node.js'
import { logger } from '../logger'
import type { AnalyserService, OpenDocuments } from './analyser-service'
import type { CompileTrigger, CompileTriggerQueue } from './compile-trigger-queue'
import type { DiagnosticsManager } from './diagnostics-manager'
import { logCaughtExpression, LogExceptions } from './util/log-exceptions'

type ActiveBuild = {
  trigger: CompileTrigger
  abort: AbortController
}

export class CompileWorker {
  stopping: boolean = false
  private stopped = Promise.withResolvers<void>()
  private sleeping: PromiseWithResolvers<void> | undefined = undefined
  private activeBuild: ActiveBuild | undefined = undefined
  constructor(
    private readonly queue: CompileTriggerQueue,
    private readonly analyserService: AnalyserService,
    private readonly documents: TextDocuments<TextDocument>,
    private readonly diagnostics: DiagnosticsManager,
  ) {
    this.queue.onItemEnqueued(this.onCompileTriggerQueueItemQueued.bind(this))
  }

  start() {
    setTimeout(async () => {
      while (!this.stopping) {
        try {
          const trigger = this.queue.tryDequeue()
          if (trigger) {
            logger.debug(undefined, `[Compile Worker] Found ${trigger.type} compile ${trigger.uris.join(', ')}`)
            this.activeBuild = { abort: new AbortController(), trigger }
            await this.compileWithService(trigger, this.activeBuild.abort.signal)
            delete this.activeBuild
          } else {
            logger.debug(undefined, `[Compile Worker] No work, sleeping`)
            this.sleeping = Promise.withResolvers()
            await this.sleeping.promise
            delete this.sleeping
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
    this.activeBuild?.abort.abort()
    await this.stopped.promise
  }

  onCompileTriggerQueueItemQueued(trigger: CompileTrigger) {
    if (this.activeBuild) {
      if (this.activeBuild.trigger.type === trigger.type) {
        if (new Set(trigger.uris).isSubsetOf(new Set(this.activeBuild.trigger.uris))) {
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

  private async compileWithService(trigger: CompileTrigger, abort: AbortSignal) {
    const openDocuments = this.documents.all().reduce((acc: OpenDocuments, cur) => {
      acc[cur.uri] = {
        contents: cur.getText(),
        version: cur.version,
      }
      return acc
    }, {})
    try {
      const results = await this.analyserService.analyse(
        {
          uris: trigger.uris,
          openDocuments,
        },
        abort,
      )
      for (const file of results) {
        this.diagnostics.setDiagnostics(file)
      }
    } catch (e) {
      if (e === 'aborted') return
      throw e
    }
  }
}
