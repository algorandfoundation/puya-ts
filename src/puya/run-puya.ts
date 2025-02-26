import { logger } from '../logger'
import { invokeCli } from '../util/invoke-cli'
import { downloadPuyaBinary } from './download-puya'

export async function runPuya({
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
  // Download Puya binary with fixed version 1.1.1
  const puyaBinaryPath = await downloadPuyaBinary('1.1.1')

  // Use the downloaded binary path in invokeCli
  const result = await invokeCli({
    command: puyaBinaryPath,
    args,
    cwd,
    onReceiveLine: onOutput,
    dontThrowOnNonzeroCode: true,
  })

  if (result.code !== 0) {
    logger.critical(undefined, `Compilation exited with status ${result.code}`)
  }
}
