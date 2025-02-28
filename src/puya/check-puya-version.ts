import { Constants } from '../constants'
import { logger } from '../logger'
import { runPuya } from './run-puya'

export enum VersionCompareVerdict {
  ExactMatch = 'ExactMatch',
  Inconclusive = 'Inconclusive',
  MajorMismatch = 'MajorMismatch',
  MinorMismatch = 'MinorMismatch',
  OlderRevision = 'OlderRevision',
  NewerRevision = 'NewerRevision',
}

export async function comparePuyaVersion(): Promise<{
  target: string
  found?: string
  verdict: VersionCompareVerdict
}> {
  const target = Constants.targetedPuyaVersion

  const versionParser = new VersionParser()
  await runPuya({
    command: 'puya',
    args: ['--version'],
    onOutput: (line) => versionParser.receiveLine(line),
  })

  if (!versionParser.version) return { target, verdict: VersionCompareVerdict.Inconclusive }
  const ver = versionParser.version

  // Compare
  const [major, minor, rev] = target.split('.').map((x) => Number(x))
  if (ver.major !== major) return { verdict: VersionCompareVerdict.MajorMismatch, target, found: ver.formatted }
  if (ver.minor !== minor) return { verdict: VersionCompareVerdict.MinorMismatch, target, found: ver.formatted }
  if (ver.rev < rev) return { verdict: VersionCompareVerdict.OlderRevision, target, found: ver.formatted }
  if (ver.rev > rev) return { verdict: VersionCompareVerdict.NewerRevision, target, found: ver.formatted }
  return { verdict: VersionCompareVerdict.ExactMatch, target, found: ver.formatted }
}

/**
 * Compare the version of a specific Puya binary path against the targeted version
 * @param binaryPath Path to the Puya binary to check
 * @param useShell Whether to run the binary with shell
 * @returns Promise resolving to the comparison result
 */
export async function compareSpecificPuyaVersion(
  binaryPath: string,
  useShell = false,
): Promise<{
  target: string
  found?: string
  verdict: VersionCompareVerdict
}> {
  const target = Constants.targetedPuyaVersion

  const versionParser = new VersionParser()
  try {
    await runPuya({
      command: binaryPath,
      args: ['--version'],
      onOutput: (line) => versionParser.receiveLine(line),
      shell: useShell,
    })
  } catch (error) {
    return { target, verdict: VersionCompareVerdict.Inconclusive }
  }

  if (!versionParser.version) return { target, verdict: VersionCompareVerdict.Inconclusive }
  const ver = versionParser.version

  // Compare
  const [major, minor, rev] = target.split('.').map((x) => Number(x))
  if (ver.major !== major) return { verdict: VersionCompareVerdict.MajorMismatch, target, found: ver.formatted }
  if (ver.minor !== minor) return { verdict: VersionCompareVerdict.MinorMismatch, target, found: ver.formatted }
  if (ver.rev < rev) return { verdict: VersionCompareVerdict.OlderRevision, target, found: ver.formatted }
  if (ver.rev > rev) return { verdict: VersionCompareVerdict.NewerRevision, target, found: ver.formatted }
  return { verdict: VersionCompareVerdict.ExactMatch, target, found: ver.formatted }
}

// TODO: potential this won't be needed if we download the binary ourselves
export async function checkPuyaVersion() {
  const result = await comparePuyaVersion()
  switch (result.verdict) {
    case VersionCompareVerdict.Inconclusive:
      logger.warn(undefined, `Unable to verify installed puya version. Please ensure version ${result.target} is available`)
      break
    case VersionCompareVerdict.MajorMismatch:
    case VersionCompareVerdict.MinorMismatch:
      logger.warn(
        undefined,
        `Installed version of puya (${result.found}) does not match targeted version for puya-ts (${result.target}). There may be compatability issues.`,
      )
      break
    case VersionCompareVerdict.OlderRevision:
      logger.warn(
        undefined,
        `Installed revision of puya (${result.found}) is older than the targeted revision for puya-ts (${Constants.targetedPuyaVersion})`,
      )
      break
    case VersionCompareVerdict.NewerRevision:
      logger.debug(
        undefined,
        `Installed revision of puya (${result.found}) is newer than the targeted revision for puya-ts (${Constants.targetedPuyaVersion})`,
      )
      break
  }
}

/**
 * Check if a specific binary's version is compatible, with optional suppression of warning logs
 * @param binaryPath Path to the binary to check
 * @param useShell Whether to use shell for execution
 * @param suppressWarnings Whether to suppress warning logs (for checking cached binaries)
 * @returns True if the version is compatible, false otherwise
 */
export async function checkSpecificBinaryVersion(binaryPath: string, useShell = false, suppressWarnings = false): Promise<boolean> {
  const result = await compareSpecificPuyaVersion(binaryPath, useShell)

  switch (result.verdict) {
    case VersionCompareVerdict.Inconclusive:
      if (!suppressWarnings) {
        logger.warn(undefined, `Unable to verify puya version for ${binaryPath}. Please ensure version ${result.target} is available`)
      }
      return false

    case VersionCompareVerdict.MajorMismatch:
    case VersionCompareVerdict.MinorMismatch:
      if (!suppressWarnings) {
        logger.warn(
          undefined,
          `Version of puya at ${binaryPath} (${result.found}) does not match targeted version (${result.target}). There may be compatibility issues.`,
        )
      }
      return false

    case VersionCompareVerdict.OlderRevision:
      if (!suppressWarnings) {
        logger.warn(undefined, `Revision of puya at ${binaryPath} (${result.found}) is older than the targeted revision (${result.target})`)
      }
      return false

    case VersionCompareVerdict.NewerRevision:
      if (!suppressWarnings) {
        logger.debug(
          undefined,
          `Revision of puya at ${binaryPath} (${result.found}) is newer than the targeted revision (${result.target})`,
        )
      }
      return true

    case VersionCompareVerdict.ExactMatch:
      return true
  }
}

type SemVer = {
  major: number
  minor: number
  rev: number
  formatted: string
}

class VersionParser {
  #ver: SemVer | undefined

  receiveLine(line: string): void {
    const matched = /^puya ((\d+)\.(\d+)\.(\d+))$/.exec(line)
    if (!matched) {
      logger.debug(undefined, `'puya --version' command returned unexpected output: "${line}"`)
    } else {
      this.#ver = {
        formatted: matched[1],
        major: Number(matched[2]),
        minor: Number(matched[3]),
        rev: Number(matched[4]),
      }
    }
  }

  get version(): undefined | SemVer {
    return this.#ver
  }
}
