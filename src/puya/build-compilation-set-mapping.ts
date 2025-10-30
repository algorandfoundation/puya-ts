import type { AWST } from '../awst/nodes'
import type { CompilationSet } from '../awst_build/models/contract-class-model'
import type { AlgoFile, CompilationSetMapping } from '../options'
import { mkDirIfNotExists } from '../util'

export function buildCompilationSetMapping({
  awst,
  inputPaths,
  compilationSet,
}: {
  awst: AWST[]
  inputPaths: AlgoFile[]
  compilationSet: CompilationSet
}): CompilationSetMapping {
  const setIds = new Set(compilationSet.compilationOutputSet.map((s) => s.id))

  return awst.reduce((acc, cur) => {
    if (setIds.has(cur.id.toString())) {
      const matchedPath = inputPaths.find((p) => cur.sourceLocation.file && p.sourceFile.equals(cur.sourceLocation.file))
      if (matchedPath) {
        mkDirIfNotExists(matchedPath.outDir.toString())
        acc[cur.id.toString()] = matchedPath.outDir.toString()
      }
    }
    return acc
  }, {} as CompilationSetMapping)
}
