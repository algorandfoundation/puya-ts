import type ts from 'typescript'
import { CodeError } from '../../errors'
import { logger } from '../../logger'
import { invariant } from '../../util'
import type { ClassElements } from '../../visitor/syntax-names'
import type { Visitor } from '../../visitor/visitor'
import { accept } from '../../visitor/visitor'
import { BaseVisitor } from './base-visitor'

export abstract class ClassDefinitionVisitor extends BaseVisitor implements Visitor<ClassElements, void> {
  public accept = <TNode extends ts.Node>(node: TNode) => accept<ClassDefinitionVisitor, TNode>(this, node)

  constructor(classDec: ts.ClassDeclaration) {
    super()

    for (const member of classDec.members) {
      try {
        this.accept(member)
      } catch (e) {
        invariant(e instanceof Error, 'Only errors should be thrown')
        logger.error(e)
      }
    }
  }

  private throwStructNotSupported(node: ts.Node, desc: string): never {
    throw new CodeError(`${desc} are not supported in ARC4 struct definitions`, {
      sourceLocation: this.sourceLocation(node),
    })
  }

  visitClassStaticBlockDeclaration(node: ts.ClassStaticBlockDeclaration) {
    this.throwStructNotSupported(node, 'Class static block declarations')
  }
  visitConstructor(node: ts.ConstructorDeclaration) {
    this.throwStructNotSupported(node, 'Constructor declarations')
  }
  visitGetAccessor(node: ts.GetAccessorDeclaration) {
    this.throwStructNotSupported(node, 'Property declarations')
  }
  visitIndexSignature(node: ts.IndexSignatureDeclaration) {
    this.throwStructNotSupported(node, 'Index signature declarations')
  }
  visitMethodDeclaration(node: ts.MethodDeclaration) {
    this.throwStructNotSupported(node, 'Method declarations')
  }
  visitPropertyDeclaration(node: ts.PropertyDeclaration) {
    this.throwStructNotSupported(node, 'Property declarations')
  }
  visitSemicolonClassElement(node: ts.SemicolonClassElement) {
    // Ignore
  }
  visitSetAccessor(node: ts.SetAccessorDeclaration) {
    this.throwStructNotSupported(node, 'Property declarations')
  }
}
