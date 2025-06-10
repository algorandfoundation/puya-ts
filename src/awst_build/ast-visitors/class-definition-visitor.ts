import type ts from 'typescript'
import { logger } from '../../logger'
import { invariant } from '../../util'
import type { ClassElements } from '../../visitor/syntax-names'
import type { Visitor } from '../../visitor/visitor'
import { accept } from '../../visitor/visitor'
import { BaseVisitor } from './base-visitor'

export abstract class ClassDefinitionVisitor extends BaseVisitor implements Visitor<ClassElements, void> {
  public accept = <TNode extends ts.Node>(node: TNode) => accept<ClassDefinitionVisitor, TNode>(this, node)

  protected visitAllMembers(classDec: ts.ClassDeclaration) {
    for (const member of classDec.members) {
      try {
        this.accept(member)
      } catch (e) {
        invariant(e instanceof Error, 'Only errors should be thrown')
        logger.error(e)
      }
    }
  }

  abstract throwNotSupported(node: ts.Node, desc: string): never

  visitClassStaticBlockDeclaration(node: ts.ClassStaticBlockDeclaration) {
    this.throwNotSupported(node, 'Class static block declarations')
  }
  visitConstructor(node: ts.ConstructorDeclaration) {
    this.throwNotSupported(node, 'Constructor declarations')
  }
  visitGetAccessor(node: ts.GetAccessorDeclaration) {
    this.throwNotSupported(node, 'Property declarations')
  }
  visitIndexSignature(node: ts.IndexSignatureDeclaration) {
    this.throwNotSupported(node, 'Index signature declarations')
  }
  visitMethodDeclaration(node: ts.MethodDeclaration) {
    this.throwNotSupported(node, 'Method declarations')
  }
  visitPropertyDeclaration(node: ts.PropertyDeclaration) {
    this.throwNotSupported(node, 'Property declarations')
  }
  visitSemicolonClassElement(node: ts.SemicolonClassElement) {
    // Ignore
  }
  visitSetAccessor(node: ts.SetAccessorDeclaration) {
    this.throwNotSupported(node, 'Property declarations')
  }
}
