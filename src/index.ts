import { createTsProgram } from './parser'
import type { CompileOptions } from './compile-options'
import { buildAwst } from './awst_build'
import type { LogEvent } from './logger'
import { logger } from './logger'
import { AwstBuildFailureError } from './errors'
import type ts from 'typescript'
import { registerPTypes } from './awst_build/ptypes/register'
import { typeRegistry } from './awst_build/type-registry'
import type { AWST } from './awst/nodes'
import { invokePuya } from './puya'

export type CompileResult = {
  logs: LogEvent[]
  programDirectory: string
  awst?: AWST[]
  ast?: Record<string, ts.SourceFile>
}

export function compile(options: CompileOptions): CompileResult {
  registerPTypes(typeRegistry)
  const programResult = createTsProgram(options)
  const programDirectory = programResult.program.getCurrentDirectory()

  let moduleAwst: AWST[] = []
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
  if (!options.dryRun) {
    invokePuya({
      options,
      moduleAwst,
      programDirectory,
      sourceFiles: programResult.sourceFiles,
    })
  }

  return {
    programDirectory,
    awst: moduleAwst,
    logs: logger.export(),
    ast: programResult.sourceFiles,
  }
}
