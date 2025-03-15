import { Constants } from '../constants'
import { logger } from '../logger'
import { runPuya } from './run-puya'
import type { SemVer } from './semver'

export enum VersionCompareVerdict {
  ExactMatch = 'ExactMatch',
  Inconclusive = 'Inconclusive',
  MajorMismatch = 'MajorMismatch',
  MinorMismatch = 'MinorMismatch',
  OlderRevision = 'OlderRevision',
  NewerRevision = 'NewerRevision',
}

export async function comparePuyaVersion(puyaPath: string): Promise<{
  target: string
  found?: string
  verdict: VersionCompareVerdict
}> {
  const target = Constants.targetedPuyaVersion

  const versionParser = new VersionParser()
  await runPuya({
    command: puyaPath,
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

export async function checkPuyaVersion(puyaPath: string) {
  const result = await comparePuyaVersion(puyaPath)

  switch (result.verdict) {
    case VersionCompareVerdict.Inconclusive:
      logger.warn(undefined, `Unable to verify the version of Puya at ${puyaPath}.`)
      break
    case VersionCompareVerdict.MajorMismatch:
    case VersionCompareVerdict.MinorMismatch:
      logger.warn(
        undefined,
        `Version of Puya at ${puyaPath} (${result.found}) does not match targeted version (${result.target}). There may be compatibility issues.`,
      )
      break
    case VersionCompareVerdict.OlderRevision:
      logger.warn(undefined, `Revision of Puya at ${puyaPath} (${result.found}) is older than the targeted revision (${result.target})`)
      break
    case VersionCompareVerdict.NewerRevision:
      logger.debug(undefined, `Revision of Puya at ${puyaPath} (${result.found}) is newer than the targeted revision (${result.target})`)
      break
  }
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
