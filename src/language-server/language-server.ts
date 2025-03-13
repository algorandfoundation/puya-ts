import { TextDocument } from 'vscode-languageserver-textdocument'
import type { CodeAction, DocumentDiagnosticReport, InitializeResult } from 'vscode-languageserver/node.js'
import {
  createClientSocketTransport,
  createConnection,
  DocumentDiagnosticReportKind,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind,
} from 'vscode-languageserver/node.js'
import { URI } from 'vscode-uri'
import { debouncegetWorkspaceDiagnostics } from './diagnostics'

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
        diagnosticProvider: {
          interFileDependencies: true,
          workspaceDiagnostics: false,
        },
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

  connection.languages.diagnostics.on(async (params) => {
    const document = documents.get(params.textDocument.uri)

    if (!workspaceFolder) {
      connection.console.error('Workspace folder not set')
      return {
        kind: DocumentDiagnosticReportKind.Full,
        items: [],
      } satisfies DocumentDiagnosticReport
    }

    if (!document) {
      connection.console.error('Document not found')
      return {
        kind: DocumentDiagnosticReportKind.Full,
        items: [],
      } satisfies DocumentDiagnosticReport
    }

    connection.console.debug(`Validating document: ${params.textDocument.uri}`)

    const workspacePath = URI.parse(workspaceFolder).fsPath
    const diagnosticsMap = await debouncegetWorkspaceDiagnostics(connection, workspacePath, documents)

    const currentDocumentDiagnostics = diagnosticsMap.get(document.uri)

    return {
      kind: DocumentDiagnosticReportKind.Full,
      items: currentDocumentDiagnostics ?? [],
    } satisfies DocumentDiagnosticReport
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

  connection.listen()
}
