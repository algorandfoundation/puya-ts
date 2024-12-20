import type ts from 'typescript'
import { AwstBuildFailureError, CodeError } from '../../errors'
import type { ClassElements } from '../../visitor/syntax-names'
import type { Visitor } from '../../visitor/visitor'
import { accept } from '../../visitor/visitor'
import type { AwstBuildContext } from '../context/awst-build-context'
import type { ARC4StructType } from '../ptypes/arc4-types'
import { BaseVisitor } from './base-visitor'

export class StructVisitor extends BaseVisitor implements Visitor<ClassElements, void> {
  public accept = <TNode extends ts.Node>(node: TNode) => accept<StructVisitor, TNode>(this, node)

  static buildStructDef(ctx: AwstBuildContext, classDec: ts.ClassDeclaration, ptype: ARC4StructType) {
    new StructVisitor(ctx, classDec, ptype)
    return []
  }

  constructor(ctx: AwstBuildContext, classDec: ts.ClassDeclaration, ptype: ARC4StructType) {
    super(ctx)

    for (const member of classDec.members) {
      try {
        this.accept(member)
      } catch (e) {
        // Ignore this error and continue visiting other members, so we can show additional errors
        if (!(e instanceof AwstBuildFailureError)) {
          throw e
        }
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
