import type { Connection, Diagnostic } from 'vscode-languageserver'
import { DiagnosticSeverity } from 'vscode-languageserver'
import type { TextDocument } from 'vscode-languageserver-textdocument'
import type { TextDocuments } from 'vscode-languageserver/node.js'
import { URI } from 'vscode-uri'
import { AwstSerializer } from '../awst/json-serialize-awst'
import type { SourceLocation } from '../awst/source-location'
import { compile } from '../compile'
import { Constants } from '../constants'
import { processInputPaths } from '../input-paths/process-input-paths'
import type { LogEvent } from '../logger'
import { LoggingContext, LogLevel } from '../logger'
import type { AlgoFile } from '../options'
import { CompileOptions } from '../options'
import { jsonSerializeSourceFiles } from '../parser/json-serialize-source-files'
import { buildCompilationSetMapping } from '../puya/build-compilation-set-mapping'
import type { PuyaService } from '../puya/puya-service'

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

async function compileAndExtractLogs(files: AlgoFile[], connection: Connection, puyaService: PuyaService): Promise<LogEventWithSource[]> {
  const logCtx = LoggingContext.create()

  return await logCtx.run(async () => {
    try {
      // Compile with the original compile method but in dry-run mode to get the AWST
      const compileOptions = new CompileOptions({
        filePaths: files,
        dryRun: true,
      })

      connection.console.info('Starting AWST compilation')
      const { awst, compilationSet, programDirectory, ast: sourceFiles } = await compile(compileOptions)

      if (!awst || !compilationSet || !sourceFiles) {
        throw new Error('Failed to compile TypeScript to AWST')
      }

      // Serialize AWST and build compilation set mapping for the puya service
      connection.console.info('Serializing AWST and preparing compilation set')
      const serializer = new AwstSerializer({
        programDirectory: programDirectory,
        sourcePaths: 'absolute',
      })

      const serializedAwst = serializer.serialize(awst)
      const sourceAnnotations = jsonSerializeSourceFiles(sourceFiles, programDirectory)

      const compilationSetMapping = buildCompilationSetMapping({
        awst,
        inputPaths: files,
        compilationSet,
      })

      // Use the puya service to compile the AWST
      connection.console.info('Sending compilation request to puya service')
      const result = await puyaService.compile({
        awst: serializedAwst,
        compilationSet: compilationSetMapping,
        sourceAnnotations,
      })

      // Convert puya service logs to LogEvents
      connection.console.info(`Received ${result.logs.length} logs from puya service`)

      return logCtx.logEvents
        .filter((e) => e.level === LogLevel.Error || e.level === LogLevel.Warning)
        .filter((e): e is LogEventWithSource => Boolean(e.sourceLocation?.file))
    } catch (_) {
      return logCtx.logEvents
        .filter((e) => e.level === LogLevel.Error || e.level === LogLevel.Warning)
        .filter((e): e is LogEventWithSource => Boolean(e.sourceLocation?.file))
    }
  })
}

function mapToDiagnostic(event: LogEventWithSource): Diagnostic {
  return {
    source: Constants.languageServerSource,
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

export async function getWorkspaceDiagnostics(
  connection: Connection,
  workspaceFolder: string,
  documents: TextDocuments<TextDocument>,
  puyaService: PuyaService,
): Promise<Map<string, Diagnostic[]>> {
  try {
    connection.console.debug(`Parsing ${workspaceFolder}`)

    const files = prepareFiles(workspaceFolder, documents)
    const logEvents = await compileAndExtractLogs(files, connection, puyaService)

    return files.reduce((acc, file) => {
      const diagnostics = logEvents.filter((e) => e.sourceLocation.file === file.sourceFile).map(mapToDiagnostic)
      acc.set(URI.file(file.sourceFile).toString(), diagnostics)
      return acc
    }, new Map<string, Diagnostic[]>())
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    connection.console.error(`Failed to compile: ${errorMessage}`)
    return new Map()
  }
}
