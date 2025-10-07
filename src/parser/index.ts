import ts from 'typescript'
import { SourceLocation } from '../awst/source-location'
import { logger, LoggingContext, LogLevel, LogSource } from '../logger'
import type { CompileOptions } from '../options'
import type { DeliberateAny } from '../typescript-helpers'
import { AbsolutePath } from '../util/absolute-path'
import { resolveModuleNameLiterals } from './resolve-module-name-literals'

export type SourceFileMapping = Record<string, ts.SourceFile>
export type CreateProgramResult = {
  sourceFiles: SourceFileMapping
  program: ts.Program
  programDirectory: AbsolutePath
}

export function createTsProgram(options: Pick<CompileOptions, 'filePaths' | 'sourceFileProvider'>): CreateProgramResult {
  const compilerOptions: ts.CompilerOptions = {
    allowJs: false,
    strict: true,
    // Lib names need to be the full file name from the typescript package 'lib' folder.
    lib: ['lib.es2023.full.d.ts'],
    libReplacement: false,
    target: ts.ScriptTarget.ES2023,
    module: ts.ModuleKind.ESNext,
    types: [],
    moduleResolution: ts.ModuleResolutionKind.Bundler,
  }

  const host = ts.createCompilerHost(compilerOptions)
  if (options.sourceFileProvider) {
    const { fileExists, readFile } = host
    const overridden = options.sourceFileProvider({ fileExists, readFile })
    host.fileExists = overridden.fileExists
    host.readFile = overridden.readFile
  }

  host.resolveModuleNameLiterals = resolveModuleNameLiterals

  const program = ts.createProgram(
    options.filePaths.map((p) => p.sourceFile.toString()),
    compilerOptions,
    host,
  )
  const programDirectory = AbsolutePath.resolve({ path: program.getCurrentDirectory() })

  const sourceFiles = Object.fromEntries(
    program
      .getSourceFiles()
      .filter((f) => !f.isDeclarationFile)
      .map((f) => {
        if (!(f as DeliberateAny)['externalModuleIndicator']) {
          logger.warn(
            SourceLocation.fromFile(f, programDirectory),
            'File is being interpreted as a script because it has no import or export statements. Containing statements will be evaluated in a global context.',
          )
        }
        return [AbsolutePath.resolve({ path: f.fileName, workingDirectory: programDirectory }).toString(), f]
      }),
  )

  LoggingContext.current.setSourcesByPath(
    Object.fromEntries(
      Object.entries(sourceFiles).map(([path, file]) => {
        return [path, file.getFullText().split(/\n/g)]
      }),
    ),
  )

  reportDiagnostics(program)
  return {
    sourceFiles,
    program,
    programDirectory: AbsolutePath.resolve({ path: program.getCurrentDirectory() }),
  }
}

function reportDiagnostics(program: ts.Program) {
  function reportDiagnostic(diagnostic: ts.Diagnostic) {
    if (isDiagnosticWithLocation(diagnostic)) {
      const sourceLocation = SourceLocation.fromDiagnostic(diagnostic, AbsolutePath.resolve({ path: program.getCurrentDirectory() }))
      const text = typeof diagnostic.messageText === 'string' ? diagnostic.messageText : diagnostic.messageText.messageText
      switch (diagnostic.category) {
        case ts.DiagnosticCategory.Error:
          logger.addLog({
            logSource: LogSource.TypeScript,
            message: text,
            sourceLocation,
            level: LogLevel.Error,
          })
          break
        case ts.DiagnosticCategory.Warning:
          logger.addLog({
            logSource: LogSource.TypeScript,
            message: text,
            sourceLocation,
            level: LogLevel.Warning,
          })
          break
      }
    }
  }

  function isDiagnosticWithLocation(d: ts.Diagnostic): d is ts.DiagnosticWithLocation {
    return Object.hasOwn(d, 'file')
  }

  program.getSemanticDiagnostics().forEach(reportDiagnostic)
  program.getSyntacticDiagnostics().forEach(reportDiagnostic)
}
