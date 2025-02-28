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
  const puyaScriptPath = process.env.PUYA_SCRIPT_PATH
  // Use the environment variable path if it exists, otherwise download the binary
  const puyaBinaryPath = puyaScriptPath || (await downloadPuyaBinary('1.1.1'))

  const result = await invokeCli({
    command: puyaBinaryPath,
    args,
    cwd,
    onReceiveLine: onOutput,
    dontThrowOnNonzeroCode: true,
    shell: !!puyaScriptPath,
  })

  if (result.code !== 0) {
    logger.critical(undefined, `Compilation exited with status ${result.code}`)
  }
}
