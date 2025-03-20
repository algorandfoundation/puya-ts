import { Constants } from '../constants'
import { logger } from '../logger'
import { createLockFile } from '../util/lock-file'
import { downloadPuyaBinary, findCachedPuyaBinary, getPuyaStorageDir } from './puya-binary'
import { parseSemVer } from './semver'

export async function resolvePuyaPath(): Promise<string> {
  const version = parseSemVer(Constants.targetedPuyaVersion)

  const puyaStorageDir = getPuyaStorageDir()
  await using _ = await createLockFile(`${puyaStorageDir}.lock`, { maxRetries: 30, delayMs: 1000, staleMs: 60 * 1000 })

  const cachedBinaryPath = findCachedPuyaBinary(puyaStorageDir, version)
  if (cachedBinaryPath) {
    logger.debug(undefined, `Found cached Puya binary at ${cachedBinaryPath}`)
    return cachedBinaryPath
  }

  return await downloadPuyaBinary(puyaStorageDir, version)
}
