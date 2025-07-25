import EventEmitter from 'node:events'
import type * as lsp from 'vscode-languageserver'
import { zipStrict } from '../util'
import { DefaultMap } from '../util/default-map'

function diagnosticsAreSame(a: lsp.Diagnostic, b: lsp.Diagnostic) {
  return (
    a.message === b.message &&
    a.range.start.line === b.range.start.line &&
    a.range.start.character === b.range.start.character &&
    a.range.end.line === b.range.end.line &&
    a.range.end.character === b.range.end.character &&
    a.severity === b.severity
  )
}

export class SourceFileDiagnostics {
  private diagnostics: lsp.Diagnostic[] | undefined = undefined

  /**
   * Update the diagnostics for this file and return a boolean indicating if they have changed
   * @param diagnostics
   */
  setDiagnostics(diagnostics: lsp.Diagnostic[]): boolean {
    if (diagnostics.length === this.diagnostics?.length) {
      if (zipStrict(this.diagnostics, diagnostics).every(([l, r]) => diagnosticsAreSame(l, r))) {
        return false
      }
    }
    this.diagnostics = diagnostics

    return true
  }
}
export type FileDiagnosticsChanged = {
  uri: lsp.DocumentUri

  diagnostics: lsp.Diagnostic[]
}

type DiagnosticEvents = {
  fileDiagnosticsChanged: [event: FileDiagnosticsChanged]
}

export class DiagnosticsManager {
  private readonly sourceFiles = new DefaultMap<lsp.DocumentUri, SourceFileDiagnostics>()
  private readonly events = new EventEmitter<DiagnosticEvents>()

  constructor() {}

  async setDiagnostics(file: lsp.DocumentUri, diagnostics: lsp.Diagnostic[]) {
    const fileDiagnostics = this.sourceFiles.getOrDefault(file, () => new SourceFileDiagnostics())
    if (fileDiagnostics.setDiagnostics(diagnostics)) {
      this.events.emit('fileDiagnosticsChanged', { uri: file, diagnostics })
    }
  }

  onFileDiagnosticsChanged(handler: (...args: DiagnosticEvents['fileDiagnosticsChanged']) => void): lsp.Disposable {
    this.events.on('fileDiagnosticsChanged', handler)
    return {
      dispose: () => {
        this.events.off('fileDiagnosticsChanged', handler)
      },
    }
  }
}
