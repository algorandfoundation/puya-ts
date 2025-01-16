import { Constants } from '../constants'
import { logger } from '../logger'
import { runPuya } from './run-puya'

export function checkPuyaVersion() {
  const versionParser = new VersionParser()
  runPuya({
    command: 'puya',
    args: ['--version'],
    onOutput: (line) => versionParser.receiveLine(line),
  })

  if (versionParser.version) {
    const ver = versionParser.version
    // Compare
    const [major, minor, rev] = Constants.targetedPuyaVersion.split('.').map((x) => Number(x))
    if (major !== ver.major || minor !== ver.minor) {
      logger.warn(
        undefined,
        `Installed version of puya (${ver.major}.${ver.minor}.${ver.rev}) does not match targeted version for puya-ts (${Constants.targetedPuyaVersion}). There may be compatability issues.`,
      )
    } else if (rev !== ver.rev) {
      logger.debug(
        undefined,
        `Installed revision of puya (${ver.major}.${ver.minor}.${ver.rev}) does not match targeted revision for puya-ts (${Constants.targetedPuyaVersion})`,
      )
    }
  } else {
    logger.warn(undefined, `Unable to verify installed puya version. Please ensure version ${Constants.targetedPuyaVersion} is available`)
  }
}

type SemVer = {
  major: number
  minor: number
  rev: number
}

class VersionParser {
  #ver: SemVer | undefined

  receiveLine(line: string): void {
    const matched = /^puya (\d+)\.(\d+)\.(\d+)$/.exec(line)
    if (!matched) {
      logger.debug(undefined, `'puya --version' command returned unexpected output: "${line}"`)
    } else {
      this.#ver = {
        major: Number(matched[1]),
        minor: Number(matched[2]),
        rev: Number(matched[3]),
      }
    }
  }

  get version(): undefined | SemVer {
    return this.#ver
  }
}
