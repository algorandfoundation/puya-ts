import { compile } from './index'
import { Command, Option } from 'commander'
import { buildCompileOptions } from './compile-options'
import { logger, LogLevel } from './logger'
import { z } from 'zod'

const cliOptionsSchema = z.object({
  outputAwst: z.boolean(),
  outputAwstJson: z.boolean(),
  outDir: z.string(),
  dryRun: z.boolean(),
  logLevel: z.preprocess((x) => (x === 'notset' || x === true ? LogLevel.Info : x), z.nativeEnum(LogLevel)),
})

const cliArgumentsSchema = z.array(z.string())

function cli() {
  const commander = new Command().name('puya-ts').description('Algo-TS to Algorand smart contract compiler')

  commander
    .command('build')
    .argument('<paths...>', 'The path, or paths to search for compatible .algo.ts files')
    .addOption(
      new Option('--log-level [level]', 'The minimum log level to output')
        .choices(['notset', LogLevel.Debug, LogLevel.Info, LogLevel.Warn, LogLevel.Error, LogLevel.Critical])
        .default('notset'),
    )
    .addOption(new Option('--output-awst', 'Output debugging awst file per parsed file').default(false))
    .addOption(new Option('--output-awst-json', 'Output debugging awst json file per parsed file').default(false))
    .addOption(new Option('--out-dir [outDir]').default('out'))
    .addOption(new Option('--dry-run').default(false))
    .action((a, o) => {
      try {
        const paths = cliArgumentsSchema.parse(a)
        const options = cliOptionsSchema.parse(o)
        logger.configure({
          minLogLevel: options.logLevel,
        })

        const compileOptions = buildCompileOptions({
          paths,
          ...options,
        })
        const result = compile(compileOptions)
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
