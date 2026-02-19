import type { Arc56Contract } from '@algorandfoundation/algokit-utils/abi'
import { arc32ToArc56 } from '@algorandfoundation/algokit-utils/app-spec'
import { ArgumentParser } from 'argparse'
import { readFile } from 'fs/promises'
import { writeARC4Client } from './arc4_clientgen'
import { appVersion } from './cli/app-version'
import { checkNodeVersion } from './cli/check-node-version'
import { addEnumArg } from './cli/util'
import { PuyaError } from './errors'
import { logger, LoggingContext, LogLevel } from './logger'
import { ConsoleLogSink } from './logger/sinks/console-log-sink'
import { AbsolutePath } from './util/absolute-path'
import './util/polyfills'

interface ClientgenCommandArgs {
  command: 'clientgen'
  specs: string[]
  out_dir: string
  log_level: LogLevel
}

interface VersionCommand {
  command: 'version'
}

type PuyaTsClientgenCommand = ClientgenCommandArgs | VersionCommand

async function parseCliArguments() {
  checkNodeVersion()
  const parser = new ArgumentParser({
    prog: 'puya-ts-clientgen',
  })

  addEnumArg(parser, {
    name: '--log-level',
    default: LogLevel.Info,
    enumType: LogLevel,
    help: 'The minimum log level to output',
  })
  parser.add_argument('--version', {
    action: 'store_const',
    help: 'Show application version',
    const: 'version',
    dest: 'command',
  })
  parser.add_argument('specs', {
    metavar: 'SPECS',
    nargs: '+',
    help: 'The path, or paths to the .arc32.json or .arc56.json files',
  })
  parser.add_argument('--out-dir', {
    action: 'store',
    help: 'Where to output clientgen artifacts',
    default: 'out',
  })
  parser.set_defaults({
    command: 'clientgen',
  })
  const result: PuyaTsClientgenCommand = parser.parse_args()
  switch (result.command) {
    case 'clientgen':
      await outputStubs(result.specs, result.out_dir, result.log_level)
      break
    case 'version':
      /* eslint-disable-next-line no-console */
      console.log(appVersion())
      break
    default:
      parser.print_help()
      break
  }
}

async function outputStubs(paths: string[], outDir: string, logLevel: LogLevel) {
  const logCtx = LoggingContext.create()
  return logCtx.run(async () => {
    logger.configure([new ConsoleLogSink(logLevel, AbsolutePath.resolve({ path: '' }))])
    for (const appSpecPath of paths) {
      try {
        const appSpecJSON = JSON.parse(await readFile(appSpecPath, { encoding: 'utf-8' }))
        let appSpec: Arc56Contract
        if (appSpecPath.endsWith('.arc56.json')) {
          appSpec = appSpecJSON
        } else {
          appSpec = arc32ToArc56(appSpecJSON)
        }
        const sourceFile = AbsolutePath.resolve({ path: appSpecPath })
        const outFile = AbsolutePath.resolve({ path: outDir, workingDirectory: sourceFile.resolve('..') }).join(`${appSpec.name}.client.ts`)
        await writeARC4Client(appSpec, outFile)
      } catch (e) {
        if (e instanceof PuyaError) {
          logger.error(e)
        } else if (e instanceof Error) {
          logger.error(e)
          throw e
        } else {
          throw e
        }
      }
    }
    logCtx.exitIfErrors()
  })
}

parseCliArguments()
