import type { ArgumentParser } from 'argparse'
import { BooleanOptionalAction } from 'argparse'
import { compile } from '../compile'
import { processInputPaths } from '../input-paths/process-input-paths'
import { logger, LoggingContext, LogLevel } from '../logger'
import { ConsoleLogSink } from '../logger/sinks/console-log-sink'
import { CompileOptions, defaultPuyaOptions, LocalsCoalescingStrategy } from '../options'

import { parseCliTemplateVar } from '../util/template-var-cli-parser'
import { addEnumArg, convertInt } from './util'

export interface BuildCommandArgs {
  command: 'build'
  log_level: LogLevel
  output_awst: boolean
  output_awst_json: boolean
  dry_run: boolean
  skip_version_check: boolean
  output_teal: boolean
  output_source_map: boolean
  output_arc32: boolean
  output_arc56: boolean
  output_ssa_ir: boolean
  output_optimization_ir: boolean
  output_destructured_ir: boolean
  output_memory_ir: boolean
  output_bytecode: boolean
  out_dir: string
  debug_level: string
  optimization_level: string
  target_avm_version: string
  cli_template_definitions: string[]
  template_vars_prefix: string
  locals_coalescing_strategy: LocalsCoalescingStrategy
  paths: string[]
  resource_encoding: 'foreign_index' | 'value'
  puya_path: string
}

export function addBuildCommand(parser: ArgumentParser) {
  addEnumArg(parser, {
    name: '--log-level',
    default: LogLevel.Info,
    enumType: LogLevel,
    help: 'The minimum log level to output',
  })

  parser.add_argument('--output-awst', {
    help: 'Output debugging awst file per parsed file',
    default: false,
    action: BooleanOptionalAction,
  })

  parser.add_argument('--output-awst-json', {
    action: BooleanOptionalAction,
    default: false,
    help: 'Output debugging awst json file per parsed file',
  })

  parser.add_argument('--dry-run', {
    action: BooleanOptionalAction,
    default: false,
    help: "Just parse typescript files, don't invoke puya compiler",
  })
  parser.add_argument('--skip-version-check', {
    action: BooleanOptionalAction,
    default: false,
    help: "Don't verify installed puya compiler version matches targeted version",
  })
  parser.add_argument('--output-teal', {
    action: BooleanOptionalAction,
    help: 'Output TEAL code',
    default: defaultPuyaOptions.outputTeal,
  })
  parser.add_argument('--output-source-map', {
    action: BooleanOptionalAction,
    help: 'Output debug source maps ',
    default: defaultPuyaOptions.outputSourceMap,
  })
  parser.add_argument('--output-arc32', {
    action: BooleanOptionalAction,
    help: 'Output {contract}.arc32.json ARC-32 app spec file. Only applicable to ARC4 contracts ',
    default: defaultPuyaOptions.outputArc32,
  })
  parser.add_argument('--output-arc56', {
    action: BooleanOptionalAction,
    help: 'Output {contract}.arc56.json ARC-56 app spec file. Only applicable to ARC4 contracts ',
    default: defaultPuyaOptions.outputArc56,
  })
  parser.add_argument('--output-ssa-ir', {
    action: BooleanOptionalAction,
    help: 'Output IR (in SSA form) before optimisations',
    default: defaultPuyaOptions.outputSsaIr,
  })
  parser.add_argument('--output-optimization-ir', {
    action: BooleanOptionalAction,
    help: 'Output IR after each optimization',
    default: defaultPuyaOptions.outputOptimizationIr,
  })
  parser.add_argument('--output-destructured-ir', {
    action: BooleanOptionalAction,
    help: 'Output IR after SSA destructuring and before MIR',
    default: defaultPuyaOptions.outputDestructuredIr,
  })
  parser.add_argument('--output-memory-ir', {
    action: BooleanOptionalAction,
    help: 'Output MIR before lowering to TealOps',
    default: defaultPuyaOptions.outputMemoryIr,
  })
  parser.add_argument('--output-bytecode', {
    action: BooleanOptionalAction,
    help: 'Output AVM bytecode',
    default: defaultPuyaOptions.outputBytecode,
  })

  parser.add_argument('--out-dir', {
    action: 'store',
    help: 'Where to output builder artifacts. Can use [name] placeholder to include contract name in path',
    default: 'out',
  })

  parser.add_argument('--debug-level', {
    default: defaultPuyaOptions.debugLevel.toString(),
    choices: ['0', '1', '2'],
    help: 'Output debug information level, 0 = none, 1 = debug, 2 = reserved for future use',
  })
  parser.add_argument('--optimization-level', {
    default: defaultPuyaOptions.optimizationLevel.toString(),
    choices: ['0', '1', '2'],
    help: 'Set optimization level of output TEAL / AVM bytecode, 0 = none, 1 = normal, 2 = intensive',
  })
  parser.add_argument('--target-avm-version', {
    default: defaultPuyaOptions.targetAvmVersion.toString(),
    choices: ['10', '11'],
    help: 'Select the targeted AVM version for compilation output',
  })

  parser.add_argument('--cli-template-definitions', {
    metavar: 'VAR=VALUE',
    nargs: '+',
    help: 'Define template vars for use when assembling via --output-bytecode, should be specified without the prefix (see --template-vars-prefix)',
  })

  parser.add_argument('--template-vars-prefix', {
    help: 'Define the prefix to use with --template-var',
    default: defaultPuyaOptions.templateVarsPrefix,
  })

  addEnumArg(parser, {
    name: '--locals-coalescing-strategy',
    enumType: LocalsCoalescingStrategy,
    help: 'Strategy choice for out-of-ssa local variable coalescing. The best choice for your app is best determined through experimentation',
    default: defaultPuyaOptions.localsCoalescingStrategy,
  })

  parser.add_argument('paths', {
    metavar: 'PATHS',
    nargs: '*',
    help: 'The path, or paths to search for compatible .algo.ts files',
    default: ['.'],
  })

  parser.add_argument('--puya-path', {
    help: 'The path to Puya. If not provided, puya-ts will automatically download the appropriate binary for your system',
  })
}

export async function buildCommand(args: BuildCommandArgs) {
  const logCtx = LoggingContext.create()
  return logCtx.run(async () => {
    logger.configure([new ConsoleLogSink(args.log_level)])
    try {
      const filePaths = processInputPaths({ paths: args.paths, outDir: args.out_dir })

      await compile(
        new CompileOptions({
          filePaths,
          outputAwst: args.output_awst,
          outputAwstJson: args.output_awst_json,

          skipVersionCheck: args.skip_version_check,
          dryRun: args.dry_run,
          logLevel: args.log_level,

          outputTeal: args.output_teal,
          outputArc32: args.output_arc32,
          outputArc56: args.output_arc56,
          outputSsaIr: args.output_ssa_ir,
          outputOptimizationIr: args.output_optimization_ir,
          outputDestructuredIr: args.output_destructured_ir,
          outputMemoryIr: args.output_memory_ir,
          outputBytecode: args.output_bytecode,
          outputSourceMap: args.output_source_map,
          debugLevel: convertInt(args.debug_level),
          optimizationLevel: convertInt(args.optimization_level),
          targetAvmVersion: convertInt(args.target_avm_version),
          cliTemplateDefinitions: Object.fromEntries(args.cli_template_definitions?.map(parseCliTemplateVar) ?? []),
          templateVarsPrefix: args.template_vars_prefix,
          localsCoalescingStrategy: args.locals_coalescing_strategy,

          customPuyaPath: args.puya_path,
        }),
      )
      logCtx.exitIfErrors()
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e)
      } else {
        throw e
      }
    }
  })
}
