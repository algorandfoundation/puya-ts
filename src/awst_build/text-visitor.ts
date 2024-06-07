import ts, {
  ComputedPropertyName,
  Identifier,
  NoSubstitutionTemplateLiteral,
  NumericLiteral,
  PrivateIdentifier,
  PropertyName,
  PseudoLiteralToken,
  StringLiteral,
} from 'typescript'
import { Visitor, accept } from '../visitor/visitor'
import { NotSupported } from '../errors'
import { BaseContext } from './context'

type ObjectNames = PropertyName | PseudoLiteralToken

export class TextVisitor implements Visitor<ObjectNames, string> {
  constructor(public context: BaseContext) {}

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

  visitIdentifier(node: Identifier): string {
    return node.text
  }
  visitNoSubstitutionTemplateLiteral(node: NoSubstitutionTemplateLiteral): string {
    return node.text
  }
  visitNumericLiteral(node: NumericLiteral): string {
    return node.text
  }
  visitComputedPropertyName(node: ComputedPropertyName): string {
    throw new NotSupported('Computed property names', {
      sourceLocation: this.context.getSourceLocation(node),
    })
  }
  visitPrivateIdentifier(node: PrivateIdentifier): string {
    return node.text
  }
  visitStringLiteral(node: StringLiteral): string {
    return node.text
  }
}
