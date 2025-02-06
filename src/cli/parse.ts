import { ArgumentParser } from 'argparse'
import { appVersion } from './app-version'
import type { BuildCommandArgs } from './build-command'
import { addBuildCommand, buildCommand } from './build-command'

export async function parseCliArguments() {
  const parser = new ArgumentParser({
    prog: 'puya-ts',
  })

  parser.add_argument('--version', {
    action: 'store_const',
    help: 'Show application version',
    const: 'version',
    dest: 'command',
  })
  parser.set_defaults({
    command: 'none',
  })
  addBuildCommand(parser.add_subparsers())
  const result: PuyaTsCommand = parser.parse_args()
  switch (result.command) {
    case 'build':
      await buildCommand(result)
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
type PuyaTsCommand = NoCommandArgs | BuildCommandArgs | VersionCommand
interface NoCommandArgs {
  command: 'none'
}
interface VersionCommand {
  command: 'version'
}
