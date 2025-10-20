import fs from 'fs'
import { fileURLToPath } from 'node:url'
import upath from 'upath'
import { Constants } from '../constants'

export function appVersion(options?: { name?: string; withAVMVersion?: boolean }): string {
  let dirName = upath.dirname(fileURLToPath(import.meta.url))
  const name = options?.name ?? 'puya-ts'
  const withAVMVersion = options?.withAVMVersion ?? true

  while (true) {
    const packageJsonPath = upath.join(dirName, 'package.json')
    if (fs.existsSync(packageJsonPath)) {
      const version = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')).version
      return [`${name} ${version}`]
        .concat(
          withAVMVersion
            ? ['', 'Targets:', `puya ${Constants.targetedPuyaVersion}`, `AVM ${Constants.supportedAvmVersions.join(', ')}`]
            : [`puya ${Constants.targetedPuyaVersion}`],
        )
        .join('\r\n')
    }
    if (dirName === upath.dirname(dirName)) break
    dirName = upath.dirname(dirName)
  }
  return `Cannot determine puya-ts version`
}
