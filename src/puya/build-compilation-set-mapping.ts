import type { AWST } from '../awst/nodes'
import { ContractFragment } from '../awst/nodes'
import type { CompilationSetMapping } from './options'
import type { CompilationSet } from '../awst/models'
import { LogicSigReference } from '../awst/models'
import path from 'node:path'

export function buildCompilationSetMapping({
  awst,
  inputPaths,
  programDirectory,
  compilationSet,
  outDir,
}: {
  awst: AWST[]
  inputPaths: string[]
  programDirectory: string
  outDir: string
  compilationSet: CompilationSet
}): CompilationSetMapping {
  const setIds = new Set(compilationSet.map((s) => s.id))

  return awst.reduce((acc, cur) => {
    if (setIds.has(cur.id.toString())) {
      if (inputPaths.includes(cur.sourceLocation.file)) {
        acc[cur.id.toString()] = path.join(programDirectory, path.dirname(cur.sourceLocation.file), outDir)
      }
    }
    return acc
  }, {} as CompilationSetMapping)
}
