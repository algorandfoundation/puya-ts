import * as fs from 'fs'
import * as path from 'path'
import { Constants } from '../constants'
import { logger } from '../logger'
import { checkSpecificBinaryVersion } from './check-puya-version'
import { downloadPuyaBinary } from './download-puya'
import { getPuyaEnv } from './puya-env'

/**
 * Finds the path to the node_modules directory
 * @returns The absolute path to the node_modules directory
 */
function findNodeModulesDir(): string {
  // Start with the current working directory
  let currentDir = process.cwd()

  // Keep going up directories until we find node_modules or hit the root
  while (currentDir !== path.parse(currentDir).root) {
    const potentialNodeModulesDir = path.join(currentDir, 'node_modules')
    if (fs.existsSync(potentialNodeModulesDir)) {
      return potentialNodeModulesDir
    }
    currentDir = path.dirname(currentDir)
  }

  // If we couldn't find it, default to the current directory
  return process.cwd()
}

/**
 * Gets the platform-specific binary name
 * @returns The appropriate binary name for the current platform
 */
function getBinaryName(): string {
  return process.platform === 'win32' ? 'puya.exe' : 'puya'
}

/**
 * Finds the path to a cached Puya binary if it exists
 * @returns The path to the cached binary or undefined if not found
 */
function findCachedPuyaBinary(): string | undefined {
  const nodeModulesDir = findNodeModulesDir()
  const puyaStorageDir = path.join(nodeModulesDir, '.puya-ts')
  const binaryFileName = getBinaryName()
  const binaryPath = path.join(puyaStorageDir, binaryFileName)

  return fs.existsSync(binaryPath) ? binaryPath : undefined
}

/**
 * Deletes the cached Puya binary if it exists
 */
function deleteCachedPuyaBinary(): void {
  const cachedPath = findCachedPuyaBinary()
  if (cachedPath && fs.existsSync(cachedPath)) {
    try {
      logger.info(undefined, `Removing outdated Puya binary at ${cachedPath}`)
      fs.unlinkSync(cachedPath)
    } catch (error) {
      logger.warn(undefined, `Failed to delete outdated Puya binary: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}

/**
 * Resolves the path to the Puya binary, downloading if necessary
 * @param skipVersionCheck Whether to skip version checking
 * @returns Promise that resolves to the path of the Puya binary to use
 */
export async function resolvePuyaBinary(skipVersionCheck = false): Promise<{ binaryPath: string; useShell: boolean }> {
  const puyaEnv = getPuyaEnv()

  // Check for user-specified binary path
  if (puyaEnv.binaryPath) {
    logger.info(undefined, `Using user-specified Puya binary: ${puyaEnv.binaryPath}`)

    // Check version compatibility if not skipping
    if (!skipVersionCheck) {
      await checkSpecificBinaryVersion(puyaEnv.binaryPath, false)
    }

    return { binaryPath: puyaEnv.binaryPath, useShell: false }
  }

  // Check for user-specified script path
  if (puyaEnv.scriptPath) {
    logger.info(undefined, `Using user-specified Puya script: ${puyaEnv.scriptPath}`)

    // Check version compatibility if not skipping
    if (!skipVersionCheck) {
      await checkSpecificBinaryVersion(puyaEnv.scriptPath, true)
    }

    // Always use shell mode for user-specified Puya scripts
    return { binaryPath: puyaEnv.scriptPath, useShell: true }
  }

  // Look for cached binary
  const cachedBinaryPath = findCachedPuyaBinary()
  if (cachedBinaryPath) {
    logger.debug(undefined, `Found cached Puya binary at ${cachedBinaryPath}`)

    // Check if the cached binary version matches (if not skipping)
    if (!skipVersionCheck) {
      const versionMatches = await checkSpecificBinaryVersion(cachedBinaryPath, false, true)
      if (versionMatches) {
        logger.info(undefined, `Using cached Puya binary with matching version`)
        return { binaryPath: cachedBinaryPath, useShell: false }
      }

      // If version doesn't match, delete the cached binary
      logger.info(undefined, `Version mismatch with cached Puya binary, will download required version`)
      deleteCachedPuyaBinary()
    } else {
      // Skip version check, use the cached binary
      logger.info(undefined, `Using cached Puya binary (version check skipped)`)
      return { binaryPath: cachedBinaryPath, useShell: false }
    }
  }

  // Download the required version
  logger.info(undefined, `Downloading Puya binary version ${Constants.targetedPuyaVersion}`)
  const downloadedPath = await downloadPuyaBinary(Constants.targetedPuyaVersion)
  return { binaryPath: downloadedPath, useShell: false }
}
