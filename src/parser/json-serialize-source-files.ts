import ts from 'typescript'
import path from 'node:path'
import type { SourceFileMapping } from './index'

export function jsonSerializeSourceFiles(sourceFiles: SourceFileMapping, programDirectory: string) {
  return JSON.stringify(
    Object.fromEntries(Object.entries(sourceFiles).map(([key, value]) => [path.join(programDirectory, key), value] as const)),
    (key, value) => {
      if (ts.isSourceFile(value)) {
        return value.getFullText().split(/\n/g)
      }
      return value
    },
    2,
  )
}
