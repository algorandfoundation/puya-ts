import { globSync } from 'glob'
import pathe, { normalize } from 'pathe'

import { PuyaError } from '../errors'
import { logger } from '../logger'
import type { AlgoFile } from '../options'
import { AbsolutePath } from '../util/absolute-path'
import { determineOutDir } from './determine-out-dir'

export const processInputPaths = ({
  paths,
  ignoreUnmatchedPaths,
  workingDirectory = AbsolutePath.resolve({ path: process.cwd() }),
  outDir = 'out',
}: {
  ignoreUnmatchedPaths?: boolean
  paths: string[]
  outDir?: string
  workingDirectory?: AbsolutePath
}): AlgoFile[] => {
  const filePaths: AlgoFile[] = []

  for (const p of paths.map((p) => pathe.normalize(p))) {
    const globPath = p.endsWith('.algo.ts') ? p : pathe.join(p, '**/*.algo.ts')
    const matches = globSync(globPath)
    if (matches.length) {
      for (const match of matches) {
        filePaths.push({
          sourceFile: AbsolutePath.resolve({ path: match, workingDirectory }),
          outDir: AbsolutePath.resolve({ path: determineOutDir(p, normalize(match), outDir), workingDirectory }),
        })
      }
    } else {
      if (ignoreUnmatchedPaths) continue
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
    name: algoFile.sourceFile.basename('.algo.ts'),
  }

  return {
    ...algoFile,
    outDir: algoFile.outDir.replaceAll('[name]', replacements.name),
  }
}
