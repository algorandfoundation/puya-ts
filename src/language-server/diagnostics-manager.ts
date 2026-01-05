import EventEmitter from 'node:events'
import type * as lsp from 'vscode-languageserver'
import { logger } from '../logger'
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

function isSameOrMoreRecentVersion(prev: number | undefined, next: number | undefined): boolean {
  if (prev === undefined || next === undefined) return true
  return prev <= next
}

export class SourceFileDiagnostics {
  private diagnostics: lsp.Diagnostic[] | 'pending' = 'pending'
  private version: number | undefined
  /**
   * Update the diagnostics for this file and return a boolean indicating if they have changed
   * @param version The file version used to generate these diagnostics
   * @param diagnostics
   */
  setDiagnostics({ version, diagnostics }: { diagnostics: lsp.Diagnostic[] | 'pending'; version: number | undefined }): boolean {
    // Ignore older diagnostics (even though this shouldn't happen)
    if (!isSameOrMoreRecentVersion(this.version, version)) return false
    if (diagnostics !== 'pending' && this.diagnostics !== 'pending' && diagnostics.length === this.diagnostics.length) {
      if (zipStrict(this.diagnostics, diagnostics).every(([l, r]) => diagnosticsAreSame(l, r))) {
        this.version = version
        return false
      }
    }
    this.diagnostics = diagnostics
    this.version = version

    return true
  }
}
export type FileWithDiagnostics = {
  uri: lsp.DocumentUri
  version: number | undefined
  diagnostics: lsp.Diagnostic[]
}

type DiagnosticEvents = {
  fileDiagnosticsChanged: [event: FileWithDiagnostics]
}

export class DiagnosticsManager {
  private readonly sourceFiles = new DefaultMap<lsp.DocumentUri, SourceFileDiagnostics>()
  private readonly events = new EventEmitter<DiagnosticEvents>()

  setDiagnostics({
    uri,
    diagnostics,
    version,
  }: {
    uri: lsp.DocumentUri
    diagnostics: lsp.Diagnostic[] | 'pending'
    version: number | undefined
  }) {
    logger.debug(
      undefined,
      `[DiagMgr] Setting diagnostics for ${uri} ${version ?? '<no version>'} (${diagnostics === 'pending' ? 'pending' : diagnostics.length})`,
    )
    const fileDiagnostics = this.sourceFiles.getOrDefault(uri, () => new SourceFileDiagnostics())
    if (fileDiagnostics.setDiagnostics({ diagnostics, version })) {
      if (diagnostics === 'pending') return
      this.events.emit('fileDiagnosticsChanged', { uri, diagnostics, version })
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
