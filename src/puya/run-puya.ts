import { logger } from '../logger'
import { invokeCli } from '../util/invoke-cli'

export async function runPuya({
  command,
  args,
  cwd,
  onOutput,
  shell = false,
}: {
  command: string
  args: string[]
  cwd?: string
  onOutput: (line: string) => void
  shell?: boolean
}) {
  const result = await invokeCli({
    command,
    args,
    cwd,
    onReceiveLine: onOutput,
    dontThrowOnNonzeroCode: true,
    shell,
  })

  if (result.code !== 0) {
    logger.critical(undefined, `Compilation exited with status ${result.code}`)
  }
}
