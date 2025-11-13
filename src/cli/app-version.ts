import fs from 'fs'
import { fileURLToPath } from 'node:url'
import pathe from 'pathe'
import { Constants } from '../constants'

export function packageVersion(): string {
  let dirName = pathe.dirname(fileURLToPath(import.meta.url))

  while (true) {
    const packageJsonPath = pathe.join(dirName, 'package.json')
    if (fs.existsSync(packageJsonPath)) {
      return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')).version
    }
    if (dirName === pathe.dirname(dirName)) break
    dirName = pathe.dirname(dirName)
  }
  return 'unknown'
}

export function appVersion(options?: { name?: string; withAVMVersion?: boolean }): string {
  const name = options?.name ?? 'puya-ts'
  const withAVMVersion = options?.withAVMVersion ?? true

  const version = packageVersion()
  return [`${name} ${version}`]
    .concat(
      withAVMVersion
        ? ['', 'Targets:', `puya ${Constants.targetedPuyaVersion}`, `AVM ${Constants.supportedAvmVersions.join(', ')}`]
        : [`puya ${Constants.targetedPuyaVersion}`],
    )
    .join('\n')
}
