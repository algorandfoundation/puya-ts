import { Constants } from '../constants'
import { logger } from '../logger'
import { runPuya } from './run-puya'

export enum VersionCompareVerdict {
  ExactMatch = 'ExactMatch',
  Inconclusive = 'Inconclusive',
  MajorMismatch = 'MajorMismatch',
  MinorMismatch = 'MinorMismatch',
  RevisionMismatch = 'RevisionMismatch',
}

export function comparePuyaVersion(): {
  target: string
  found?: string
  verdict: VersionCompareVerdict
} {
  const target = Constants.targetedPuyaVersion

  const versionParser = new VersionParser()
  runPuya({
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
  if (ver.rev !== rev) return { verdict: VersionCompareVerdict.RevisionMismatch, target, found: ver.formatted }
  return { verdict: VersionCompareVerdict.ExactMatch, target, found: ver.formatted }
}

export function checkPuyaVersion() {
  const result = comparePuyaVersion()
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
    case VersionCompareVerdict.RevisionMismatch:
      logger.debug(
        undefined,
        `Installed revision of puya (${result.found}) does not match targeted revision for puya-ts (${Constants.targetedPuyaVersion})`,
      )
      break
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
