import type ts from 'typescript'
import type { AWST } from './awst/nodes'
import { validateAwst } from './awst/validation'
import { buildAwst } from './awst_build'
import type { CompilationSet } from './awst_build/models/contract-class-model'
import { registerPTypes } from './awst_build/ptypes/register'
import { typeRegistry } from './awst_build/type-registry'
import { buildCompileOptions } from './compile-options'
import { logger, LoggingContext, type LogLevel } from './logger'
import type { CreateProgramResult } from './parser'
import { createTsProgram } from './parser'
import { invokePuya } from './puya'
import type { PuyaPassThroughOptions } from './puya/options'

export type CompileResult = {
  programDirectory: string
  awst?: AWST[]
  ast?: Record<string, ts.SourceFile>
  compilationSet?: CompilationSet
}

export type CompileArgs = {
  paths: string[]
  outputAwst: boolean
  outDir: string
  outputAwstJson: boolean
  skipVersionCheck?: boolean
  workingDirectory?: string
  dryRun?: boolean
  logLevel: LogLevel
  hooks?: Partial<Hooks>
} & PuyaPassThroughOptions

type Hooks = {
  /**
   * Called after TypeScript parsing, but before AWST build. Use this hook to add or remove TS AST nodes before AWST build
   *
   * If implemented, this method should return true to continue compilation or false to stop
   * @param createProgramResult The result of TypeScript compilation
   */
  onProgramCreated(createProgramResult: CreateProgramResult): boolean
  /**
   * Called after AWST build, but before invocation of puya. Use this hook to add or remove AWST nodes before puya build
   *
   * If implemented, this method should return true to continue compilation or false to stop
   * @param moduleAwst All AWST nodes of the build
   * @param compilationSet An array of references to AWST nodes which should result in compilation output.
   */
  onAwstBuilt(moduleAwst: AWST[], compilationSet: CompilationSet): boolean
}

export async function compile({
  paths,
  outputAwst,
  outDir,
  outputAwstJson,
  skipVersionCheck = false,
  workingDirectory,
  dryRun = false,
  logLevel,
  hooks,
  ...passThroughOptions
}: CompileArgs): Promise<CompileResult> {
  const compileOptions = buildCompileOptions({
    paths,
    outputAwst,
    outDir,
    outputAwstJson,
    skipVersionCheck,
    workingDirectory,
    dryRun,
    logLevel,
  })

  const loggerCtx = LoggingContext.current
  registerPTypes(typeRegistry)
  const programResult = createTsProgram(compileOptions)
  if (loggerCtx.hasErrors()) {
    logger.info(undefined, 'Compilation halted due to parse errors')
    return {
      programDirectory: programResult.programDirectory,
      ast: programResult.sourceFiles,
    }
  }
  if (hooks?.onProgramCreated?.(programResult) === false) {
    throw new Error('Compilation halted by onProgramCreated hook')
  }
  const [moduleAwst, compilationSet] = buildAwst(programResult, compileOptions)
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
  if (hooks?.onAwstBuilt?.(moduleAwst, compilationSet) === false) {
    throw new Error('Compilation halted by onAwstBuilt hook')
  }
  if (!compileOptions.dryRun) {
    await invokePuya({
      passThroughOptions,
      compileOptions,
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
