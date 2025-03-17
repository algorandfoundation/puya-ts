import fs from 'fs'
import { fileURLToPath } from 'node:url'
import upath from 'upath'
import { Constants } from '../constants'

export function appVersion() {
  let dirName = upath.dirname(fileURLToPath(import.meta.url))

  while (true) {
    const packageJsonPath = upath.join(dirName, 'package.json')
    if (fs.existsSync(packageJsonPath)) {
      const version = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')).version
      return [
        `puya-ts ${version}`,
        '',
        'Targets:',
        `puya ${Constants.targetedPuyaVersion}`,
        `AVM ${Constants.supportedAvmVersions.join(', ')}`,
      ].join('\r\n')
    }
    if (dirName === upath.dirname(dirName)) break
    dirName = upath.dirname(dirName)
  }
  return `Cannot determine puya-ts version`
}
