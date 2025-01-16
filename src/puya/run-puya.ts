import { sync } from 'cross-spawn'
import { logger } from '../logger'

export function runPuya({
  command,
  args,
  cwd,
  onOutput,
}: {
  command: string
  args: string[]
  cwd?: string
  onOutput: (line: string) => void
}) {
  const proc = sync(command, args, {
    // forward all stdin/stdout/stderr to current handlers, with correct interleaving
    stdio: 'pipe',
    cwd,
  })

  let line = ''
  for (const chunk of proc.output) {
    if (chunk === undefined || chunk === null) continue
    const text = chunk.toString('utf-8')
    for (const c of text) {
      switch (c) {
        case '\n':
          onOutput(line)
          line = ''
          break
        case '\r':
          continue
        default:
          line += c
          break
      }
    }
  }
  if (line) onOutput(line)

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
