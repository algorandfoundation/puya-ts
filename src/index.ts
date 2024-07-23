import { createTsProgram } from './parser'
import { CompileOptions } from './compile-options'
import { buildAwst } from './awst_build'
import { ModuleStatement } from './awst/nodes'
import { LogEvent, logger } from './logger'
import { AwstBuildFailureError } from './errors'
import ts from 'typescript'

export type CompileResult = {
  logs: LogEvent[]
  programDirectory: string
  awst?: Record<string, ModuleStatement[]>
  ast?: Record<string, ts.SourceFile>
}

export function compile(options: CompileOptions): CompileResult {
  // logger.info(undefined, `Compiling source file: ${src}`)
  const programResult = createTsProgram(options)
  const programDirectory = programResult.program.getCurrentDirectory()

  let moduleAwst: Record<string, ModuleStatement[]> = {}
  try {
    moduleAwst = buildAwst(programResult, options)
  } catch (e) {
    if (e instanceof AwstBuildFailureError) {
      return {
        programDirectory,
        logs: logger.export(),
        ast: programResult.sourceFiles,
      }
    }
    throw e
  }
  return {
    programDirectory,
    awst: moduleAwst,
    logs: logger.export(),
    ast: programResult.sourceFiles,
  }
}
