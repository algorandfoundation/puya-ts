import type ts from 'typescript'
import type { AWST } from './awst/nodes'
import { validateAwst } from './awst/validation'
import { buildAwst } from './awst_build'
import type { CompilationSet } from './awst_build/models/contract-class-model'
import { registerPTypes } from './awst_build/ptypes/register'
import { typeRegistry } from './awst_build/type-registry'
import type { PuyaTsCompileOptions } from './compile-options'
import { logger, LoggingContext } from './logger'
import { createTsProgram } from './parser'
import { invokePuya } from './puya'
import type { PuyaPassThroughOptions } from './puya/options'

export type CompileResult = {
  programDirectory: string
  awst?: AWST[]
  ast?: Record<string, ts.SourceFile>
  compilationSet?: CompilationSet
}

export type CompileArgs = PuyaTsCompileOptions & PuyaPassThroughOptions

export async function compile({
  filePaths,
  outputAwst,
  outputAwstJson,
  skipVersionCheck = false,
  dryRun = false,
  logLevel,
  ...passThroughOptions
}: CompileArgs): Promise<CompileResult> {
  const loggerCtx = LoggingContext.current
  registerPTypes(typeRegistry)
  const programResult = createTsProgram({ filePaths })
  if (loggerCtx.hasErrors()) {
    logger.info(undefined, 'Compilation halted due to parse errors')
    return {
      programDirectory: programResult.programDirectory,
      ast: programResult.sourceFiles,
    }
  }
  const [moduleAwst, compilationSet] = buildAwst(programResult, { filePaths, outputAwst, outputAwstJson })
  validateAwst(moduleAwst)

  if (loggerCtx.hasErrors()) {
    logger.info(undefined, 'Compilation halted due to errors')
    return {
      programDirectory: programResult.programDirectory,
      awst: moduleAwst,
      ast: programResult.sourceFiles,
      compilationSet,
    }
  }
  if (!dryRun) {
    await invokePuya({
      passThroughOptions,
      skipVersionCheck,
      logLevel,
      filePaths,
      moduleAwst,
      programDirectory: programResult.programDirectory,
      compilationSet,
      sourceFiles: programResult.sourceFiles,
    })
  }

  return {
    programDirectory: programResult.programDirectory,
    awst: moduleAwst,
    ast: programResult.sourceFiles,
    compilationSet,
  }
}
