import fs from 'fs'
import { fileURLToPath } from 'node:url'
import pathe from 'pathe'
import { Constants } from '../constants'

export function appVersion(name: string = 'puya-ts') {
  let dirName = pathe.dirname(fileURLToPath(import.meta.url))

  while (true) {
    const packageJsonPath = pathe.join(dirName, 'package.json')
    if (fs.existsSync(packageJsonPath)) {
      const version = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')).version
      return [
        `${name} ${version}`,
        '',
        'Targets:',
        `puya ${Constants.targetedPuyaVersion}`,
        `AVM ${Constants.supportedAvmVersions.join(', ')}`,
      ].join('\r\n')
    }
    if (dirName === pathe.dirname(dirName)) break
    dirName = pathe.dirname(dirName)
  }
  return `Cannot determine puya-ts version`
}
