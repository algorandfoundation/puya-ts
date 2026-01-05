import EventEmitter from 'node:events'
import type * as lsp from 'vscode-languageserver/node'
import { distinct } from '../util'

export type WorkspaceCompileTrigger = {
  type: 'workspace'
  uris: lsp.URI[]
}
export type FileCompileTrigger = {
  type: 'file'
  uris: lsp.URI[]
}

export type CompileTrigger = WorkspaceCompileTrigger | FileCompileTrigger

type CompileTriggerQueueEvents = {
  itemEnqueued: [CompileTrigger]
}

export class CompileTriggerQueue {
  private readonly queue: CompileTrigger[] = []
  private readonly events = new EventEmitter<CompileTriggerQueueEvents>()

  enqueue(trigger: CompileTrigger) {
    const lastInQueue = this.queue.at(-1)
    if (trigger.type === lastInQueue?.type) {
      this.queue.splice(-1, 1, {
        type: trigger.type,
        uris: lastInQueue.uris.concat(trigger.uris).filter(distinct()),
      })
    } else {
      this.queue.push(trigger)
    }
    this.events.emit('itemEnqueued', this.queue.at(-1)!)
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
