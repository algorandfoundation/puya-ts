import { createTsProgram } from './parser'
import type { CompileOptions } from './compile-options'
import { buildAwst } from './awst_build'
import type { ModuleStatement } from './awst/nodes'
import type { LogEvent } from './logger'
import { logger } from './logger'
import { AwstBuildFailureError } from './errors'
import type ts from 'typescript'
import { registerPTypes } from './awst_build/ptypes/register'
import { typeRegistry } from './awst_build/type-registry'
import { generateTempFile } from './util/generate-temp-file'
import { jsonSerializeAwst } from './awst/json-serialize-awst'

export type CompileResult = {
  logs: LogEvent[]
  programDirectory: string
  awst?: Record<string, ModuleStatement[]>
  ast?: Record<string, ts.SourceFile>
}

export function compile(options: CompileOptions): CompileResult {
  registerPTypes(typeRegistry)
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

  const moduleAwstFile = generateTempFile()
  logger.info(undefined, `Writing awst to ${moduleAwstFile.filePath}`)
  moduleAwstFile.writeFileSync(jsonSerializeAwst(moduleAwst), 'utf-8')

  return {
    programDirectory,
    awst: moduleAwst,
    logs: logger.export(),
    ast: programResult.sourceFiles,
  }
}
