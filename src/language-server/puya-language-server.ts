import { TextDocument } from 'vscode-languageserver-textdocument'
import * as lsp from 'vscode-languageserver/node'
import { Constants } from '../constants'
import { logger } from '../logger'
import { LanguageServerLogSink } from '../logger/sinks/language-server-log-sink'
import { resolvePuyaPath } from '../puya/resolve-puya-path'
import { CompileTriggerQueue } from './compile-trigger-queue'
import { CompileWorker } from './compile-worker'
import type { FileDiagnosticsChanged } from './diagnostics-manager'
import { DiagnosticsManager } from './diagnostics-manager'
import { isCodeFixData } from './mapping'
import { LogExceptions } from './util/log-exceptions'

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
  customPuyaPath?: string
}

export class PuyaLanguageServer {
  readonly documents = new lsp.TextDocuments(TextDocument)
  readonly triggers = new CompileTriggerQueue()
  readonly workspaceFolders: lsp.URI[] = []
  readonly diagnosticsMgr: DiagnosticsManager
  readonly compileWorker: CompileWorker
  stopping = false

  constructor(
    public readonly connection: lsp.Connection,
    puyaPath: string,
  ) {
    this.diagnosticsMgr = new DiagnosticsManager()
    this.compileWorker = new CompileWorker(this.triggers, this.documents, this.diagnosticsMgr, puyaPath)

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
    logger.debug(undefined, '[PuyaLanguageServer] Shutting down')
    this.stopping = true
    await this.compileWorker.stop()
    logger.debug(undefined, '[PuyaLanguageServer] Shutdown')
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

  @LogExceptions
  initialized(params: lsp.InitializedParams) {
    logger.debug(undefined, `${Constants.languageServerSource}-ls initialized`)
  }

  blah = Promise.resolve()

  @LogExceptions
  async fileDiagnosticsChanged(params: FileDiagnosticsChanged) {
    if (this.stopping) {
      this.connection.console.debug(`[Diagnostics Ignored (shutting down)]: ${params.uri}`)
      return
    }
    // TODO: Maybe need to make sure diagnostics for a single file are always sent in the order they're produced
    this.connection.console.debug(`[Diagnostics Changed]: ${params.uri}`)

    await this.connection.sendDiagnostics(params)
    this.connection.console.debug(`[Diagnostics Sent]: ${params.uri}`)
  }

  @LogExceptions
  documentDidChangeContent(params: lsp.TextDocumentChangeEvent<TextDocument>) {
    if (this.stopping) return
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
  @LogExceptions
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
  const connection = await resolveConnection(options.port)
  logger.configure([new LanguageServerLogSink(connection)])
  try {
    const puyaPath = await resolvePuyaPath(options)
    const server = new PuyaLanguageServer(connection, puyaPath)
    server.start()
  } catch (e) {
    connection.console.error(`Unhandled exception ${e}`)
  }
}
