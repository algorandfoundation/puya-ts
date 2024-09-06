import ts from 'typescript'
import { resolveModuleNameLiterals } from './resolve-module-name-literals'
import type { CompileOptions } from '../compile-options'
import { SourceLocation } from '../awst/source-location'
import { logger } from '../logger'
import { normalisePath } from '../util'
import type { DeliberateAny } from '../typescript-helpers'

export type SourceFileMapping = Record<string, ts.SourceFile>
export type CreateProgramResult = {
  sourceFiles: SourceFileMapping
  program: ts.Program
}

export function createTsProgram(options: CompileOptions) {
  const compilerOptions: ts.CompilerOptions = {
    allowJs: false,
    noImplicitAny: true,
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
  }

  const host = ts.createCompilerHost(compilerOptions)
  const program = ts.createProgram(options.filePaths, compilerOptions, {
    ...host,
    resolveModuleNameLiterals,
  })
  const programDirectory = program.getCurrentDirectory()

  reportDiagnostics(program)

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

  return {
    sourceFiles,
    program,
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
