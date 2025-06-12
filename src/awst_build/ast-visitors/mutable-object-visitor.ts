import type ts from 'typescript'
import { CodeError } from '../../errors'
import type { ClassElements } from '../../visitor/syntax-names'
import type { Visitor } from '../../visitor/visitor'
import { accept } from '../../visitor/visitor'
import { AwstBuildContext } from '../context/awst-build-context'
import type { MutableObjectType } from '../ptypes/mutable-object'
import { ClassDefinitionVisitor } from './class-definition-visitor'

export class MutableObjectVisitor extends ClassDefinitionVisitor implements Visitor<ClassElements, void> {
  public accept = <TNode extends ts.Node>(node: TNode) => accept<MutableObjectVisitor, TNode>(this, node)

  static buildObjectDef(classDec: ts.ClassDeclaration, ptype: MutableObjectType) {
    return AwstBuildContext.current.runInChildContext(() => {
      new MutableObjectVisitor(classDec, ptype)
      return []
    })
  }

  constructor(classDec: ts.ClassDeclaration, ptype: MutableObjectType) {
    super()
    this.visitAllMembers(classDec)
  }

  throwNotSupported(node: ts.Node, desc: string): never {
    throw new CodeError(`${desc} are not supported in mutable object definitions`, {
      sourceLocation: this.sourceLocation(node),
    })
  }
}
