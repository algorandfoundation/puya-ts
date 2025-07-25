import type * as lsp from 'vscode-languageserver/node'

export type WorkspaceCompileTrigger = {
  type: 'workspace'
  workspaces: lsp.URI[]
}

export type FileCompileTrigger = {
  type: 'file'
  files: lsp.URI[]
}

export type CompileTrigger = WorkspaceCompileTrigger | FileCompileTrigger

export class CompileTriggerQueue {
  private readonly queue: CompileTrigger[] = []

  enqueue(trigger: CompileTrigger) {
    // TODO: Aggregate unprocessed triggers
    this.queue.push(trigger)
  }

  tryDequeue(): CompileTrigger | undefined {
    return this.queue.shift()
  }
}
