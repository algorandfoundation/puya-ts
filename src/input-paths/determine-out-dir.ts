import { minimatch } from 'minimatch'
import pathe from 'pathe'

export function determineOutDir(inputPath: string, sourceFile: string, outDir: string) {
  const outDirBase = findMinimalMatch(normalizeTrim(inputPath), sourceFile)

  const subPath = pathe.dirname(sourceFile.slice(outDirBase.length))

  if (pathe.isAbsolute(outDir)) {
    return normalizeTrim(pathe.join(outDir, subPath))
  }
  return normalizeTrim(pathe.join(outDirBase, outDir, subPath))
}

function trimCurrentDir(path: string) {
  return path.startsWith('./') ? path.slice(2) : path
}

function normalizeTrim(path: string): string {
  return pathe.normalize(path).replace(/\/$/, '')
}

function findMinimalMatch(inputPath: string, testPath: string): string {
  if (inputPath === '.' || testPath === '.') {
    return ''
  }
  const [matchedPath] = minimatch.match([trimCurrentDir(testPath)], trimCurrentDir(inputPath))
  if (matchedPath) {
    if (matchedPath.endsWith('.algo.ts')) {
      return pathe.dirname(matchedPath)
    }
    return matchedPath
  }
  return findMinimalMatch(inputPath, pathe.dirname(testPath))
}
