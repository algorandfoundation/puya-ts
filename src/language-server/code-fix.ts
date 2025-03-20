import type { TextDocument } from 'vscode-languageserver-textdocument'
import { CodeActionKind, type CodeAction, type Diagnostic } from 'vscode-languageserver/node'
import { WellKnownErrors } from '../errors'

export const codeFixes: Record<WellKnownErrors, (document: TextDocument, diagnostic: Diagnostic) => CodeAction[]> = {
  [WellKnownErrors.BigIntNeedsWrapping]: (document: TextDocument, diagnostic: Diagnostic): CodeAction[] => {
    return [
      {
        title: 'Wrap in BigUint constructor',
        diagnostics: [diagnostic],
        kind: CodeActionKind.QuickFix,
        edit: {
          changes: {
            [document.uri.toString()]: [
              {
                range: diagnostic.range,
                newText: `BigUint(${document.getText(diagnostic.range)})`,
              },
            ],
          },
        },
      },
    ]
  },
  [WellKnownErrors.NumberNeedsWrapping]: (document: TextDocument, diagnostic: Diagnostic): CodeAction[] => {
    return [
      {
        title: 'Wrap in Uint64 constructor',
        diagnostics: [diagnostic],
        kind: CodeActionKind.QuickFix,
        edit: {
          changes: {
            [document.uri.toString()]: [
              {
                range: diagnostic.range,
                newText: `Uint64(${document.getText(diagnostic.range)})`,
              },
            ],
          },
        },
      },
    ]
  },
}
