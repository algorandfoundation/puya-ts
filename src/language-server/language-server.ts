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
    }),
  )

  // Initialize PuyaService and wait for it to be ready
  const initializePuyaService = async (): Promise<PuyaService | undefined> => {
    if (workspaceFolder) {
      const workspacePath = URI.parse(workspaceFolder).fsPath

      connection.console.log(`Initializing PuyaService with workspace path: ${workspacePath}`)
      const service = new PuyaService(workspacePath, (message) => {
        connection.console.debug(`[PUYA-SERVICE]: ${message}`)
      })

      try {
        await service.start()
        connection.console.log('PuyaService started successfully')
        return service
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        connection.console.error(`Failed to start PuyaService: ${errorMessage}`)
        return undefined
      }
    }
    return undefined
  }

  disposables.push(
    connection.onInitialized(async () => {
      connection.console.log(`${Constants.languageServerSource}-ls initialized`)
      // Initialize PuyaService if workspace folder is available
      puyaService = await initializePuyaService()
      if (!puyaService) {
        connection.window.showErrorMessage('Failed to initialize PuyaService. Diagnostics will not be available.')
      }
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
        // Only run diagnostics if puyaService is initialized
        if (puyaService && workspaceFolder) {
          return await buildWorkspaceDiagnosticsMap(connection, workspaceFolder, documents, puyaService)
        }
        return new Map<string, Diagnostic[]>()
      }),
      concatMap(async (v) => sendDiagnostics(connection, await v)),
    )
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
        connection.console.log('PuyaService stopped successfully')
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        connection.console.error(`Error stopping PuyaService: ${errorMessage}`)
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
  workspaceFolder: string,
  documents: TextDocuments<TextDocument>,
  puyaService: PuyaService,
): Promise<Map<string, Diagnostic[]>> {
  try {
    const workspacePath = URI.parse(workspaceFolder).fsPath
    return await getWorkspaceDiagnostics(connection, workspacePath, documents, puyaService)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    connection.console.error(`Error getting diagnostics: ${errorMessage}`)
    return new Map()
  }
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
