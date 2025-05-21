import { concatMap, debounceTime, map, Observable } from 'rxjs'
import { TextDocument } from 'vscode-languageserver-textdocument'
import type {
  CodeAction,
  Connection,
  Diagnostic,
  Disposable,
  InitializeResult,
  TextDocumentChangeEvent,
} from 'vscode-languageserver/node.js'
import {
  createClientSocketTransport,
  createConnection,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind,
} from 'vscode-languageserver/node.js'
import { URI } from 'vscode-uri'
import { Constants } from '../constants'
import { PuyaService } from '../puya/puya-service'
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
  let puyaService: PuyaService | undefined

  const disposables: Disposable[] = []

  disposables.push(
    connection.onInitialize(async (params) => {
      // The extension sets the workspaceFolder property
      // therefore, workspaceFolders is an array with one element
      workspaceFolder = params.workspaceFolders?.[0]?.uri

      // Initialize PuyaService if workspace folder is available
      if (workspaceFolder) {
        puyaService = await initializePuyaService(workspaceFolder)
        if (!puyaService) {
          return Promise.reject(new Error('Failed to initialize PuyaService'))
        }
      }

      const result: InitializeResult = {
        capabilities: {
          textDocumentSync: TextDocumentSyncKind.Incremental,
          codeActionProvider: {
            resolveProvider: false,
          },
        },
      }
      return result
    }),
  )

  // Initialize PuyaService and wait for it to be ready
  const initializePuyaService = async (workspaceFolder: string): Promise<PuyaService | undefined> => {
    const workspacePath = URI.parse(workspaceFolder).fsPath

    connection.console.log(`[${Constants.puyaServiceSource}]: Initializing PuyaService with workspace path: ${workspacePath}`)
    const service = new PuyaService(workspacePath)

    try {
      await service.start()
      connection.console.log(`[${Constants.puyaServiceSource}]: PuyaService started successfully`)
      return service
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      connection.console.error(`[${Constants.puyaServiceSource}]: Failed to start PuyaService: ${errorMessage}`)
      return undefined
    }
  }

  disposables.push(
    connection.onInitialized(() => {
      connection.console.log(`${Constants.languageServerSource}-ls initialized`)
    }),
  )

  const documentChangeObservable = new Observable<TextDocumentChangeEvent<TextDocument>>((subscriber) => {
    const subscription = documents.onDidChangeContent((event) => {
      subscriber.next(event)
    })

    return subscription.dispose
  })

  const documentChangeSubscription = documentChangeObservable
    .pipe(
      debounceTime(200),
      map(async (_) => {
        return await buildWorkspaceDiagnosticsMap(connection, workspaceFolder, documents, puyaService!)
      }),
      concatMap(async (v) => sendDiagnostics(connection, await v)),
    )
    // All logic for handling the document change event is done inside the pipe
    .subscribe()

  // Make the text document manager listen on the connection
  // for open, change and close text document events
  disposables.push(documents.listen(connection))

  disposables.push(
    connection.onCodeAction((params) => {
      const document = documents.get(params.textDocument.uri)
      if (!document) {
        return []
      }

      const codeActions: CodeAction[] = []

      return codeActions
    }),
  )

  const shutdownDisposable = connection.onShutdown(async () => {
    documentChangeSubscription.unsubscribe()

    // Gracefully shutdown the PuyaService
    if (puyaService) {
      try {
        await puyaService.stop()
        connection.console.log(`[${Constants.puyaServiceSource}]: PuyaService stopped successfully`)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        connection.console.error(`[${Constants.puyaServiceSource}]: Error stopping PuyaService: ${errorMessage}`)
      }
    }

    // Dispose all other disposables
    disposables.forEach((d) => d.dispose())
  })

  connection.onExit(() => {
    shutdownDisposable.dispose()
  })

  connection.listen()
}

async function buildWorkspaceDiagnosticsMap(
  connection: Connection,
  workspaceFolder: string | undefined,
  documents: TextDocuments<TextDocument>,
  puyaService: PuyaService,
): Promise<Map<string, Diagnostic[]>> {
  if (!workspaceFolder) {
    connection.console.error('Workspace folder not set')

    return new Map()
  }

  const workspacePath = URI.parse(workspaceFolder).fsPath
  return await getWorkspaceDiagnostics(connection, workspacePath, documents, puyaService)
}

async function sendDiagnostics(connection: Connection, diagnosticsMap: Map<string, Diagnostic[]>) {
  await Promise.all(
    Array.from(diagnosticsMap, ([docUri, diagnostics]) =>
      connection.sendDiagnostics({
        uri: docUri,
        diagnostics: diagnostics,
      }),
    ),
  )
}
