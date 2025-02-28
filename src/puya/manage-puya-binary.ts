import * as fs from 'fs'
import * as path from 'path'
import { Constants } from '../constants'
import { logger } from '../logger'
import type { VersionCompareVerdict } from './check-puya-version'
import { downloadPuyaBinary } from './download-puya'
import { runPuya } from './run-puya'

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
 * Checks if a given Puya binary matches the targeted version
 * @param binaryPath Path to the Puya binary
 * @returns True if the version matches, false otherwise
 */
async function checkPuyaBinaryVersion(binaryPath: string): Promise<boolean> {
  // Use the specified binary to check version
  const versionCheckCommand = binaryPath
  const isScript = process.env.PUYA_SCRIPT_PATH === binaryPath

  let versionResult: { target: string; found?: string; verdict: VersionCompareVerdict } | undefined

  // Setup custom version checker that uses the specific binary path
  const versionParser = {
    lines: [] as string[],
    receiveLine(line: string): void {
      this.lines.push(line)
    },
  }

  try {
    await runPuya({
      command: versionCheckCommand,
      args: ['--version'],
      onOutput: (line) => versionParser.receiveLine(line),
      shell: isScript,
    })

    // Parse the version output
    const versionLine = versionParser.lines.find((line) => line.startsWith('puya '))
    if (!versionLine) {
      logger.warn(undefined, `Unable to verify Puya version: No version output found`)
      return false
    }

    const matched = /^puya ((\d+)\.(\d+)\.(\d+))$/.exec(versionLine)
    if (!matched) {
      logger.warn(undefined, `Unable to verify Puya version: Unexpected version format: "${versionLine}"`)
      return false
    }

    const found = matched[1]
    const [major, minor, rev] = [Number(matched[2]), Number(matched[3]), Number(matched[4])]
    const target = Constants.targetedPuyaVersion
    const [targetMajor, targetMinor, targetRev] = target.split('.').map(Number)

    // Determine the version comparison result
    if (major !== targetMajor || minor !== targetMinor) {
      logger.warn(
        undefined,
        `Installed version of puya (${found}) does not match targeted version for puya-ts (${target}). There may be compatibility issues.`,
      )
      return false
    }

    if (rev < targetRev) {
      logger.warn(undefined, `Installed revision of puya (${found}) is older than the targeted revision for puya-ts (${target})`)
      return false
    }

    if (rev > targetRev) {
      logger.debug(undefined, `Installed revision of puya (${found}) is newer than the targeted revision for puya-ts (${target})`)
      return true
    }

    return true
  } catch (error) {
    logger.warn(undefined, `Failed to check Puya version: ${error instanceof Error ? error.message : String(error)}`)
    return false
  }
}

/**
 * Resolves the path to the Puya binary, downloading if necessary
 * @param skipVersionCheck Whether to skip version checking
 * @returns Promise that resolves to the path of the Puya binary to use
 */
export async function resolvePuyaBinary(skipVersionCheck = false): Promise<{ binaryPath: string; useShell: boolean }> {
  // Check for user-specified path via environment variable
  const userSpecifiedPath = process.env.PUYA_SCRIPT_PATH
  if (userSpecifiedPath) {
    logger.info(undefined, `Using user-specified Puya path: ${userSpecifiedPath}`)

    // Check version compatibility if not skipping
    if (!skipVersionCheck) {
      await checkPuyaBinaryVersion(userSpecifiedPath)
    }

    // Always use shell mode for user-specified Puya scripts
    return { binaryPath: userSpecifiedPath, useShell: true }
  }

  // Look for cached binary
  const cachedBinaryPath = findCachedPuyaBinary()
  if (cachedBinaryPath) {
    logger.debug(undefined, `Found cached Puya binary at ${cachedBinaryPath}`)

    // Check if the cached binary version matches (if not skipping)
    if (!skipVersionCheck) {
      const versionMatches = await checkPuyaBinaryVersion(cachedBinaryPath)
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
