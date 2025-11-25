import type ts from 'typescript'
import { DefaultMap } from '../util/default-map'
import { extractImports } from './extract-imports'

export class DependencyGraph {
  fileDependants: DefaultMap<string, Set<string>> = new DefaultMap()

  addEdges(file: string, imports: string[]) {
    for (const i of imports) {
      this.fileDependants.getOrDefault(i, () => new Set<string>()).add(file)
    }
  }

  getDependants(files: string): Set<string>
  getDependants(files: string[]): Set<string>
  getDependants(files: string[] | string): Set<string> {
    const toVisit = Array.isArray(files) ? [...files] : [files]
    const dependants = new Set<string>()
    let nextFile: string | undefined
    while ((nextFile = toVisit.shift())) {
      if (dependants.has(nextFile)) continue
      dependants.add(nextFile)
      const nextFileDeps = this.fileDependants.get(nextFile)
      if (nextFileDeps) toVisit.push(...nextFileDeps)
    }
    return dependants
  }

  updateWith(other: DependencyGraph) {
    for (const [key, value] of other.fileDependants.entries()) {
      const set = this.fileDependants.get(key) ?? new Set<string>()
      this.fileDependants.set(key, set.union(value))
    }
  }
}

export function buildDependencyGraph(program: ts.Program): DependencyGraph {
  const graph = new DependencyGraph()

  for (const sourceFile of program.getSourceFiles()) {
    if (sourceFile.isDeclarationFile) continue
    const importedPaths = extractImports(sourceFile)
      .filter((i) => i.type === 'internal')
      .map((i) => i.path.toString())
    graph.addEdges(sourceFile.fileName, importedPaths)
  }
  return graph
}
