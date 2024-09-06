import ts from 'typescript'
import path from 'node:path'

export function jsonSerializeSourceFiles(ast: Record<string, ts.SourceFile>, programDirectory: string) {
  return JSON.stringify(
    Object.fromEntries(Object.entries(ast).map(([key, value]) => [path.join(programDirectory, key), value] as const)),
    (key, value) => {
      if (ts.isSourceFile(value)) {
        return value.getFullText().split(/\n/g)
      }
      return value
    },
    2,
  )
}
