import ts from 'typescript'

export function jsonSerializeSourceFiles(ast: Record<string, ts.SourceFile>) {
  return JSON.stringify(
    ast,
    (key, value) => {
      if (ts.isSourceFile(value)) {
        return value.getFullText().split(/\n/g)
      }
      return value
    },
    2,
  )
}
