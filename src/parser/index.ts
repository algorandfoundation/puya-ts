import ts from 'typescript'
import { SourceLocation } from '../awst/source-location'
import type { AlgoFile } from '../compile-options'
import { logger, LoggingContext } from '../logger'
import type { DeliberateAny } from '../typescript-helpers'
import { normalisePath } from '../util'
import { resolveModuleNameLiterals } from './resolve-module-name-literals'

export type SourceFileMapping = Record<string, ts.SourceFile>
export type CreateProgramResult = {
  sourceFiles: SourceFileMapping
  program: ts.Program
  programDirectory: string
}

export function createTsProgram(options: { filePaths: AlgoFile[] }): CreateProgramResult {
  const compilerOptions: ts.CompilerOptions = {
    allowJs: false,
    strict: true,
    // Lib names need to be the full file name from the typescript package 'lib' folder.
    lib: ['lib.es2023.d.ts'],
    libReplacement: false,
    target: ts.ScriptTarget.ES2023,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
  }

  const host = ts.createCompilerHost(compilerOptions)

  const program = ts.createProgram(
    options.filePaths.map((p) => p.sourceFile),
    compilerOptions,
    {
      ...host,
      resolveModuleNameLiterals,
      getSourceFile(
        fileName: string,
        languageVersionOrOptions: ts.ScriptTarget | ts.CreateSourceFileOptions,
        onError?: (message: string) => void,
        shouldCreateNewSourceFile?: boolean,
      ): ts.SourceFile | undefined {
        return host.getSourceFile(fileName, languageVersionOrOptions, onError, shouldCreateNewSourceFile)
      },
    },
  )
  const programDirectory = program.getCurrentDirectory()

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
        return [normalisePath(f.fileName, programDirectory), f]
      }),
  )

  LoggingContext.current.sourcesByPath = Object.fromEntries(
    Object.entries(sourceFiles).map(([path, file]) => {
      return [path, file.getFullText().replace(/\r\n/g, '\n').split(/\n/g)]
    }),
  )

  reportDiagnostics(program)
  return {
    sourceFiles,
    program,
    programDirectory: program.getCurrentDirectory(),
  }
}

function reportDiagnostics(program: ts.Program) {
  function reportDiagnostic(diagnostic: ts.Diagnostic) {
    if (isDiagnosticWithLocation(diagnostic)) {
      const sourceLocation = SourceLocation.fromDiagnostic(diagnostic, program.getCurrentDirectory())
      const text = typeof diagnostic.messageText === 'string' ? diagnostic.messageText : diagnostic.messageText.messageText
      switch (diagnostic.category) {
        case ts.DiagnosticCategory.Error:
          logger.error(sourceLocation, text)
          break
        case ts.DiagnosticCategory.Warning:
          logger.warn(sourceLocation, text)
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
