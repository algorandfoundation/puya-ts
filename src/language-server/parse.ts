import { ArgumentParser, BooleanOptionalAction } from 'argparse'
import { appVersion } from '../cli/app-version'
import { checkNodeVersion } from '../cli/check-node-version'
import type { LanguageServerOptions } from './puya-language-server'
import { startLanguageServer } from './puya-language-server'

export async function parseCliArguments() {
  checkNodeVersion()
  const prog = 'puyats-ls'
  const parser = new ArgumentParser({
    prog,
  })

  parser.add_argument('--version', {
    action: 'store_const',
    help: 'Show application version',
    const: 'version',
    dest: 'command',
  })
  parser.add_argument('--debug-mode', {
    help: 'Start the language server in debug mode. Server will listen on the debug port (default 4001) for connections.',
    default: false,
    dest: 'debugMode',
    action: BooleanOptionalAction,
  })
  const [result, _] = parser.parse_known_args() as [PuyaTsCommand, unknown]

  switch (result.command) {
    case 'version':
      /* eslint-disable-next-line no-console */
      console.log(appVersion(prog))
      break
    default: {
      const options: LanguageServerOptions = {
        port: result.debugMode ? (parsePort(process.env.PUYA_TS_DEBUG_LSP_PORT) ?? 4001) : undefined,
      }

      await startLanguageServer(options)
      break
    }
  }
}

type PuyaTsCommand = NoCommandArgs | VersionCommand
interface NoCommandArgs {
  command: 'none'
  debugMode: boolean
}
interface VersionCommand {
  command: 'version'
}

function parsePort(value: string | undefined) {
  if (value === undefined) return undefined
  const val = Number(value)
  if (val > 0 && val < 2 ** 16 && Math.floor(val) === val) {
    return val
  }
  throw new Error(`Invalid port number ${value}`)
}
