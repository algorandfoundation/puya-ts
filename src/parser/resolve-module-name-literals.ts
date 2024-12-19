import ts from 'typescript'
import { logger } from '../logger'

export function resolveModuleNameLiterals(
  moduleLiterals: readonly ts.StringLiteralLike[],
  containingFile: string,
  redirectedReference: ts.ResolvedProjectReference | undefined,
  options: ts.CompilerOptions,
): readonly ts.ResolvedModuleWithFailedLookupLocations[] {
  return moduleLiterals.map(({ text: moduleName }) => {
    const result = ts.resolveModuleName(
      moduleName,
      containingFile,
      options,
      {
        fileExists: ts.sys.fileExists,
        readFile: ts.sys.readFile,
      },
      undefined,
      redirectedReference,
    )
    if (!result.resolvedModule && !containingFile.endsWith('.d.ts')) {
      logger.warn(undefined, `Could not resolve typings for module ${moduleName} referenced by file ${containingFile}. `)
    }

    return result
  })
}
