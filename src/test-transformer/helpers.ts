import ts from 'typescript'
import { TransformerError } from './errors'

export const getPropertyNameAsString = (name: ts.PropertyName): ts.Identifier | ts.StringLiteral | ts.NoSubstitutionTemplateLiteral => {
  if (ts.isStringLiteralLike(name)) {
    return name
  }
  if (ts.isIdentifier(name)) {
    return ts.factory.createStringLiteral(name.text)
  }
  throw new TransformerError(`Node ${name.kind} cannot be converted to a static string`)
}
