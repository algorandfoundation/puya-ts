import type ts from 'typescript'
import type { DeliberateAny } from '../../packages/algo-ts-testing/src/typescript-helpers'
import { TypeReflector } from './type-reflector'
import { SourceFileVisitor } from './visitors'
import { TypeResolver } from '../awst_build/type-resolver'
import { registerPTypes } from '../awst_build/ptypes/register'
import { typeRegistry } from '../awst_build/type-registry'

const programTransformer = {
  type: 'program',
  factory(program: ts.Program): ts.TransformerFactory<ts.SourceFile> {
    registerPTypes(typeRegistry)
    return (context) => {
      return (sourceFile) => {
        if (!sourceFile.fileName.endsWith('.algo.ts')) return sourceFile
        return new SourceFileVisitor(context, sourceFile, program).result()
      }
    }
  },
}

// Typescript.d.ts typings require a TransformerFactory however rollup plugin supports a program transformer
// https://github.com/rollup/plugins/blob/master/packages/typescript/src/customTransformers.ts
export const puyaTsTransformer: ts.TransformerFactory<ts.SourceFile> = programTransformer as DeliberateAny
