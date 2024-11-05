import { AwstSerializer, SnakeCaseSerializer } from '../awst/json-serialize-awst'
import type { AWST } from '../awst/nodes'
import type { CompilationSet } from '../awst_build/models/contract-class-model'
import type { CompileOptions } from '../compile-options'
import { logger, LogLevel } from '../logger'
import type { SourceFileMapping } from '../parser'
import { jsonSerializeSourceFiles } from '../parser/json-serialize-source-files'
import { generateTempFile } from '../util/generate-temp-file'
import { buildCompilationSetMapping } from './build-compilation-set-mapping'
import type { PuyaPassThroughOptions } from './options'
import { PuyaOptions } from './options'
import { runPuya } from './run-puya'

export function invokePuya({
  moduleAwst,
  programDirectory,
  sourceFiles,
  compileOptions,
  compilationSet,
  passThroughOptions,
}: {
  moduleAwst: AWST[]
  programDirectory: string
  sourceFiles: SourceFileMapping
  compileOptions: CompileOptions
  compilationSet: CompilationSet
  passThroughOptions: PuyaPassThroughOptions
}) {
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
  const puyaOptions = new PuyaOptions({
    passThroughOptions: passThroughOptions,
    compilationSet: buildCompilationSetMapping({
      awst: moduleAwst,
      inputPaths: compileOptions.filePaths,
      compilationSet,
    }),
  })
  using optionsFile = generateTempFile()
  logger.debug(undefined, `Write options to ${optionsFile.filePath}`)
  optionsFile.writeFileSync(new SnakeCaseSerializer().serialize(puyaOptions))

  logger.debug(
    undefined,
    `Invoking puya: puya --options ${optionsFile.filePath} --awst ${moduleAwstFile.filePath} --source-annotations ${moduleSourceFile.filePath}`,
  )
  runPuya({
    command: 'puya',
    args: [
      '--options',
      optionsFile.filePath,
      `--awst`,
      moduleAwstFile.filePath,
      `--source-annotations`,
      moduleSourceFile.filePath,
      '--log-level',
      getPuyaLogLevel(compileOptions.logLevel),
    ],
    cwd: programDirectory,
  })
}

function getPuyaLogLevel(logLevel: LogLevel): string {
  switch (logLevel) {
    case LogLevel.Debug:
      return 'debug'
    case LogLevel.Info:
      return 'info'
    case LogLevel.Warn:
      return 'warning'
    case LogLevel.Error:
      return 'error'
    case LogLevel.Critical:
      return 'critical'
  }
}
