import type { CodeAction, Diagnostic, InitializeParams, InitializeResult } from 'vscode-languageserver/node.js'
import {
  createConnection,
  DidChangeConfigurationNotification,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind,
} from 'vscode-languageserver/node.js'

import { TextDocument } from 'vscode-languageserver-textdocument'
import { URI } from 'vscode-uri'

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all)
// 1
// Create a simple text document manager.
const documents = new TextDocuments(TextDocument)

let hasConfigurationCapability = false
let hasWorkspaceFolderCapability = false

connection.onInitialize((params: InitializeParams) => {
  const capabilities = params.capabilities

  // Does the client support the `workspace/configuration` request?
  // If not, we fall back using global settings.
  hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration)
  hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders)

  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      diagnosticProvider: {
        interFileDependencies: false,
        workspaceDiagnostics: false,
      },
      // Advertise code action support so that quick fixes are available.
      codeActionProvider: {
        resolveProvider: false,
      },
    },
  }
  return result
})

connection.onInitialized(() => {
  // TODO: review if we need this
  if (hasConfigurationCapability) {
    // Register for all configuration changes.
    connection.client.register(DidChangeConfigurationNotification.type, undefined)
  }
  if (hasWorkspaceFolderCapability) {
    connection.workspace.onDidChangeWorkspaceFolders((_event) => {
      connection.console.log('Workspace folder change event received.')
    })
  }

  connection.console.log('Initialized')
})

documents.onDidSave(async (event) => {
  connection.sendDiagnostics({
    uri: event.document.uri,
    diagnostics: await validateTextDocument(event.document),
  })
})

async function validateTextDocument(textDocument: TextDocument): Promise<Diagnostic[]> {
  // Get the full file path
  const filePath = URI.parse(textDocument.uri).fsPath
  connection.console.log(`Validating document: ${filePath}`)
  return []
}

connection.onDidChangeWatchedFiles((_change) => {
  // Monitored files have change in VSCode
  connection.console.log('We received a file change event')
})

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection)

// Code Action: Fix "list(" issue by replacing it with "arc4.Array(".
connection.onCodeAction((params) => {
  const document = documents.get(params.textDocument.uri)
  if (!document) {
    return []
  }

  const codeActions: CodeAction[] = []

  return codeActions
})

export function startLanguageServer() {
  connection.listen()
}
