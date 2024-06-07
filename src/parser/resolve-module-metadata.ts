import ts from 'typescript'
import path from 'node:path'

interface ModuleMetadata {
  moduleName: string
}

export function resolveModuleMetadata(sourceFile: ts.SourceFile, program: ts.Program): ModuleMetadata {
  const cwd = path.normalize(`${program.getCurrentDirectory()}/`)
  const normalizedPath = path.normalize(sourceFile.fileName)
  const moduleName = normalizedPath.startsWith(cwd) ? normalizedPath.slice(cwd.length) : normalizedPath
  return {
    moduleName,
  }
}
