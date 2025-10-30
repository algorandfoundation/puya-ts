import type * as lsp from 'vscode-languageserver'
import { DiagnosticSeverity } from 'vscode-languageserver'
import type { SourceLocation } from '../awst/source-location'
import { Constants } from '../constants'
import { InternalError } from '../errors'
import { type LogEvent, LogLevel } from '../logger'
import type { Position, TextEdit } from '../text-edit'

export type CodeFixData = {
  type: 'code-fix'
  message: string
  edits: readonly lsp.TextEdit[]
}
export function isCodeFixData(data: unknown): data is CodeFixData {
  return data !== null && typeof data === 'object' && 'type' in data && data['type'] === 'code-fix'
}

export type LogEventWithSource = LogEvent & { sourceLocation: SourceLocation & { file: string } }

export const mapper = {
  logToDiagnostic(event: LogEventWithSource): lsp.Diagnostic {
    return {
      source: Constants.languageServerSource,
      severity: mapDiagnosticSeverity(event.level),
      range: sourceLocationToRange(event.sourceLocation),
      message: event.message,
      data: event.codeFix
        ? ({
            type: 'code-fix',
            message: event.codeFix.fixMessage,
            edits: event.codeFix.edits.map(mapTextEdit),
          } satisfies CodeFixData)
        : {},
    }
  },
}

function mapDiagnosticSeverity(logLevel: LogLevel): DiagnosticSeverity {
  switch (logLevel) {
    case LogLevel.Critical:
    case LogLevel.Error:
      return DiagnosticSeverity.Error
    case LogLevel.Warning:
      return DiagnosticSeverity.Warning
    case LogLevel.Info:
    case LogLevel.Debug:
      return DiagnosticSeverity.Information
    default:
      throw InternalError.shouldBeUnreachable()
  }
}

function sourceLocationToRange(sourceLocation: SourceLocation): lsp.Diagnostic['range'] {
  return {
    start: {
      line: sourceLocation.line - 1,
      character: sourceLocation.column,
    },
    end: {
      line: sourceLocation.endLine - 1,
      character: sourceLocation.endColumn,
    },
  }
}

function mapTextEdit(edit: TextEdit): lsp.TextEdit {
  return {
    range: {
      start: mapPosition(edit.range.start),
      end: mapPosition(edit.range.end),
    },
    newText: edit.newText,
  }
}
function mapPosition(position: Position): lsp.Position {
  return {
    character: position.col,
    line: position.line,
  }
}
