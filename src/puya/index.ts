import { AwstSerializer, SnakeCaseSerializer } from '../awst/json-serialize-awst'
import type { AWST } from '../awst/nodes'
import type { CompilationSet } from '../awst_build/models/contract-class-model'
import { logger, LogLevel } from '../logger'
import type { CompileOptions } from '../options'
import type { SourceFileMapping } from '../parser'
import { jsonSerializeSourceFiles } from '../parser/json-serialize-source-files'
import { generateTempFile } from '../util/generate-temp-file'
import { buildCompilationSetMapping } from './build-compilation-set-mapping'
import { checkPuyaVersion } from './check-puya-version'
import { deserializeAndLog } from './log-deserializer'
import { resolvePuyaPath } from './resolve-puya-path'
import { runPuya } from './run-puya'

export async function invokePuya({
  moduleAwst,
  programDirectory,
  sourceFiles,
  options,
  compilationSet,
}: {
  moduleAwst: AWST[]
  programDirectory: string
  sourceFiles: SourceFileMapping
  options: CompileOptions
  compilationSet: CompilationSet
}) {
  if (options.customPuyaPath && !options.skipVersionCheck) {
    checkPuyaVersion(options.customPuyaPath)
  }

  const puyaPath = options.customPuyaPath ?? (await resolvePuyaPath())

  // Write AWST file
  using moduleAwstFile = generateTempFile()
  logger.debug(undefined, `Writing awst to ${moduleAwstFile.filePath}`)
  const serializer = new AwstSerializer({
    programDirectory: programDirectory,
    sourcePaths: 'absolute',
  })
  moduleAwstFile.writeFileSync(serializer.serialize(moduleAwst), 'utf-8')

  // Write source annotations
  using moduleSourceFile = generateTempFile()
  logger.debug(undefined, `Write source to ${moduleSourceFile.filePath}`)
  moduleSourceFile.writeFileSync(jsonSerializeSourceFiles(sourceFiles, programDirectory), 'utf-8')

  // Write puya options
  const puyaOptions = options.buildPuyaOptions(
    buildCompilationSetMapping({
      awst: moduleAwst,
      inputPaths: options.filePaths,
      compilationSet,
    }),
  )
  using optionsFile = generateTempFile()
  logger.debug(undefined, `Write options to ${optionsFile.filePath}`)
  optionsFile.writeFileSync(new SnakeCaseSerializer().serialize(puyaOptions))
  const puyaArgs = [
    '--options',
    optionsFile.filePath,
    `--awst`,
    moduleAwstFile.filePath,
    `--source-annotations`,
    moduleSourceFile.filePath,
    '--log-level',
    getPuyaLogLevel(options.logLevel),
    '--log-format',
    'json',
  ]
  // Useful to have this in a var to copy/paste when debugging puya
  const puyaArgsStr = puyaArgs.join(' ')
  logger.debug(undefined, `Invoking puya: ${puyaPath} ${puyaArgsStr}`)
  await runPuya({
    command: puyaPath,
    args: puyaArgs,
    cwd: programDirectory,
    onOutput: deserializeAndLog,
  })
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
