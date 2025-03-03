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

export async function comparePuyaVersion(
  command: string,
  useShell = false,
): Promise<{
  target: string
  found?: string
  verdict: VersionCompareVerdict
}> {
  const target = Constants.targetedPuyaVersion

  const versionParser = new VersionParser()
  await runPuya({
    command: command,
    args: ['--version'],
    onOutput: (line) => versionParser.receiveLine(line),
    shell: useShell,
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

export async function checkPuyaVersion(command: string, useShell = false, suppressWarnings = false): Promise<boolean> {
  const result = await comparePuyaVersion(command, useShell)
  let warningMessage = undefined

  switch (result.verdict) {
    case VersionCompareVerdict.Inconclusive:
      warningMessage = `Unable to verify puya version. Please ensure version ${result.target} is available`
      break
    case VersionCompareVerdict.MajorMismatch:
    case VersionCompareVerdict.MinorMismatch:
      warningMessage = `Version of puya (${result.found}) does not match targeted version (${result.target}). There may be compatibility issues.`
      break
    case VersionCompareVerdict.OlderRevision:
      warningMessage = `Revision of puya (${result.found}) is older than the targeted revision (${result.target})`
      break
    case VersionCompareVerdict.NewerRevision:
      warningMessage = `Revision of puya (${result.found}) is newer than the targeted revision (${result.target})`
      break
    case VersionCompareVerdict.ExactMatch:
      return true
  }

  if (warningMessage) {
    if (!suppressWarnings) {
      logger.warn(undefined, warningMessage)
    }
    return false
  }

  return true
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
