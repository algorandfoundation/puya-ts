import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const pick = <T extends object, U extends keyof T>(object: T, ...props: U[]): Partial<T> => {
  return Object.entries(object).reduce<Partial<T>>((acc, [key, value]) => {
    if (props.includes(key as U)) acc[key as U] = value
    return acc
  }, {})
}

const standardSectionWhitelist = [
  'name',
  'version',
  'description',
  'keywords',
  'homepage',
  'bugs',
  'license',
  'author',
  'contributors',
  'funding',
  'browser',
  'man',
  'directories',
  'repository',
  'config',
  'dependencies',
  'peerDependencies',
  'peerDependenciesMeta',
  'bundleDependencies',
  'optionalDependencies',
  'overrides',
  'engines',
  'os',
  'cpu',
  'private',
  'publishConfig',
]

const inputFolder = '.'
const outputFolder = join('.', 'dist')

const packageJson = JSON.parse(readFileSync(join(inputFolder, 'package.json'), 'utf-8'))

const output = {
  scripts: {},
  files: ['**'],
  ...pick(packageJson, ...(standardSectionWhitelist as (keyof typeof packageJson)[])),
  main: './index.js',
  module: './index.mjs',
  types: './index.d.ts',
  type: 'module',
  exports: {
    '.': { types: './index.d.ts', import: './index.mjs', require: './index.js' },
    './arc4': { types: './arc4/index.d.ts', import: './arc4/index.mjs', require: './arc4/index.js' },
    './op': { types: './op.d.ts', import: './op.mjs', require: './op.js' },
  },
}

writeFileSync(join(outputFolder, 'package.json'), `${JSON.stringify(output, undefined, 2)}\n`, 'utf-8')
