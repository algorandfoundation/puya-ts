import chalk from 'chalk'
import { Constants } from '../constants'
import { parseSemVer } from '../puya/semver'

function writeError(text: string) {
  // eslint-disable-next-line no-console
  console.error(chalk.red(text))
}

export function checkNodeVersion() {
  const min = parseSemVer(Constants.minNodeVersion)
  const actual = parseSemVer(process.versions.node)

  if (
    actual.major < min.major ||
    (actual.major === min.major && actual.minor < min.minor) ||
    (actual.major === min.major && actual.minor === min.minor && actual.rev < min.rev)
  ) {
    writeError(
      `Installed node version ${process.versions.node} is older than the minimum required version ${Constants.minNodeVersion}. You may experience compatibility issues.`,
    )
  }
}
