import { minimatch } from 'minimatch'
import upath from 'upath'

export function determineOutDir(inputPath: string, sourceFile: string, outDir: string) {
  const outDirBase = findMinimalMatch(upath.normalizeTrim(inputPath), sourceFile)

  const subPath = upath.dirname(sourceFile.slice(outDirBase.length))

  if (upath.isAbsolute(outDir)) {
    return upath.normalizeTrim(upath.join(outDir, subPath))
  }
  return upath.normalizeTrim(upath.join(outDirBase, outDir, subPath))
}

function trimCurrentDir(path: string) {
  return path.startsWith('./') ? path.slice(2) : path
}

function findMinimalMatch(inputPath: string, testPath: string): string {
  if (inputPath === '.' || testPath === '.') {
    return ''
  }
  const [matchedPath] = minimatch.match([trimCurrentDir(testPath)], trimCurrentDir(inputPath))
  if (matchedPath) {
    if (matchedPath.endsWith('.algo.ts')) {
      return upath.dirname(matchedPath)
    }
    return matchedPath
  }
  return findMinimalMatch(inputPath, upath.dirname(testPath))
}
