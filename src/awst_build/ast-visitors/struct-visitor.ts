import type ts from 'typescript'
import { CodeError } from '../../errors'
import type { ClassElements } from '../../visitor/syntax-names'
import type { Visitor } from '../../visitor/visitor'
import { AwstBuildContext } from '../context/awst-build-context'
import type { ARC4StructType } from '../ptypes/arc4-types'
import { ClassDefinitionVisitor } from './class-definition-visitor'

export class StructVisitor extends ClassDefinitionVisitor implements Visitor<ClassElements, void> {
  throwNotSupported(node: ts.Node, desc: string): never {
    throw new CodeError(`${desc} are not supported in ARC4 struct definitions`, {
      sourceLocation: this.sourceLocation(node),
    })
  }
  static buildStructDef(classDec: ts.ClassDeclaration, ptype: ARC4StructType) {
    return AwstBuildContext.current.runInChildContext(() => {
      new StructVisitor(classDec, ptype)
      return []
    })
  }

  constructor(classDec: ts.ClassDeclaration, ptype: ARC4StructType) {
    super()
    this.visitAllMembers(classDec)
  }
}
