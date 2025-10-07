import fs from 'fs'
import { globSync } from 'glob'
import pathe from 'pathe'
import { sortBy } from '../src/util'
import { DefaultMap } from '../src/util/default-map'

type AppStats = {
  unoptimized: AppCompilation
  o1: AppCompilation
  o2: AppCompilation
}

type AppCompilation = {
  approval?: number
  clear?: number
}

export function gatherOutputStats(dir: string) {
  const apps = new DefaultMap<string, AppStats>()
  const files = globSync(pathe.join(dir, '**/out/**/*.teal'))
  let longestName = 0
  for (const file of files) {
    const { level, name, program } = parseFileName(file)

    const ops = countOps(file)
    const stats = apps.getOrDefault(name, () => ({ unoptimized: {}, o1: {}, o2: {} }))
    stats[level][program] = ops
    if (name.length > longestName) {
      longestName = name.length
    }
  }
  function padNum(val?: number): string {
    return (val?.toFixed(0) ?? '-').padStart(10, ' ')
  }
  const lines = [
    [
      'Name'.padEnd(longestName, ' '),
      'o0-A'.padStart(10),
      'o0-C'.padStart(10),
      'o1-A'.padStart(10),
      'o1-C'.padStart(10),
      'o2-A'.padStart(10),
      'o2-C'.padStart(10),
    ].join('  '),
  ]
  for (const [name, stats] of Array.from(apps.entries()).toSorted(sortBy(([n]) => n))) {
    lines.push(
      [
        name.padEnd(longestName, ' '),
        padNum(stats.unoptimized.approval),
        padNum(stats.unoptimized.clear),
        padNum(stats.o1.approval),
        padNum(stats.o1.clear),
        padNum(stats.o2.approval),
        padNum(stats.o2.clear),
      ].join('  '),
    )
  }

  return lines.join('\n')
}

function parseFileName(programPath: string): { name: string; program: 'approval' | 'clear'; level: 'unoptimized' | 'o1' | 'o2' } {
  const [_, level, moduleName] = /out[/\\]([^/\\]+)[/\\]([^/\\]+)[/\\]/.exec(programPath) ?? []

  const [name, programRaw] = pathe.basename(programPath).split('.')
  let program: 'approval' | 'clear'
  switch (programRaw) {
    case 'clear':
    case 'approval':
      program = programRaw
      break
    case 'teal':
      // Logic sig doesn't have approval in its name
      program = 'approval'
      break
    default:
      throw new Error(`Invalid program type: ${programRaw}`)
  }
  switch (level) {
    case 'unoptimized':
    case 'o1':
    case 'o2':
      break
    default:
      throw new Error(`Invalid optimization level: ${level}`)
  }
  if (!name) throw new Error(`Missing program name`)

  return {
    name: `${moduleName}::${name}`,
    level,
    program,
  }
}

function countOps(programPath: string): number {
  return fs
    .readFileSync(programPath, 'utf8')
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim()
      // Empty
      if (trimmed.length === 0) return false
      // Pragma
      if (trimmed.startsWith('#')) return false
      // Comment
      if (trimmed.startsWith('//')) return false
      // Label
      if (trimmed.endsWith(':')) return false

      return true
    }).length
}

gatherOutputStats(pathe.join(__dirname, '../tests'))
