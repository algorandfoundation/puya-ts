import { TextDocument } from 'vscode-languageserver-textdocument'
import type { CodeAction, Diagnostic, DocumentDiagnosticReport, InitializeResult } from 'vscode-languageserver/node.js'
import {
  createClientSocketTransport,
  createConnection,
  DiagnosticSeverity,
  DocumentDiagnosticReportKind,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind,
} from 'vscode-languageserver/node.js'
import { URI } from 'vscode-uri'
import { compile } from '../compile'
import { LoggingContext, LogLevel } from '../logger'
import { CompileOptions } from '../options'

const createConnectionFoo = async () => {
  if (process.env.DEBUG !== 'true') {
    return createConnection(ProposedFeatures.all)
  }

  // In debug mode, we start the server with socket transport.
  // Note: this is actually the oposite to how vscode-languageserver is designed.
  // Normally, the extension is the web socker server and the language server is the client.
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

  connection.onInitialize(() => {
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
      return {
        kind: DocumentDiagnosticReportKind.Full,
        items: [],
      } satisfies DocumentDiagnosticReport
    }
  })

  async function validateTextDocument(textDocument: TextDocument): Promise<Diagnostic[]> {
    const filePath = URI.parse(textDocument.uri).fsPath
    connection.console.log(`Validating document: ${filePath}`)

    const errorLogs = await compileFile(textDocument.getText())

    return errorLogs.map((e) => ({
      severity: DiagnosticSeverity.Error,
      range: {
        start: textDocument.positionAt(
          textDocument.offsetAt({
            line: e.sourceLocation!.line - 1,
            character: e.sourceLocation!.column,
          }),
        ),
        end: textDocument.positionAt(
          textDocument.offsetAt({
            line: e.sourceLocation!.endLine - 1,
            character: e.sourceLocation!.endColumn,
          }),
        ),
      },
      message: e.message,
    }))
  }

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

export const compileFile = async (text: string) => {
  const logCtx = LoggingContext.create()
  await logCtx.run(async () => {
    await compile(
      new CompileOptions({
        filePaths: [
          {
            sourceFile: 'tests/virtual-file/test-contract.algo.ts',
            outDir: 'tests/virtual-file/out',
            fileContents: text,
          },
        ],
        dryRun: false,
      }),
    )
  })
  return logCtx.logEvents.filter((e) => e.level === LogLevel.Error)
}
