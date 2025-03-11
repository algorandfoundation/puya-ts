import { TextDocument } from 'vscode-languageserver-textdocument'
import type {
  CodeAction,
  Connection,
  Diagnostic,
  DocumentDiagnosticReport,
  FullDocumentDiagnosticReport,
  InitializeResult,
} from 'vscode-languageserver/node.js'
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
import { processInputPaths } from '../input-paths/process-input-paths'
import { LoggingContext, LogLevel } from '../logger'
import { AlgoFile, CompileOptions } from '../options'

export const getDebugLspPort = () => {
  const port = Number(process.env.ALGORAND_LSP_PORT)
  return !isNaN(port) && port > 0 ? port : undefined
}

const resolveConnection = async () => {
  const lspPort = getDebugLspPort()

  if (!lspPort) {
    return createConnection(ProposedFeatures.all)
  }

  // When the debug env variable ALGORAND_LSP_PORT is set, we start the server with socket transport.
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
  let workspaceFolder: string

  connection.onInitialize((params) => {
    // TODO: test this?
    workspaceFolder = params.workspaceFolders?.[0]?.uri ?? ''

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
    connection.console.log('Puya TypeScript Language Server initialized')
  })

  connection.languages.diagnostics.on(async (params) => {
    const document = documents.get(params.textDocument.uri)
    if (document !== undefined) {
      connection.console.log(`Validating document: ${params.textDocument.uri}`)

      const fsPath = URI.parse(workspaceFolder).fsPath
      const diagnosticsMap = await debounceParse(connection, documents, fsPath)

      const currentDocumentDiagnostics = diagnosticsMap.get(document.uri)
      // TODO: need to confirm if this does anything
      const relatedDocumentDiagnostics = Object.fromEntries(
        Array.from(diagnosticsMap.entries())
          .filter(([uri]) => uri !== document.uri)
          .map(([uri, diagnostics]) => [
            uri,
            {
              kind: DocumentDiagnosticReportKind.Full,
              items: diagnostics,
            } satisfies FullDocumentDiagnosticReport,
          ]),
      )

      return {
        kind: DocumentDiagnosticReportKind.Full,
        items: currentDocumentDiagnostics ?? [],
        relatedDocuments: relatedDocumentDiagnostics,
      } satisfies DocumentDiagnosticReport
    } else {
      return {
        kind: DocumentDiagnosticReportKind.Full,
        items: [],
      } satisfies DocumentDiagnosticReport
    }
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

async function parse(connection: Connection, documents: TextDocuments<TextDocument>, path: string): Promise<Map<string, Diagnostic[]>> {
  connection.console.log(`Parsing ${path}`)

  // TODO: test new file saved, then ref by an existing file
  const files = processInputPaths({ paths: [path], outDir: 'tests/virtual-file/out' })

  // To support unsaved files, we need to replace the file content with the content of the document
  const processedFiles = files.map((file) => {
    const fileUri = URI.file(file.sourceFile).toString()
    const document = documents.get(fileUri)

    if (document) {
      return {
        sourceFile: file.sourceFile,
        outDir: 'tests/virtual-file/out',
        fileContents: document.getText(),
      }
    }
    return file
  })

  const logEvents = await compileFiles(processedFiles)

  // Filter for errors and warnings
  const filteredEvents = logEvents.filter((e) => e.level === LogLevel.Error || e.level === LogLevel.Warning)

  // Group diagnostics by file URI
  const diagnosticsMap = new Map<string, Diagnostic[]>()

  for (const event of filteredEvents) {
    if (!event.sourceLocation || !event.sourceLocation.file) continue

    const fileUri = URI.file(event.sourceLocation.file).toString()

    const diagnostic: Diagnostic = {
      source: 'Puya TS',
      severity: event.level === LogLevel.Error ? DiagnosticSeverity.Error : DiagnosticSeverity.Warning,
      range: {
        start: {
          line: event.sourceLocation.line - 1,
          character: event.sourceLocation.column,
        },
        end: {
          line: event.sourceLocation.endLine - 1,
          character: event.sourceLocation.endColumn,
        },
      },
      message: event.message,
    }

    if (!diagnosticsMap.has(fileUri)) {
      diagnosticsMap.set(fileUri, [])
    }

    diagnosticsMap.get(fileUri)!.push(diagnostic)
  }

  return diagnosticsMap
}

async function compileFiles(files: AlgoFile[]) {
  const logCtx = LoggingContext.create()
  await logCtx.run(async () => {
    await compile(
      new CompileOptions({
        filePaths: files,
        dryRun: false,
      }),
    )
  })
  return logCtx.logEvents
}

function debounce<T extends (...args: any[]) => Promise<any>>(func: T, wait: number): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeout: NodeJS.Timeout | null = null
  let pendingPromise: Promise<ReturnType<T>> | null = null
  let pendingResolve: ((value: ReturnType<T>) => void) | null = null

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    if (timeout) {
      clearTimeout(timeout)
    }

    if (!pendingPromise) {
      pendingPromise = new Promise<ReturnType<T>>((resolve) => {
        pendingResolve = resolve
      })
    }

    timeout = setTimeout(async () => {
      const result = await func(...args)
      if (pendingResolve) {
        pendingResolve(result)
        pendingPromise = null
        pendingResolve = null
      }
    }, wait)

    return pendingPromise
  }
}

const debounceParse = debounce(parse, 500)
