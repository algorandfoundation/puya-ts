import type ts from 'typescript'
import type { ClassElements } from '../../visitor/syntax-names'
import type { Visitor } from '../../visitor/visitor'
import { AwstBuildContext } from '../context/awst-build-context'
import type { ARC4StructType } from '../ptypes/arc4-types'
import { ClassDefinitionVisitor } from './class-definition-visitor'

export class StructVisitor extends ClassDefinitionVisitor implements Visitor<ClassElements, void> {
  static buildStructDef(classDec: ts.ClassDeclaration, ptype: ARC4StructType) {
    return AwstBuildContext.current.runInChildContext(() => {
      new StructVisitor(classDec, ptype)
      return []
    })
  }

  constructor(classDec: ts.ClassDeclaration, ptype: ARC4StructType) {
    super(classDec)
  }
}
