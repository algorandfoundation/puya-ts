import { sync } from 'cross-spawn'

export function runChildProc({ command, args, cwd }: { command: string; args: string[]; cwd?: string }) {
  const proc = sync(command, args, {
    // forward all stdin/stdout/stderr to current handlers, with correct interleaving
    stdio: 'inherit',
    cwd,
  })

  if (proc.error) {
    // only happens during invocation error, not error return status
    throw proc.error
  }
  if (proc.status !== 0) {
    process.exit(proc.status)
  }
}
