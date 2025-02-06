import { globSync } from 'glob'
import { minimatch } from 'minimatch'
import * as fs from 'node:fs'
import upath from 'upath'
import { PuyaError } from './errors'
import type { LogLevel } from './logger'
import { logger } from './logger'
import { normalisePath } from './util'

export interface AlgoFile {
  matchedInput: string
  sourceFile: string
  outDir: string
}

export interface PuyaTsCompileOptions {
  filePaths: AlgoFile[]
  logLevel: LogLevel
  outputAwst: boolean
  outputAwstJson: boolean
  skipVersionCheck: boolean
  /*
  Don't generate artifacts for puya, or invoke puya
   */
  dryRun: boolean
}

export const buildCompileOptions = ({
  paths,
  workingDirectory = process.cwd(),
  outDir,
  ...rest
}: {
  paths: string[]
  outputAwst: boolean
  outDir: string
  outputAwstJson: boolean
  skipVersionCheck: boolean
  workingDirectory?: string
  dryRun: boolean
  logLevel: LogLevel
}): PuyaTsCompileOptions => {
  const filePaths: AlgoFile[] = []

  for (const p of paths.map((p) => upath.normalizeTrim(p))) {
    if (p.endsWith('.algo.ts')) {
      if (fs.existsSync(p)) {
        const sourceFile = normalisePath(p, workingDirectory)

        filePaths.push({
          matchedInput: p,
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
            matchedInput: p,
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

  return {
    filePaths: filePaths.map(replaceOutDirTokens),
    ...rest,
  }
}

function findMinimalMatch(inputPath: string, testPath: string): string {
  const [matchedPath] = minimatch.match([testPath], inputPath)
  if (matchedPath) {
    if (matchedPath.endsWith('.algo.ts')) {
      return upath.dirname(matchedPath)
    }
    return matchedPath
  }
  return findMinimalMatch(inputPath, upath.dirname(testPath))
}

export function determineOutDir(inputPath: string, sourceFile: string, outDir: string) {
  const outDirBase = findMinimalMatch(inputPath, sourceFile)

  const subPath = upath.dirname(sourceFile.slice(outDirBase.length))

  if (upath.isAbsolute(outDir)) {
    return upath.normalizeTrim(upath.join(outDir, subPath))
  }
  return upath.normalizeTrim(upath.join(outDirBase, outDir, subPath))
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
