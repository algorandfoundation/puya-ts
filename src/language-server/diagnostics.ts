import type { Connection, Diagnostic } from 'vscode-languageserver'
import { DiagnosticSeverity } from 'vscode-languageserver'
import type { TextDocument } from 'vscode-languageserver-textdocument'
import type { TextDocuments } from 'vscode-languageserver/node.js'
import { URI } from 'vscode-uri'
import type { SourceLocation } from '../awst/source-location'
import { compile } from '../compile'
import { processInputPaths } from '../input-paths/process-input-paths'
import type { LogEvent } from '../logger'
import { LoggingContext, LogLevel } from '../logger'
import type { AlgoFile } from '../options'
import { CompileOptions } from '../options'
import { debounce } from '../util/debounce'

type LogEventWithSource = LogEvent & { sourceLocation: SourceLocation & { file: string } }

function prepareFiles(workspaceFolder: string, documents: TextDocuments<TextDocument>) {
  const files = processInputPaths({ paths: [workspaceFolder] })

  // To support unsaved files, we need to replace the file content with the content of the document
  return files.map((file) => {
    const fileUri = URI.file(file.sourceFile).toString()
    const document = documents.get(fileUri)

    if (document) {
      return {
        sourceFile: file.sourceFile,
        outDir: '',
        fileContents: document.getText(),
      } satisfies AlgoFile
    }
    return file
  })
}

async function compileAndExtractLogs(files: AlgoFile[]): Promise<LogEventWithSource[]> {
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
    .filter((e) => e.level === LogLevel.Error || e.level === LogLevel.Warning)
    .filter((e): e is LogEventWithSource => Boolean(e.sourceLocation && e.sourceLocation.file))
}

function mapToDiagnostic(event: LogEventWithSource): Diagnostic {
  return {
    source: 'Algorand TypeScript',
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
}

async function getWorkspaceDiagnostics(
  connection: Connection,
  workspaceFolder: string,
  documents: TextDocuments<TextDocument>,
): Promise<Map<string, Diagnostic[]>> {
  try {
    connection.console.debug(`Parsing ${workspaceFolder}`)

    const files = prepareFiles(workspaceFolder, documents)

    const logEvents = await compileAndExtractLogs(files)

    // Group diagnostics by file URI
    const diagnosticsMap = new Map<string, Diagnostic[]>()

    for (const event of logEvents) {
      const fileUri = URI.file(event.sourceLocation.file).toString()
      const diagnostic = mapToDiagnostic(event)

      if (!diagnosticsMap.has(fileUri)) {
        diagnosticsMap.set(fileUri, [])
      }
      diagnosticsMap.get(fileUri)!.push(diagnostic)
    }

    return diagnosticsMap
  } catch (error) {
    connection.console.error(`Failed to compile: ${JSON.stringify(error)}`)
    return new Map()
  }
}

export const debouncegetWorkspaceDiagnostics = debounce(getWorkspaceDiagnostics, 200)
