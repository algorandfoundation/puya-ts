import path from 'node:path'
import * as fs from 'node:fs'
import { globSync } from 'glob'
import { logger } from './logger'
import { PuyaError } from './errors'

export interface CompileOptions {
  filePaths: string[]
  outputAwst: boolean
  outputAwstJson: boolean
  outDir: string
}

export const buildCompileOptions = ({
  paths,
  ...rest
}: {
  paths: string[]
  outputAwst: boolean
  outDir: string
  outputAwstJson: boolean
}): CompileOptions => {
  const filePaths = []

  for (const p of paths) {
    if (p.endsWith('.algo.ts')) {
      if (fs.existsSync(p)) {
        filePaths.push(p)
      } else {
        logger.warn(undefined, `File ${p} could not be found`)
      }
    } else if (p.endsWith('.ts')) {
      logger.warn(undefined, `Ignoring path ${p} as it does use the .algo.ts extension`)
    } else {
      const matches = globSync(path.join(p, '**/*.algo.ts').replaceAll('\\', '/'))
      if (matches.length) {
        filePaths.push(...matches)
      } else {
        logger.warn(undefined, `Path ${p} did not match any .algo.ts files`)
      }
    }
  }
  if (filePaths.length === 0) {
    throw new PuyaError('Input paths did not match any .algo.ts files')
  }

  return {
    filePaths,
    ...rest,
  }
}
