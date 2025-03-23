import { concatMap, debounceTime, map, Observable } from 'rxjs'
import { TextDocument } from 'vscode-languageserver-textdocument'
import type { CodeAction, Diagnostic, InitializeResult, TextDocumentChangeEvent } from 'vscode-languageserver/node.js'
import {
  createClientSocketTransport,
  createConnection,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind,
} from 'vscode-languageserver/node.js'
import { URI } from 'vscode-uri'
import { getWorkspaceDiagnostics } from './diagnostics'

export const getDebugLspPort = () => {
  const port = Number(process.env.PUYA_TS_DEBUG_LSP_PORT)
  return !isNaN(port) && port > 0 ? port : undefined
}

const resolveConnection = async () => {
  const lspPort = getDebugLspPort()

  if (!lspPort) {
    return createConnection(ProposedFeatures.all)
  }

  // When the debug env variable PUYA_TS_DEBUG_LSP_PORT is set, we start the server with socket transport.
  // Note: this is actually the oposite to how vscode-languageserver is designed.
  // Normally, the extension is the web socker server and the language server is the client.
  // Here, we flip it. This allows an easier debugging experience.
  // If changes are made to the language server, you can just restart the debugger
  // and choose the option "Restart language server" in the VS Code extension host instance.
  const transport = await createClientSocketTransport(lspPort)
  const protocol = await transport.onConnected()

  return createConnection(ProposedFeatures.all, protocol[0], protocol[1])
}

export async function startLanguageServer() {
  const connection = await resolveConnection()

  // Create a simple text document manager.
  const documents = new TextDocuments(TextDocument)
  let workspaceFolder: string | undefined

  connection.onInitialize((params) => {
    // The extension sets the workspaceFolder property
    // therefore, workspaceFolders is an array with one element
    workspaceFolder = params.workspaceFolders?.[0]?.uri

    const result: InitializeResult = {
      capabilities: {
        textDocumentSync: TextDocumentSyncKind.Incremental,
        codeActionProvider: {
          resolveProvider: false,
        },
      },
    }
    return result
  })

  connection.onInitialized(() => {
    connection.console.log('Algorand TypeScript Language Server initialized')
  })

  const documentChangeObservable = new Observable<TextDocumentChangeEvent<TextDocument>>((subscriber) => {
    documents.onDidChangeContent((event) => {
      subscriber.next(event)
    })
  })

  async function buildWorkspaceDiagnosticsMap(): Promise<Map<string, Diagnostic[]>> {
    if (!workspaceFolder) {
      connection.console.error('Workspace folder not set')

      return new Map()
    }

    const workspacePath = URI.parse(workspaceFolder).fsPath
    return await getWorkspaceDiagnostics(connection, workspacePath, documents)
  }

  async function sendDiagnostics(diagnosticsMap: Map<string, Diagnostic[]>) {
    for (const [docUri, diagnostics] of diagnosticsMap.entries()) {
      await connection.sendDiagnostics({
        uri: docUri,
        diagnostics: diagnostics,
      })
    }
  }

  const documentChangeSubscription = documentChangeObservable
    .pipe(
      debounceTime(200),
      map(buildWorkspaceDiagnosticsMap),
      concatMap(async (v) => sendDiagnostics(await v)),
    )
    .subscribe(async () => {
      // Need a subscriber or the observable won't fire
    })

  // Make the text document manager listen on the connection
  // for open, change and close text document events
  documents.listen(connection)

  connection.onCodeAction((params) => {
    const document = documents.get(params.textDocument.uri)
    if (!document) {
      return []
    }

    const codeActions: CodeAction[] = []

    return codeActions
  })

  connection.onShutdown(() => {
    documentChangeSubscription.unsubscribe()
  })

  connection.listen()
}
