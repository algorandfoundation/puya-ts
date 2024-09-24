import type * as ts from 'typescript'
import { NotSupported } from '../errors'
import type { Visitor } from '../visitor/visitor'
import { accept } from '../visitor/visitor'
import type { AwstBuildContext } from './context/awst-build-context'

type ObjectNames = ts.PropertyName | ts.PseudoLiteralToken

export class TextVisitor implements Visitor<ObjectNames, string> {
  constructor(public context: AwstBuildContext) {}

  visitBigIntLiteral(node: ts.BigIntLiteral): string {
    return node.text
  }

  visitTemplateHead(node: ts.TemplateHead): string {
    return node.text
  }
  visitTemplateMiddle(node: ts.TemplateMiddle): string {
    return node.text
  }
  visitTemplateTail(node: ts.TemplateTail): string {
    return node.text
  }
  public accept = <TNode extends ts.Node>(node: TNode) => accept<TextVisitor, TNode>(this, node)

  visitIdentifier(node: ts.Identifier): string {
    return node.text
  }
  visitNoSubstitutionTemplateLiteral(node: ts.NoSubstitutionTemplateLiteral): string {
    return node.text
  }
  visitNumericLiteral(node: ts.NumericLiteral): string {
    return node.text
  }
  visitComputedPropertyName(node: ts.ComputedPropertyName): string {
    throw new NotSupported('Computed property names', {
      sourceLocation: this.context.getSourceLocation(node),
    })
  }
  visitPrivateIdentifier(node: ts.PrivateIdentifier): string {
    return node.text
  }
  visitStringLiteral(node: ts.StringLiteral): string {
    return node.text
  }
}
