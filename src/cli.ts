import { Command, Option } from 'commander'
import { z } from 'zod'
import { buildCompileOptions } from './compile-options'
import { compile } from './index'
import { logger, LoggingContext, LogLevel } from './logger'
import { ConsoleLogSink } from './logger/sinks/console-log-sink'
import type { PuyaPassThroughOptions } from './puya/options'
import { defaultPuyaOptions, LocalsCoalescingStrategy } from './puya/options'

const cmdInteger = () => z.preprocess((x) => (typeof x === 'string' && x.length > 0 ? Number(x) : x), z.number().int())

const cliOptionsSchema = z.object({
  outputAwst: z.boolean(),
  outputAwstJson: z.boolean(),
  outDir: z.string(),
  dryRun: z.boolean(),
  logLevel: z.nativeEnum(LogLevel),
  isolatedFiles: z.boolean(),

  // Puya options
  outputSourceMap: z.boolean(),
  outputTeal: z.boolean(),
  outputArc32: z.boolean(),
  outputArc56: z.boolean(),
  outputSsaIr: z.boolean(),
  outputOptimizationIr: z.boolean(),
  outputDestructuredIr: z.boolean(),
  outputMemoryIr: z.boolean(),
  outputBytecode: z.boolean(),
  matchAlgodBytecode: z.boolean(),
  debugLevel: cmdInteger(),
  optimizationLevel: cmdInteger(),
  targetAvmVersion: cmdInteger(),
  cliTemplateDefinitions: z.preprocess((x) => x ?? [], z.array(z.string())),
  templateVarsPrefix: z.string(),
  localsCoalescingStrategy: z.nativeEnum(LocalsCoalescingStrategy),
})

const cliArgumentsSchema = z.array(z.string())

function cli() {
  const commander = new Command().name('puya-ts').description('Algo-TS to Algorand smart contract compiler')

  commander.helpCommand(true)

  commander
    .command('build')
    .argument('<paths...>', 'The path, or paths to search for compatible .algo.ts files')
    .addOption(
      new Option('--log-level [level]', 'The minimum log level to output')
        .choices([LogLevel.Debug, LogLevel.Info, LogLevel.Warning, LogLevel.Error, LogLevel.Critical])
        .default(LogLevel.Info),
    )
    .addOption(new Option('--output-awst', 'Output debugging awst file per parsed file').default(false))
    .addOption(new Option('--output-awst-json', 'Output debugging awst json file per parsed file').default(false))
    .addOption(new Option('--out-dir [outDir]').default('out'))
    .addOption(new Option('--dry-run', "Just parse typescript files, don't invoke puya compiler").default(false))
    .addOption(new Option('--isolated-files', 'Invoke compilation on each input file individually').default(false))
    .addOption(new Option('--no-output-teal', 'Do not output TEAL code').default(defaultPuyaOptions.outputTeal))
    .addOption(new Option('--output-source-map', 'Output debug source maps ').default(defaultPuyaOptions.outputSourceMap))
    .addOption(
      new Option(
        '--no-output-arc32',
        'Do not output {contract}.arc32.json ARC-32 app spec file. Only applicable to ARC4 contracts',
      ).default(defaultPuyaOptions.outputArc32),
    )
    .addOption(
      new Option('--output-arc56', 'Output {contract}.arc56.json ARC-56 app spec file. Only applicable to ARC4 contracts').default(
        defaultPuyaOptions.outputArc56,
      ),
    )
    .addOption(new Option('--output-ssa-ir', 'Output IR (in SSA form) before optimisations').default(defaultPuyaOptions.outputSsaIr))
    .addOption(new Option('--output-optimization-ir', 'Output IR after each optimization').default(defaultPuyaOptions.outputOptimizationIr))
    .addOption(
      new Option('--output-destructured-ir', 'Output IR after SSA destructuring and before MIR').default(
        defaultPuyaOptions.outputDestructuredIr,
      ),
    )
    .addOption(new Option('--output-memory-ir', 'Output MIR before lowering to TealOps').default(defaultPuyaOptions.outputMemoryIr))
    .addOption(new Option('--output-bytecode', 'Output AVM bytecode').default(defaultPuyaOptions.outputBytecode))
    .addOption(
      new Option('--match-algod-bytecode', 'When outputting bytecode, ensure bytecode matches algod output').default(
        defaultPuyaOptions.matchAlgodBytecode,
      ),
    )
    .addOption(
      new Option('--debug-level [level]', 'Output debug information level, 0 = none, 1 = debug, 2 = reserved for future use')
        .choices(['0', '1', '2'])
        .default(defaultPuyaOptions.debugLevel),
    )
    .addOption(
      new Option('--optimization-level [level]', 'Set optimization level of output TEAL / AVM bytecode')
        .choices(['0', '1', '2'])
        .default(defaultPuyaOptions.optimizationLevel),
    )
    .addOption(new Option('--target-avm-version [version]', '').choices(['10']).default(10))
    .addOption(
      new Option(
        '--cli-template-definitions <...definitions>',
        'Define template vars for use when assembling via --output-bytecode, should be specified without the prefix (see --template-vars-prefix)',
      ),
    )
    .addOption(
      new Option('--template-vars-prefix [prefix]', 'Define the prefix to use with --template-var').default(
        defaultPuyaOptions.templateVarsPrefix,
      ),
    )
    .addOption(
      new Option('--locals-coalescing-strategy', '')
        .default(defaultPuyaOptions.localsCoalescingStrategy)
        .choices([
          LocalsCoalescingStrategy.root_operand,
          LocalsCoalescingStrategy.root_operand_excluding_args,
          LocalsCoalescingStrategy.aggressive,
        ]),
    )

    .action((a, o) => {
      using logCtx = LoggingContext.create()
      logger.configure([new ConsoleLogSink(LogLevel.Warning)])
      try {
        const paths = cliArgumentsSchema.parse(a)
        const cliOptions = cliOptionsSchema.parse(o)
        logger.configure([new ConsoleLogSink(cliOptions.logLevel)])
        const compileOptions = buildCompileOptions({
          paths,
          ...cliOptions,
        })
        const passThroughOptions: PuyaPassThroughOptions = cliOptions

        if (cliOptions.isolatedFiles) {
          let anyHasErrors = false
          for (const file of compileOptions.filePaths) {
            using logCtx = LoggingContext.create()
            try {
              compile(
                {
                  ...compileOptions,
                  filePaths: [file],
                },
                passThroughOptions,
              )
            } catch (e) {
              logger.critical(undefined, `Compilation failure: ${e}`)
            }
            anyHasErrors ||= logCtx.hasErrors()
          }
          if (anyHasErrors) {
            process.exit(-1)
          }
        } else {
          compile(compileOptions, passThroughOptions)
          logCtx.exitIfErrors()
        }
      } catch (e) {
        if (e instanceof Error) {
          logger.error(e)
        } else {
          throw e
        }
      }
    })

  if (process.argv.length < 3) {
    commander.help()
  } else {
    commander.parse(process.argv)
  }
}
cli()
