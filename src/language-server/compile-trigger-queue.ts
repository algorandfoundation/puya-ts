import type * as lsp from 'vscode-languageserver/node'
import { distinct } from '../util'

export type WorkspaceCompileTrigger = {
  type: 'workspace'
  workspaces: lsp.URI[]
}

export type CompileTrigger = WorkspaceCompileTrigger

export class CompileTriggerQueue {
  private readonly queue: CompileTrigger[] = []

  enqueue(trigger: CompileTrigger) {
    if (this.queue.length === 0) {
      this.queue.push(trigger)
    }
    const aggregated: WorkspaceCompileTrigger = {
      type: 'workspace',
      workspaces: this.queue
        .flatMap((q) => q.workspaces)
        .concat(trigger.workspaces)
        .filter(distinct()),
    }
    this.queue.splice(0, this.queue.length, aggregated)
  }

  tryDequeue(): CompileTrigger | undefined {
    return this.queue.shift()
  }
}
