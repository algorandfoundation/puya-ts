import { AwstSerializer, SnakeCaseSerializer } from '../awst/json-serialize-awst'
import type { AWST } from '../awst/nodes'
import type { CompilationSet } from '../awst_build/models/contract-class-model'
import { logger, LogLevel } from '../logger'
import type { CompileOptions } from '../options'
import type { SourceFileMapping } from '../parser'
import { jsonSerializeSourceFiles } from '../parser/json-serialize-source-files'
import { generateTempFile } from '../util/generate-temp-file'
import { buildCompilationSetMapping } from './build-compilation-set-mapping'
import { deserializeAndLog } from './log-deserializer'
import { resolvePuyaCommand } from './resolve-puya-command'
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
  const { command, useShell } = await resolvePuyaCommand({
    skipVersionCheck: options.skipVersionCheck,
  })

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

  logger.debug(
    undefined,
    `Invoking puya: ${command} --options ${optionsFile.filePath} --awst ${moduleAwstFile.filePath} --source-annotations ${moduleSourceFile.filePath}`,
  )
  await runPuya({
    command,
    args: [
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
    ],
    cwd: programDirectory,
    onOutput: deserializeAndLog,
    shell: useShell,
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
