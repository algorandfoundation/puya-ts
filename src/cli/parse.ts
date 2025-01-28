import { ArgumentParser } from 'argparse'
import type { BuildCommandArgs } from './build-command'
import { addBuildCommand, buildCommand } from './build-command'

export async function parseCliArguments() {
  const parser = new ArgumentParser({
    prog: 'puya-ts',
  })

  parser.add_argument('--version', {
    action: 'version',
    version: 'puya-ts TODO',
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
    default:
      parser.print_help()
      break
  }
}
type PuyaTsCommand = NoCommandArgs | BuildCommandArgs
interface NoCommandArgs {
  command: 'none'
}
