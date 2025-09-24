import { TextDocument } from 'vscode-languageserver-textdocument'
import * as lsp from 'vscode-languageserver/node'
import { Constants } from '../constants'
import { CompileTriggerQueue } from './compile-trigger-queue'
import { CompileWorker } from './compile-worker'
import type { FileDiagnosticsChanged } from './diagnostics-manager'
import { DiagnosticsManager } from './diagnostics-manager'
import { LsLogger } from './ls-logger'
import { isCodeFixData } from './mapping'
import { resolvePuyaPath } from '../puya/resolve-puya-path'

/* eslint-disable no-console */

const resolveConnection = async (lspPort: number | undefined) => {
  if (!lspPort) {
    return lsp.createConnection(lsp.ProposedFeatures.all)
  }

  // When the debug env variable PUYA_TS_DEBUG_LSP_PORT is set, we start the server with socket transport.
  // Note: this is actually the opposite to how vscode-languageserver is designed.
  // Normally, the extension is the web socker server and the language server is the client.
  // Here, we flip it. This allows an easier debugging experience.
  // If changes are made to the language server, you can just restart the debugger
  // and choose the option "Restart language server" in the VS Code extension host instance.
  const transport = await lsp.createClientSocketTransport(lspPort)
  const protocol = await transport.onConnected()

  return lsp.createConnection(lsp.ProposedFeatures.all, protocol[0], protocol[1])
}

export type LanguageServerOptions = {
  port?: number
}

export class PuyaLanguageServer {
  readonly documents = new lsp.TextDocuments(TextDocument)
  readonly triggers = new CompileTriggerQueue()
  readonly workspaceFolders: lsp.URI[] = []
  readonly logger: LsLogger
  readonly diagnosticsMgr: DiagnosticsManager
  readonly compileWorker: CompileWorker

  constructor(
    public readonly connection: lsp.Connection,
    puyaPath: string,
  ) {
    console.log('Language server started')
    this.logger = new LsLogger(connection)
    this.diagnosticsMgr = new DiagnosticsManager()
    this.compileWorker = new CompileWorker(this.triggers, this.documents, this.logger, this.diagnosticsMgr, puyaPath)

    connection.onInitialize(this.initialize.bind(this))
    connection.onInitialized(this.initialized.bind(this))
    connection.onCodeAction(this.codeAction.bind(this))
    this.documents.onDidChangeContent(this.documentDidChangeContent.bind(this))
    this.diagnosticsMgr.onFileDiagnosticsChanged(this.fileDiagnosticsChanged.bind(this))
    connection.onShutdown(this.shutdown.bind(this))
  }

  start() {
    this.documents.listen(this.connection)
    this.connection.listen()
    this.compileWorker.start()
  }

  async shutdown() {
    await this.compileWorker.stop()
  }

  initialize(params: lsp.InitializeParams): lsp.InitializeResult {
    this.workspaceFolders.push(...(params.workspaceFolders?.map((f) => f.uri) ?? []))
    this.triggers.enqueue({
      type: 'workspace',
      workspaces: this.workspaceFolders,
    })
    return {
      capabilities: {
        textDocumentSync: lsp.TextDocumentSyncKind.Incremental,
        codeActionProvider: {
          resolveProvider: false,
        },
      },
    }
  }

  initialized(params: lsp.InitializedParams) {
    this.connection.console.log(`${Constants.languageServerSource}-ls initialized`)
  }

  fileDiagnosticsChanged(params: FileDiagnosticsChanged) {
    // TODO: Maybe need to make sure diagnostics for a single file are always sent in the order they're produced
    this.connection.console.log(`[Diagnostics Changed]: ${params.uri}`)

    void this.connection.sendDiagnostics(params)
  }

  documentDidChangeContent(params: lsp.TextDocumentChangeEvent<TextDocument>) {
    this.connection.console.log(`[Document Changed]: ${params.document.uri}`)
    this.diagnosticsMgr.setDiagnostics({ fileUri: params.document.uri, version: params.document.version, diagnostics: [] })

    this.triggers.enqueue({
      type: 'workspace',
      workspaces: this.workspaceFolders,
    })
  }

  /**
   * Bound to connection.onCodeAction and called when a user hovers over a piece of code.
   *
   * Params includes the text range the user is hovering over and any diagnostics known to the
   * client at the time.
   *
   * Response should include actions the user can take and the command or text edits that should be
   * invoked/applied if selected
   * @param params
   */
  codeAction(params: lsp.CodeActionParams): lsp.CodeAction[] {
    return params.context.diagnostics.flatMap((d): lsp.CodeAction | lsp.CodeAction[] => {
      if (isCodeFixData(d.data)) {
        return {
          title: d.data.message,
          kind: lsp.CodeActionKind.QuickFix,
          diagnostics: [d],
          edit: {
            changes: {
              [params.textDocument.uri]: [...d.data.edits],
            },
          },
        }
      }
      return []
    })
  }
}

export async function startLanguageServer(options: LanguageServerOptions) {
  // output to stderr to avoid interfering with stdio protocol
  console.error('Language server starting...')

  const connection = await resolveConnection(options.port)
  // TODO: allow overriding puya path?
  const puyaPath = await resolvePuyaPath()
  const server = new PuyaLanguageServer(connection, puyaPath)
  server.start()
}
