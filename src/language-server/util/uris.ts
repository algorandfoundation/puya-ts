import { globSync } from 'glob'
import type {
  DidChangeTextDocumentParams,
  DidCloseTextDocumentParams,
  DidOpenTextDocumentParams,
  DidSaveTextDocumentParams,
  Disposable,
  NotificationHandler,
  RequestHandler,
  TextEdit,
  WillSaveTextDocumentParams,
} from 'vscode-languageserver-protocol'
import type { TextDocumentConnection } from 'vscode-languageserver/lib/common/textDocuments'
import type * as lsp from 'vscode-languageserver/node'
import { URI } from 'vscode-uri'

export function normalisedUri(args: { fsPath: string } | { uri: string }): URI {
  if ('fsPath' in args) {
    const resolvedFileName = globSync(args.fsPath, { absolute: true })[0]

    return URI.file(resolvedFileName ?? args.fsPath)
  } else {
    const filePath = URI.parse(args.uri).fsPath
    return normalisedUri({ fsPath: filePath })
  }
}

type TextDocumentConnectionEvents = Pick<lsp.Connection, keyof TextDocumentConnection>

export function createNormalisedTextDocumentConnection(connection: lsp.Connection): TextDocumentConnectionEvents {
  return {
    onDidOpenTextDocument(handler: NotificationHandler<DidOpenTextDocumentParams>): Disposable {
      return connection.onDidOpenTextDocument((params) =>
        handler({ textDocument: { ...params.textDocument, uri: normalisedUri({ uri: params.textDocument.uri }).toString() } }),
      )
    },
    onDidChangeTextDocument(handler: NotificationHandler<DidChangeTextDocumentParams>): Disposable {
      return connection.onDidChangeTextDocument((params) =>
        handler({ ...params, textDocument: { ...params.textDocument, uri: normalisedUri({ uri: params.textDocument.uri }).toString() } }),
      )
    },
    onDidCloseTextDocument(handler: NotificationHandler<DidCloseTextDocumentParams>): Disposable {
      return connection.onDidCloseTextDocument((params) =>
        handler({ textDocument: { ...params.textDocument, uri: normalisedUri({ uri: params.textDocument.uri }).toString() } }),
      )
    },
    onWillSaveTextDocument(handler: NotificationHandler<WillSaveTextDocumentParams>): Disposable {
      return connection.onWillSaveTextDocument((params) =>
        handler({ ...params, textDocument: { ...params.textDocument, uri: normalisedUri({ uri: params.textDocument.uri }).toString() } }),
      )
    },
    onWillSaveTextDocumentWaitUntil(handler: RequestHandler<WillSaveTextDocumentParams, TextEdit[] | undefined | null, void>): Disposable {
      return connection.onWillSaveTextDocumentWaitUntil((params, edits) =>
        handler(
          { ...params, textDocument: { ...params.textDocument, uri: normalisedUri({ uri: params.textDocument.uri }).toString() } },
          edits,
        ),
      )
    },
    onDidSaveTextDocument(handler: NotificationHandler<DidSaveTextDocumentParams>): Disposable {
      return connection.onDidSaveTextDocument((params) =>
        handler({ textDocument: { ...params.textDocument, uri: normalisedUri({ uri: params.textDocument.uri }).toString() } }),
      )
    },
  }
}
