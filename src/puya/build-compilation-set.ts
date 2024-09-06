import type { AWST } from '../awst/nodes'
import { ContractFragment } from '../awst/nodes'
import type { CompilationSet } from './options'
import { LogicSigReference } from '../awst/models'
import path from 'node:path'

export function buildCompilationSet({
  awst,
  inputPaths,
  programDirectory,
  outDir,
}: {
  awst: AWST[]
  inputPaths: string[]
  programDirectory: string
  outDir: string
}): CompilationSet {
  return awst.reduce((acc, cur) => {
    if (cur instanceof ContractFragment || cur instanceof LogicSigReference) {
      if (inputPaths.includes(cur.sourceLocation.file)) {
        acc[cur.id.toString()] = path.join(programDirectory, path.dirname(cur.sourceLocation.file), outDir)
      }
    }
    return acc
  }, {} as CompilationSet)
}
