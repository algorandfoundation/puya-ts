import { TextDocument } from 'vscode-languageserver-textdocument'
import type { CodeAction, Diagnostic, DocumentDiagnosticReport, InitializeParams, InitializeResult } from 'vscode-languageserver/node.js'
import {
  createClientSocketTransport,
  createConnection,
  DidChangeConfigurationNotification,
  DocumentDiagnosticReportKind,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind,
} from 'vscode-languageserver/node.js'
import { URI } from 'vscode-uri'
import { compile } from '../compile'
import { processInputPaths } from '../input-paths/process-input-paths'
import { LoggingContext, LogLevel } from '../logger'
import { CompileOptions, LocalsCoalescingStrategy } from '../options'

const createConnectionFoo = async () => {
  if (process.env.DEBUG !== 'true') {
    return createConnection(ProposedFeatures.all)
  }

  // In debug mode, we start the server with socket transport.
  // Note: this is actually the oposite to how vscode-languageserver is designed.
  // Normall, the extension is the web socker server and the language server is the client.
  // Here, we flip it. This allows an easier debugging experience.
  // If changes are made to the language server, you can just restart the debugger
  // and choose the option "Restart language server" in the VS Code extension host instance.
  const transport = await createClientSocketTransport(8888)
  const protocol = await transport.onConnected()

  return createConnection(ProposedFeatures.all, protocol[0], protocol[1])
}

export async function startLanguageServer() {
  const connection = await createConnectionFoo()

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

    connection.console.log('Mighty server initialized')
  })

  connection.languages.diagnostics.on(async (params) => {
    const document = documents.get(params.textDocument.uri)
    if (document !== undefined) {
      return {
        kind: DocumentDiagnosticReportKind.Full,
        items: await validateTextDocument(document),
      } satisfies DocumentDiagnosticReport
    } else {
      // We don't know the document. We can either try to read it from disk
      // or we don't report problems for it.
      return {
        kind: DocumentDiagnosticReportKind.Full,
        items: [],
      } satisfies DocumentDiagnosticReport
    }
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
    // const errorLogs = await compileFile(filePath)
    // return errorLogs.map((e) => ({
    //   severity: DiagnosticSeverity.Error,
    //   range: {
    //     start: textDocument.positionAt(
    //       textDocument.offsetAt({
    //         line: e.sourceLocation!.line - 1,
    //         character: e.sourceLocation!.column,
    //       }),
    //     ),
    //     end: textDocument.positionAt(
    //       textDocument.offsetAt({
    //         line: e.sourceLocation!.endLine - 1,
    //         character: e.sourceLocation!.endColumn,
    //       }),
    //     ),
    //   },
    //   message: e.message,
    // }))
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

  connection.listen()
}

export const compileFile = async (path: string) => {
  const logCtx = LoggingContext.create()
  await logCtx.run(async () => {
    await compile(
      new CompileOptions({
        outputAwst: false,
        outputAwstJson: false,
        logLevel: LogLevel.Info,
        outputTeal: false,
        outputArc32: false,
        outputArc56: false,
        outputSsaIr: false,
        outputSourceMap: false,
        outputOptimizationIr: false,
        outputDestructuredIr: false,
        outputMemoryIr: false,
        outputBytecode: false,
        debugLevel: 1,
        optimizationLevel: 1,
        targetAvmVersion: 10,
        cliTemplateDefinitions: {},
        templateVarsPrefix: 'TMPL_',
        localsCoalescingStrategy: LocalsCoalescingStrategy.root_operand,
        filePaths: processInputPaths({ paths: [path], outDir: '' }),
        skipVersionCheck: true,
        dryRun: true,
      }),
    )
  })
  return logCtx.logEvents.filter((e) => e.level === LogLevel.Error)
}
