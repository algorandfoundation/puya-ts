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
  const result: PuyaTsCommand = parser.parse_args(getArgs())
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

/**
 * Return the args passed to the cli. This is argv minus the preamble of the interpreter and entry file.
 *
 * Injects a default command of `build` if none is present. If a new command is added, it will need to be injected below
 */
function getArgs() {
  // Get args minus the interpreter (ie. node.exe) and entry file (ie. cli.ts)
  const args = process.argv.slice(2)
  const [maybeCmd, ...rest] = args

  switch (maybeCmd) {
    case 'build':
    case '--version':
    case '--help':
    case '-h':
      break
    default:
      // Default to a build command
      if (maybeCmd !== undefined) {
        return ['build', maybeCmd, ...rest]
      }
  }
  return args
}

type PuyaTsCommand = NoCommandArgs | BuildCommandArgs | VersionCommand
interface NoCommandArgs {
  command: 'none'
}
interface VersionCommand {
  command: 'version'
}
