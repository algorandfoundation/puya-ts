import type ts from 'typescript'
import type { AWST } from './awst/nodes'
import { validateAwst } from './awst/validation'
import { buildAwst } from './awst_build'
import type { CompilationSet } from './awst_build/models/contract-class-model'
import { registerPTypes } from './awst_build/ptypes/register'
import { typeRegistry } from './awst_build/type-registry'
import { appVersion } from './cli/app-version'
import { logger, LoggingContext } from './logger'
import type { CompileOptions } from './options'
import { createTsProgram } from './parser'
import { puyaCompile } from './puya'
import type { PuyaService } from './puya/puya-service'
import type { AbsolutePath } from './util/absolute-path'

export type CompileResult = {
  programDirectory: AbsolutePath
  awst?: AWST[]
  ast?: Record<string, ts.SourceFile>
  compilationSet?: CompilationSet
}

export async function compile(options: CompileOptions, puyaService?: PuyaService): Promise<CompileResult> {
  const loggerCtx = LoggingContext.current
  if (options.treatWarningsAsErrors) loggerCtx.treatWarningsAsErrors = true

  registerPTypes(typeRegistry)
  logger.info(undefined, appVersion({ withAVMVersion: false }))
  const programResult = createTsProgram(options)
  if (loggerCtx.hasErrors()) {
    logger.info(undefined, 'Compilation halted due to parse errors')
    return {
      programDirectory: programResult.programDirectory,
      ast: programResult.sourceFiles,
    }
  }
  const { moduleAwst, compilationSet } = buildAwst(programResult, options)
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
  if (!options.dryRun) {
    await puyaCompile({
      options,
      moduleAwst,
      programDirectory: programResult.programDirectory,
      compilationSet,
      sourceFiles: programResult.sourceFiles,
      puyaService,
    })
  }

  return {
    programDirectory: programResult.programDirectory,
    awst: moduleAwst,
    ast: programResult.sourceFiles,
    compilationSet,
  }
}
