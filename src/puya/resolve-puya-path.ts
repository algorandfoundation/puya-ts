import * as fs from 'fs'
import { Constants } from '../constants'
import { logger } from '../logger'
import { createLockFile } from '../util/lock-file'
import { downloadPuyaBinary, getCachedPuyaBinaryPath, getPuyaStorageDir } from './puya-binary'
import { parseSemVer } from './semver'

export async function resolvePuyaPath(): Promise<string> {
  const version = parseSemVer(Constants.targetedPuyaVersion)

  const puyaStorageDir = getPuyaStorageDir()
  const cachedBinaryPath = getCachedPuyaBinaryPath(puyaStorageDir, version)

  if (isBinaryCached(cachedBinaryPath)) {
    return cachedBinaryPath
  }

  await using _ = await createLockFile(`${puyaStorageDir}.lock`, { maxRetries: 30, delayMs: 1000, staleMs: 60 * 1000 })

  // Between the first check and acquiring the lock, the binary may have been downloaded by another process.
  // In this case there is no need to download the binary again.
  if (isBinaryCached(cachedBinaryPath)) {
    return cachedBinaryPath
  }
  return await downloadPuyaBinary(puyaStorageDir, version)
}

function isBinaryCached(cachePath: string): boolean {
  if (fs.existsSync(cachePath)) {
    logger.debug(undefined, `Found cached Puya binary at ${cachePath}`)
    return true
  }
  return false
}
