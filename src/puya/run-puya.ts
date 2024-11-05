import { sync } from 'cross-spawn'
import { logger } from '../logger'

export function runPuya({ command, args, cwd }: { command: string; args: string[]; cwd?: string }) {
  const proc = sync(command, args, {
    // forward all stdin/stdout/stderr to current handlers, with correct interleaving
    stdio: 'inherit',
    cwd,
  })

  if (proc.error) {
    // only happens during invocation error, not error return status
    if ('code' in proc.error && proc.error.code === 'ENOENT') {
      logger.critical(undefined, `Could not find ${command}. Please ensure it is installed and available on your PATH`)
    } else {
      throw proc.error
    }
  }
  if (proc.status !== 0) {
    logger.critical(undefined, `Compilation exited with status ${proc.status}`)
  }
}
