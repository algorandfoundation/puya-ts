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

  if (checkIfCacheExists(cachedBinaryPath)) {
    return cachedBinaryPath
  }

  await using _ = await createLockFile(`${puyaStorageDir}.lock`, { maxRetries: 30, delayMs: 1000, staleMs: 60 * 1000 })

  if (checkIfCacheExists(cachedBinaryPath)) {
    return cachedBinaryPath
  }
  return await downloadPuyaBinary(puyaStorageDir, version)
}

function checkIfCacheExists(cachePath: string): boolean {
  if (fs.existsSync(cachePath)) {
    logger.debug(undefined, `Found cached Puya binary at ${cachePath}`)
    return true
  }
  return false
}
