import { globSync } from 'glob'
import fs from 'node:fs'
import upath from 'upath'
import { PuyaError } from '../errors'
import { logger } from '../logger'
import type { AlgoFile } from '../options'
import { normalisePath } from '../util'
import { determineOutDir } from './determine-out-dir'

export const processInputPaths = ({
  paths,
  workingDirectory = process.cwd(),
  outDir = 'out',
}: {
  paths: string[]
  outDir?: string
  workingDirectory?: string
}): AlgoFile[] => {
  const filePaths: AlgoFile[] = []

  for (const p of paths.map((p) => upath.normalizeTrim(p))) {
    if (p.endsWith('.algo.ts')) {
      if (fs.existsSync(p)) {
        const sourceFile = normalisePath(p, workingDirectory)

        filePaths.push({
          sourceFile,
          outDir: determineOutDir(p, sourceFile, outDir),
        })
      } else {
        logger.warn(undefined, `File ${p} could not be found`)
      }
    } else if (p.endsWith('.ts')) {
      logger.warn(undefined, `Ignoring path ${p} as it does use the .algo.ts extension`)
    } else {
      const matches = globSync(upath.join(p, '**/*.algo.ts'))
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
  }
  if (filePaths.length === 0) {
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
