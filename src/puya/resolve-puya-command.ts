import { Constants } from '../constants'
import { logger } from '../logger'
import { checkPuyaVersion } from './check-puya-version'
import { deleteCachedPuyaBinary, downloadPuyaBinary, findCachedPuyaBinary } from './puya-binary'

/**
 * Resolves the path to the Puya binary, downloading if necessary
 * @param skipVersionCheck Whether to skip version checking
 * @returns Promise that resolves to the path of the Puya binary to use
 */
export async function resolvePuyaCommand({
  skipVersionCheck = false,
}: {
  skipVersionCheck?: boolean
} = {}): Promise<{
  command: string
  useShell: boolean
}> {
  // Check for user-specified script path
  const scriptPath = process.env.PUYA_SCRIPT_PATH
  if (scriptPath) {
    logger.info(undefined, `Using user-specified Puya script: ${scriptPath}`)

    // Check version compatibility if not skipping
    if (!skipVersionCheck) {
      await checkPuyaVersion(scriptPath, true)
    }

    // Always use shell mode for user-specified Puya scripts
    return { command: scriptPath, useShell: true }
  }

  // Look for cached binary
  const cachedBinaryPath = findCachedPuyaBinary()
  if (cachedBinaryPath) {
    logger.debug(undefined, `Found cached Puya binary at ${cachedBinaryPath}`)

    // Check if the cached binary version matches (if not skipping)
    if (!skipVersionCheck) {
      const versionMatches = await checkPuyaVersion(cachedBinaryPath, false, true)
      if (versionMatches) {
        logger.info(undefined, `Using cached Puya binary with matching version`)
        return { command: cachedBinaryPath, useShell: false }
      }

      // If version doesn't match, delete the cached binary
      logger.info(undefined, `Version mismatch with cached Puya binary, will download required version`)
      deleteCachedPuyaBinary()
    } else {
      // Skip version check, use the cached binary
      logger.info(undefined, `Using cached Puya binary (version check skipped)`)
      return { command: cachedBinaryPath, useShell: false }
    }
  }

  // Download the required version
  logger.info(undefined, `Downloading Puya binary version ${Constants.targetedPuyaVersion}`)
  const downloadedPath = await downloadPuyaBinary(Constants.targetedPuyaVersion)
  return { command: downloadedPath, useShell: false }
}
