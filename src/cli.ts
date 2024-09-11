import { compile } from './index'
import { Command, Option } from 'commander'
import { buildCompileOptions } from './compile-options'
import { logger, LogLevel } from './logger'
import { z } from 'zod'
import type { PuyaPassThroughOptions } from './puya/options'
import { defaultPuyaOptions } from './puya/options'
import { LocalsCoalescingStrategy } from './puya/options'

const cliOptionsSchema = z.object({
  outputAwst: z.boolean(),
  outputAwstJson: z.boolean(),
  outDir: z.string(),
  dryRun: z.boolean(),
  logLevel: z.nativeEnum(LogLevel),

  // Puya options
  outputTeal: z.boolean(),
  outputArc32: z.boolean(),
  outputSsaIr: z.boolean(),
  outputOptimizationIr: z.boolean(),
  outputDestructuredIr: z.boolean(),
  outputMemoryIr: z.boolean(),
  outputBytecode: z.boolean(),
  matchAlgodBytecode: z.boolean(),
  debugLevel: z.number().int(),
  optimizationLevel: z.number().int(),
  targetAvmVersion: z.number().int(),
  cliTemplateDefinitions: z.preprocess((x) => x ?? [], z.array(z.string())),
  templateVarsPrefix: z.string(),
  localsCoalescingStrategy: z.nativeEnum(LocalsCoalescingStrategy),
})

const cliArgumentsSchema = z.array(z.string())

function cli() {
  const commander = new Command().name('puya-ts').description('Algo-TS to Algorand smart contract compiler')

  commander
    .command('build')
    .argument('<paths...>', 'The path, or paths to search for compatible .algo.ts files')
    .addOption(
      new Option('--log-level [level]', 'The minimum log level to output')
        .choices([LogLevel.Debug, LogLevel.Info, LogLevel.Warn, LogLevel.Error, LogLevel.Critical])
        .default(LogLevel.Info),
    )
    .addOption(new Option('--output-awst', 'Output debugging awst file per parsed file').default(false))
    .addOption(new Option('--output-awst-json', 'Output debugging awst json file per parsed file').default(false))
    .addOption(new Option('--out-dir [outDir]').default('out'))
    .addOption(new Option('--dry-run').default(false))

    .addOption(new Option('--output-teal', 'Output TEAL code').default(defaultPuyaOptions.outputTeal))
    .addOption(new Option('--output-arc32', 'Output {contract}.arc32.json ARC-32 app spec file').default(defaultPuyaOptions.outputArc32))
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
      try {
        const paths = cliArgumentsSchema.parse(a)
        const cliOptions = cliOptionsSchema.parse(o)
        logger.configure({
          minLogLevel: cliOptions.logLevel,
        })

        const compileOptions = buildCompileOptions({
          paths,
          ...cliOptions,
        })
        const passThroughOptions: PuyaPassThroughOptions = cliOptions
        const result = compile(compileOptions, passThroughOptions)
        if (result.logs.some((l) => l.level === LogLevel.Error || l.level === LogLevel.Critical)) {
          process.exit(-1)
        }
      } catch (e) {
        if (e instanceof Error) {
          logger.error(e)
        } else {
          throw e
        }
      }
    })

  commander.parse(process.argv)
}

cli()
