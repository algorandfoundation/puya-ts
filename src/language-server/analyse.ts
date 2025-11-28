import { validateAwst } from '../awst/validation'
import { buildAwst } from '../awst_build'
import { registerPTypes } from '../awst_build/ptypes/register'
import { typeRegistry } from '../awst_build/type-registry'
import { LoggingContext } from '../logger'
import { CompileOptions } from '../options'
import { createTsProgram } from '../parser'
import type { DependencyGraph } from '../parser/dependency-graph'
import { buildDependencyGraph } from '../parser/dependency-graph'
import { deserializeAndLog } from '../puya/log-deserializer'
import type { PuyaService } from '../puya/puya-service'
import { relinquishThread } from '../util/sleep'

export async function analyse({
  abortSignal,
  puyaService,
  ...options
}: Pick<CompileOptions, 'filePaths' | 'sourceFileProvider'> & {
  abortSignal?: AbortSignal
  puyaService: PuyaService
}): Promise<{ graph?: DependencyGraph; outcome: 'invalid-typescript' | 'invalid-puya-ts' | 'invalid-puya' | 'valid' }> {
  const loggerCtx = LoggingContext.current
  registerPTypes(typeRegistry)
  const compileOptions = new CompileOptions(options)
  const programResult = createTsProgram(compileOptions)
  await relinquishThread()
  if (abortSignal?.aborted) {
    throw 'aborted'
  }
  if (loggerCtx.hasErrors()) {
    return { outcome: 'invalid-typescript' }
  }
  const graph = buildDependencyGraph(programResult.program)
  const { moduleAwst } = buildAwst(programResult, compileOptions)
  validateAwst(moduleAwst)
  await relinquishThread()

  if (abortSignal?.aborted) {
    throw 'aborted'
  }
  if (loggerCtx.hasErrors()) {
    return { graph, outcome: 'invalid-puya-ts' }
  }

  const response = await puyaService.analyse(programResult.programDirectory, moduleAwst)
  for (const log of response.logs) {
    deserializeAndLog(log)
  }
  return { graph, outcome: loggerCtx.hasErrors() ? 'invalid-puya' : 'valid' }
}
