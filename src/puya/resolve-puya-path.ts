import { Constants } from '../constants'
import { logger } from '../logger'
import { downloadPuyaBinary, findCachedPuyaBinary } from './puya-binary'
import { parseSemVer } from './semver'

export async function resolvePuyaPath(): Promise<string> {
  const version = parseSemVer(Constants.targetedPuyaVersion)

  const cachedBinaryPath = findCachedPuyaBinary(version)
  if (cachedBinaryPath) {
    logger.debug(undefined, `Found cached Puya binary at ${cachedBinaryPath}`)
    return cachedBinaryPath
  }

  const downloadedPath = await downloadPuyaBinary(version)
  return downloadedPath
}
