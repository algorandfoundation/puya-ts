import { compile } from './index'
import { Command, Option } from 'commander'
import { buildCompileOptions } from './compile-options'
import { logger } from './logger'
import { z } from 'zod'

const cliOptionsSchema = z.object({
  outputAwst: z.boolean(),
  outputAwstJson: z.boolean(),
  outDir: z.string(),
  dryRun: z.boolean(),
})

const cliArgumentsSchema = z.array(z.string())

function cli() {
  const commander = new Command().name('puya-ts').description('Algo-TS to Algorand smart contract compiler')

  commander
    .command('build')
    .argument('<paths...>', 'The path, or paths to search for compatible .algo.ts files')
    .addOption(new Option('--output-awst', 'Output debugging awst file per parsed file').default(false))
    .addOption(new Option('--output-awst-json', 'Output debugging awst json file per parsed file').default(false))
    .addOption(new Option('--out-dir [outDir]').default('out'))
    .addOption(new Option('--dry-run').default(false))
    .action((args, options) => {
      try {
        const paths = cliArgumentsSchema.parse(args)
        const cliOptions = cliOptionsSchema.parse(options)

        const compileOptions = buildCompileOptions({
          paths,
          ...cliOptions,
        })
        const result = compile(compileOptions)
        if (result.logs.some((l) => l.level === 'error' || l.level === 'fatal')) {
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
