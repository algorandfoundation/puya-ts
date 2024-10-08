import type ts from 'typescript'
import type { CompilationSet } from './awst/models'
import type { AWST } from './awst/nodes'
import { buildAwst } from './awst_build'
import { registerPTypes } from './awst_build/ptypes/register'
import { typeRegistry } from './awst_build/type-registry'
import type { CompileOptions } from './compile-options'
import { AwstBuildFailureError } from './errors'
import type { LogEvent } from './logger'
import { logger } from './logger'
import { createTsProgram } from './parser'
import { invokePuya } from './puya'
import type { PuyaPassThroughOptions } from './puya/options'
import {
  base32ToUint8Array,
  base64ToUint8Array,
  bigIntToUint8Array,
  hexToUint8Array,
  uint8ArrayToBase32,
  uint8ArrayToBase64,
  uint8ArrayToBigInt,
  uint8ArrayToHex,
  uint8ArrayToUtf8,
  utf8ToUint8Array,
} from './util'

export { SourceLocation } from './awst/source-location'
export { anyPType, ContractClassPType, FunctionPType, PType } from './awst_build/ptypes'
export { registerPTypes } from './awst_build/ptypes/register'
export { typeRegistry } from './awst_build/type-registry'
export { TypeResolver } from './awst_build/type-resolver'

export const encodingUtil = {
  utf8ToUint8Array,
  bigIntToUint8Array,
  hexToUint8Array,
  base32ToUint8Array,
  base64ToUint8Array,

  uint8ArrayToUtf8,
  uint8ArrayToHex,
  uint8ArrayToBase32,
  uint8ArrayToBase64,
  uint8ArrayToBigInt,
}

export type CompileResult = {
  logs: LogEvent[]
  programDirectory: string
  awst?: AWST[]
  ast?: Record<string, ts.SourceFile>
  compilationSet: CompilationSet
}

export function compile(options: CompileOptions, passThroughOptions: PuyaPassThroughOptions): CompileResult {
  registerPTypes(typeRegistry)
  const programResult = createTsProgram(options)
  const programDirectory = programResult.program.getCurrentDirectory()
  let moduleAwst: AWST[] = []
  let compilationSet: CompilationSet = []
  try {
    ;[moduleAwst, compilationSet] = buildAwst(programResult, options)
  } catch (e) {
    if (e instanceof AwstBuildFailureError) {
      return {
        programDirectory,
        logs: logger.export(),
        ast: programResult.sourceFiles,
        compilationSet,
      }
    }
    throw e
  }
  if (!options.dryRun) {
    invokePuya({
      passThroughOptions,
      compileOptions: options,
      moduleAwst,
      programDirectory,
      compilationSet,
      sourceFiles: programResult.sourceFiles,
    })
  }

  return {
    programDirectory,
    awst: moduleAwst,
    logs: logger.export(),
    ast: programResult.sourceFiles,
    compilationSet,
  }
}
