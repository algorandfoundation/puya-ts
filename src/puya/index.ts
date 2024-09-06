import type { AWST } from '../awst/nodes'
import { jsonSerializeSourceFiles } from '../parser/json-serialize-source-files'
import { logger, LogLevel } from '../logger'
import { generateTempFile } from '../util/generate-temp-file'
import { AwstSerializer, SnakeCaseSerializer } from '../awst/json-serialize-awst'
import type { SourceFileMapping } from '../parser'
import { PuyaOptions } from './options'
import type { CompileOptions } from '../compile-options'
import { buildCompilationSet } from './build-compilation-set'
import { runChildProc } from './run-child-proc'

export function invokePuya({
  moduleAwst,
  programDirectory,
  sourceFiles,
  options,
}: {
  moduleAwst: AWST[]
  programDirectory: string
  sourceFiles: SourceFileMapping
  options: CompileOptions
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
    compileOptions: options,
    compilationSet: buildCompilationSet({
      awst: moduleAwst,
      inputPaths: options.filePaths,
      outDir: options.outDir,
      programDirectory,
    }),
  })
  using optionsFile = generateTempFile()
  logger.debug(undefined, `Write options to ${optionsFile.filePath}`)
  optionsFile.writeFileSync(new SnakeCaseSerializer().serialize(puyaOptions))

  runChildProc({
    command: 'poetry.exe',
    args: [
      'run',
      'puya',
      '--options',
      optionsFile.filePath,
      `--awst`,
      moduleAwstFile.filePath,
      `--source-annotations`,
      moduleSourceFile.filePath,
      '--log-level',
      getPuyaLogLevel(options.logLevel),
    ],
    cwd: 'c:\\source\\algorand\\puya\\',
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
