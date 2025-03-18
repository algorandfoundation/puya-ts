import * as lockfile from 'proper-lockfile'
import { Constants } from '../constants'
import { logger } from '../logger'
import { downloadPuyaBinary, findCachedPuyaBinary } from './puya-binary'
import { parseSemVer } from './semver'

export async function resolvePuyaPath(): Promise<string> {
  const version = parseSemVer(Constants.targetedPuyaVersion)

  const lockRelease = await lockfile.lock('foo', {
    realpath: false,
    stale: 30000, // Consider the lock stale after 30 seconds
    retries: {
      retries: 5,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 30000,
    },
  })

  try {
    const cachedBinaryPath = findCachedPuyaBinary(version)
    if (cachedBinaryPath) {
      logger.debug(undefined, `Found cached Puya binary at ${cachedBinaryPath}`)
      return cachedBinaryPath
    }

    const downloadedPath = await downloadPuyaBinary(version)
    return downloadedPath
  } finally {
    lockRelease()
  }
}
