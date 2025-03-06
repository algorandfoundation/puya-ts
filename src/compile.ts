import type ts from 'typescript'
import type { AWST } from './awst/nodes'
import { validateAwst } from './awst/validation'
import { buildAwst } from './awst_build'
import type { CompilationSet } from './awst_build/models/contract-class-model'
import { registerPTypes } from './awst_build/ptypes/register'
import { typeRegistry } from './awst_build/type-registry'
import { logger, LoggingContext } from './logger'
import type { CompileOptions } from './options'
import { createTsProgram } from './parser'
import { invokePuya } from './puya'
import { startPuya, stopPuya } from './puya/run-puya'

export type CompileResult = {
  programDirectory: string
  awst?: AWST[]
  ast?: Record<string, ts.SourceFile>
  compilationSet?: CompilationSet
}

export async function compile(options: CompileOptions): Promise<CompileResult> {
  const loggerCtx = LoggingContext.current

  await startPuya({ command: process.env.PUYA_SCRIPT_PATH!, shell: true })

  let startTime = performance.now()
  registerPTypes(typeRegistry)
  let endTime = performance.now()
  let duration = endTime - startTime
  logger.info(undefined, `registerPTypes took ${duration.toFixed(2)}ms`)

  startTime = performance.now()
  const programResult = createTsProgram(options)
  endTime = performance.now()
  duration = endTime - startTime
  logger.info(undefined, `createTsProgram took ${duration.toFixed(2)}ms`)

  if (loggerCtx.hasErrors()) {
    logger.info(undefined, 'Compilation halted due to parse errors')
    return {
      programDirectory: programResult.programDirectory,
      ast: programResult.sourceFiles,
    }
  }

  startTime = performance.now()
  const [moduleAwst, compilationSet] = buildAwst(programResult, options)
  endTime = performance.now()
  duration = endTime - startTime
  logger.info(undefined, `buildAwst took ${duration.toFixed(2)}ms`)

  startTime = performance.now()
  validateAwst(moduleAwst)
  endTime = performance.now()
  duration = endTime - startTime
  logger.info(undefined, `validateAwst took ${duration.toFixed(2)}ms`)

  if (loggerCtx.hasErrors()) {
    logger.info(undefined, 'Compilation halted due to errors')
    return {
      programDirectory: programResult.programDirectory,
      awst: moduleAwst,
      ast: programResult.sourceFiles,
      compilationSet,
    }
  }
  if (!options.dryRun) {
    startTime = performance.now()
    await invokePuya({
      options,
      moduleAwst,
      programDirectory: programResult.programDirectory,
      compilationSet,
      sourceFiles: programResult.sourceFiles,
    })
    endTime = performance.now()
    duration = endTime - startTime
    logger.info(undefined, `invokePuya took ${duration.toFixed(2)}ms`)

    stopPuya()
  }

  return {
    programDirectory: programResult.programDirectory,
    awst: moduleAwst,
    ast: programResult.sourceFiles,
    compilationSet,
  }
}
