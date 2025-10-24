import type * as lsp from 'vscode-languageserver/node'
import { distinct } from '../util'
import EventEmitter from 'node:events'

export type WorkspaceCompileTrigger = {
  type: 'workspace'
  workspaces: lsp.URI[]
}

export type CompileTrigger = WorkspaceCompileTrigger

type CompileTriggerQueueEvents = {
  itemEnqueued: []
}

export class CompileTriggerQueue {
  private readonly queue: CompileTrigger[] = []
  private readonly events = new EventEmitter<CompileTriggerQueueEvents>()

  enqueue(trigger: CompileTrigger) {
    if (this.queue.length === 0) {
      this.queue.push(trigger)
    } else {
      const aggregated: WorkspaceCompileTrigger = {
        type: 'workspace',
        workspaces: this.queue
          .flatMap((q) => q.workspaces)
          .concat(trigger.workspaces)
          .filter(distinct()),
      }
      this.queue.splice(0, this.queue.length, aggregated)
    }
    this.events.emit('itemEnqueued')
  }

  tryDequeue(): CompileTrigger | undefined {
    return this.queue.shift()
  }

  onItemEnqueued(handler: (...args: CompileTriggerQueueEvents['itemEnqueued']) => void): lsp.Disposable {
    this.events.on('itemEnqueued', handler)
    return {
      dispose: () => {
        this.events.off('itemEnqueued', handler)
      },
    }
  }
}
