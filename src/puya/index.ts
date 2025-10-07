import ts from 'typescript'
import type { AWST } from '../awst/nodes'
import type { CompilationSet } from '../awst_build/models/contract-class-model'
import { LogLevel } from '../logger'
import type { CompileOptions } from '../options'
import type { SourceFileMapping } from '../parser'
import type { AbsolutePath } from '../util/absolute-path'
import { buildCompilationSetMapping } from './build-compilation-set-mapping'
import { checkPuyaVersion } from './check-puya-version'
import { deserializeAndLog } from './log-deserializer'
import { getPuyaService } from './puya-service'
import { resolvePuyaPath } from './resolve-puya-path'

export async function puyaCompile({
  moduleAwst,
  programDirectory,
  sourceFiles,
  options,
  compilationSet,
}: {
  moduleAwst: AWST[]
  programDirectory: AbsolutePath
  sourceFiles: SourceFileMapping
  options: CompileOptions
  compilationSet: CompilationSet
}) {
  if (options.customPuyaPath && !options.skipVersionCheck) {
    await checkPuyaVersion(options.customPuyaPath)
  }

  const puyaPath = options.customPuyaPath ?? (await resolvePuyaPath())
  const puyaService = getPuyaService(puyaPath)
  const puyaOptions = options.buildPuyaOptions(
    buildCompilationSetMapping({
      awst: moduleAwst,
      inputPaths: options.filePaths,
      compilationSet,
    }),
  )

  const response = await puyaService.compile({
    awst: moduleAwst,
    options: puyaOptions,
    base_path: programDirectory.toString(),
    log_level: getPuyaLogLevel(options.logLevel),
    source_annotations: getSourceFileContents(sourceFiles),
  })
  // TODO: approval tests could be sped up by caching puyaService and only shutting down once tests are complete
  await puyaService.shutdown()
  for (const log of response.logs) {
    deserializeAndLog(log)
  }
}

function getPuyaLogLevel(logLevel: LogLevel): string {
  switch (logLevel) {
    case LogLevel.Debug:
      return 'debug'
    case LogLevel.Info:
      return 'info'
    case LogLevel.Warning:
      return 'warning'
    case LogLevel.Error:
      return 'error'
    case LogLevel.Critical:
      return 'critical'
  }
}
function getSourceFileContents(sourceFiles: SourceFileMapping) {
  return Object.fromEntries(
    Object.entries(sourceFiles).map(([key, value]) => {
      const source = ts.isSourceFile(value) ? value.getFullText().replace(/\r\n/g, '\n').split(/\n/g) : value
      return [key, source] as const
    }),
  )
}
