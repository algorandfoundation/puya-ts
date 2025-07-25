import { globSync } from 'glob'
import upath from 'upath'
import { PuyaError } from '../errors'
import { logger } from '../logger'
import type { AlgoFile } from '../options'
import { normalisePath } from '../util'
import { determineOutDir } from './determine-out-dir'

export const processInputPaths = ({
  paths,
  ignoreUnmatchedPaths,
  workingDirectory = process.cwd(),
  outDir = 'out',
}: {
  ignoreUnmatchedPaths?: boolean
  paths: string[]
  outDir?: string
  workingDirectory?: string
}): AlgoFile[] => {
  const filePaths: AlgoFile[] = []

  for (const p of paths.map((p) => upath.normalizeTrim(p))) {
    const globPath = p.endsWith('.algo.ts') ? p : upath.join(p, '**/*.algo.ts')
    const matches = globSync(globPath)
    if (matches.length) {
      for (const match of matches) {
        const sourceFile = normalisePath(match, workingDirectory)
        filePaths.push({
          sourceFile,
          outDir: determineOutDir(p, sourceFile, outDir),
        })
      }
    } else {
      logger.warn(undefined, `Path '${p}' did not match any .algo.ts files`)
    }
  }

  if (filePaths.length === 0 && !ignoreUnmatchedPaths) {
    throw new PuyaError('Input paths did not match any .algo.ts files')
  }

  return filePaths.map(replaceOutDirTokens)
}

function replaceOutDirTokens(algoFile: AlgoFile): AlgoFile {
  const replacements = {
    name: upath.basename(algoFile.sourceFile).replace('.algo.ts', ''),
  }

  return {
    ...algoFile,
    outDir: algoFile.outDir.replaceAll('[name]', replacements.name),
  }
}
