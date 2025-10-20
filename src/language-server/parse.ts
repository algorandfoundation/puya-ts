import { ArgumentParser } from 'argparse'
import { appVersion } from '../cli/app-version'
import { checkNodeVersion } from '../cli/check-node-version'
import { startLanguageServer } from './language-server'

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
  const [result, _] = parser.parse_known_args() as [PuyaTsCommand, unknown]

  switch (result.command) {
    case 'version':
      /* eslint-disable-next-line no-console */
      console.log(appVersion({ name: prog }))
      break
    default:
      await startLanguageServer()
      break
  }
}

type PuyaTsCommand = NoCommandArgs | VersionCommand
interface NoCommandArgs {
  command: 'none'
}
interface VersionCommand {
  command: 'version'
}
