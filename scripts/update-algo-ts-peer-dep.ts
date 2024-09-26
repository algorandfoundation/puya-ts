/* eslint-disable no-console */
import fs from 'fs'

const AlgoTsPackageName = '@algorandfoundation/algo-ts'
const newVersion = process.argv[2]

const SemVersionReg = /^\d+\.\d+\.\d+(-((beta)|(alpha))(\.\d+)?)?$/

if (!SemVersionReg.test(newVersion)) {
  console.error(`Arg 2 of '${newVersion}' should be an npm compatible semantic version number`)
  process.exit(1)
}

if (!fs.existsSync('package.json')) {
  console.error('No package.json file could be found in the current working directory')
  process.exit(2)
}

console.info('Loading package.json file')
const pkgJsonText = fs.readFileSync('package.json', 'utf-8')
const pkgJsonObj = JSON.parse(pkgJsonText)

if (!pkgJsonObj['peerDependencies']) {
  pkgJsonObj['peerDependencies'] = {}
}
console.info(`Setting peer dependency on ${AlgoTsPackageName} to ${newVersion}`)
pkgJsonObj['peerDependencies'][AlgoTsPackageName] = newVersion

fs.writeFileSync('package.json', JSON.stringify(pkgJsonObj, undefined, 2))
console.info('Writing updated package.json')
