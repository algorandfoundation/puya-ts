import ts from 'typescript'
import { resolveModuleNameLiterals } from './resolve-module-name-literals'
import { CompileOptions } from '../compile-options'
import { SourceLocation } from '../awst/source-location'
import { logger } from '../logger'
import { resolveModuleMetadata } from './resolve-module-metadata'

export type CreateProgramResult = {
  sourceFiles: Record<string, ts.SourceFile>
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

  reportDiagnostics(program)

  const sourceFiles = Object.fromEntries(
    program
      .getSourceFiles()
      .filter((f) => !f.isDeclarationFile)
      .map((f) => {
        const metadata = resolveModuleMetadata(f, program)
        return [metadata.moduleName, f]
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
