import { compile } from './index'
import { Command, Option } from 'commander'
import { buildOptions } from './compile-options'
import { logger } from './logger'
import { PuyaError } from './errors'

function cli() {
  const commander = new Command().name('puya-ts').description('Algo-TS to Algorand smart contract compiler')

  commander
    .command('build')
    .argument('<paths...>', 'The path, or paths to search for compatible .algo.ts files')
    .addOption(new Option('--output-awst', 'Output debugging awst file per parsed file').default(true))
    .addOption(new Option('--out-dir [outDir]').default('out'))
    .action((paths, { outputAwst, outDir }) => {
      try {
        const options = buildOptions({ paths, outputAwst, outDir })
        compile(options)
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
