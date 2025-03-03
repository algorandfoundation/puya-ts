import { Constants } from '../constants'
import { logger } from '../logger'
import { checkPuyaVersion } from './check-puya-version'
import { deleteCachedPuyaBinary, downloadPuyaBinary, findCachedPuyaBinary } from './puya-binary'
import { getPuyaEnv } from './puya-env'

/**
 * Resolves the path to the Puya binary, downloading if necessary
 * @param skipVersionCheck Whether to skip version checking
 * @returns Promise that resolves to the path of the Puya binary to use
 */
export async function resolvePuyaCommand(skipVersionCheck = false): Promise<{ command: string; useShell: boolean }> {
  const puyaEnv = getPuyaEnv()

  // Check for user-specified binary path
  if (puyaEnv.command) {
    logger.info(undefined, `Using user-specified Puya binary: ${puyaEnv.command}`)

    // Check version compatibility if not skipping
    if (!skipVersionCheck) {
      await checkPuyaVersion(puyaEnv.command, false)
    }

    return { command: puyaEnv.command, useShell: false }
  }

  // Check for user-specified script path
  if (puyaEnv.scriptPath) {
    logger.info(undefined, `Using user-specified Puya script: ${puyaEnv.scriptPath}`)

    // Check version compatibility if not skipping
    if (!skipVersionCheck) {
      await checkPuyaVersion(puyaEnv.scriptPath, true)
    }

    // Always use shell mode for user-specified Puya scripts
    return { command: puyaEnv.scriptPath, useShell: true }
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
