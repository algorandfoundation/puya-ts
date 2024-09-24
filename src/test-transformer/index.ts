import type ts from 'typescript'
import { registerPTypes } from '../awst_build/ptypes/register'
import { typeRegistry } from '../awst_build/type-registry'
import type { DeliberateAny } from '../typescript-helpers'
import { SourceFileVisitor } from './visitors'

const includes: string[] = ['.algo.ts', '.spec.ts']
const programTransformer = {
  type: 'program',
  factory(program: ts.Program): ts.TransformerFactory<ts.SourceFile> {
    registerPTypes(typeRegistry)
    return (context) => {
      return (sourceFile) => {
        if (!includes.some((i) => sourceFile.fileName.endsWith(i))) return sourceFile
        return new SourceFileVisitor(context, sourceFile, program).result()
      }
    }
  },
}

// Typescript.d.ts typings require a TransformerFactory however rollup plugin supports a program transformer
// https://github.com/rollup/plugins/blob/master/packages/typescript/src/customTransformers.ts
export const puyaTsTransformer: ts.TransformerFactory<ts.SourceFile> = programTransformer as DeliberateAny
