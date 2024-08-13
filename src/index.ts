import { createTsProgram } from './parser'
import type { CompileOptions } from './compile-options'
import { buildAwst } from './awst_build'
import type { Module } from './awst/nodes'
import type { LogEvent } from './logger'
import { logger } from './logger'
import { AwstBuildFailureError } from './errors'
import type ts from 'typescript'
import { registerPTypes } from './awst_build/ptypes/register'
import { typeRegistry } from './awst_build/type-registry'
import { generateTempFile } from './util/generate-temp-file'
import { jsonSerializeAwst } from './awst/json-serialize-awst'
import { jsonSerializeSourceFiles } from './parser/json-serialize-source-files'

export type CompileResult = {
  logs: LogEvent[]
  programDirectory: string
  awst?: Record<string, Module>
  ast?: Record<string, ts.SourceFile>
}

export function compile(options: CompileOptions): CompileResult {
  registerPTypes(typeRegistry)
  // logger.info(undefined, `Compiling source file: ${src}`)
  const programResult = createTsProgram(options)
  const programDirectory = programResult.program.getCurrentDirectory()

  let moduleAwst: Record<string, Module> = {}
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
    const moduleAwstFile = generateTempFile()
    logger.info(undefined, `Writing awst to ${moduleAwstFile.filePath}`)
    moduleAwstFile.writeFileSync(jsonSerializeAwst(moduleAwst), 'utf-8')
    const moduleSourceFile = generateTempFile()
    logger.info(undefined, `Write source to ${moduleSourceFile.filePath}`)
    moduleSourceFile.writeFileSync(jsonSerializeSourceFiles(programResult.sourceFiles), 'utf-8')
  }

  return {
    programDirectory,
    awst: moduleAwst,
    logs: logger.export(),
    ast: programResult.sourceFiles,
  }
}
