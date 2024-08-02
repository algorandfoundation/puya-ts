import type { BinaryOperator } from 'typescript'
import ts from 'typescript'

export function supportedBinaryOpString(x: BinaryOperator): string | undefined {
  switch (x) {
    case ts.SyntaxKind.MinusToken:
      return '-'
    case ts.SyntaxKind.PlusToken:
      return '+'
    case ts.SyntaxKind.EqualsEqualsEqualsToken:
      return '==='
    case ts.SyntaxKind.GreaterThanEqualsToken:
      return '>='
    case ts.SyntaxKind.AsteriskToken:
      return '*'
    case ts.SyntaxKind.AsteriskAsteriskToken:
      return '**'
    case ts.SyntaxKind.SlashToken:
      return '/'
    case ts.SyntaxKind.AmpersandAmpersandEqualsToken:
    case ts.SyntaxKind.AmpersandAmpersandToken:
    case ts.SyntaxKind.AmpersandEqualsToken:
    case ts.SyntaxKind.AmpersandToken:
    case ts.SyntaxKind.AsteriskAsteriskEqualsToken:
    case ts.SyntaxKind.AsteriskEqualsToken:
    case ts.SyntaxKind.BarBarEqualsToken:
    case ts.SyntaxKind.BarBarToken:
    case ts.SyntaxKind.BarEqualsToken:
    case ts.SyntaxKind.BarToken:
    case ts.SyntaxKind.CaretEqualsToken:
    case ts.SyntaxKind.CaretToken:
    case ts.SyntaxKind.CommaToken:
    case ts.SyntaxKind.EqualsEqualsToken:
    case ts.SyntaxKind.EqualsToken:
    case ts.SyntaxKind.ExclamationEqualsEqualsToken:
    case ts.SyntaxKind.ExclamationEqualsToken:
    case ts.SyntaxKind.InKeyword:
    case ts.SyntaxKind.GreaterThanToken:
    case ts.SyntaxKind.InstanceOfKeyword:
    case ts.SyntaxKind.PercentToken:
    case ts.SyntaxKind.LessThanEqualsToken:
    case ts.SyntaxKind.LessThanToken:
    case ts.SyntaxKind.PercentEqualsToken:
    case ts.SyntaxKind.PlusEqualsToken:
    case ts.SyntaxKind.QuestionQuestionEqualsToken:
    case ts.SyntaxKind.MinusEqualsToken:
    case ts.SyntaxKind.SlashEqualsToken:
    case ts.SyntaxKind.QuestionQuestionToken:
    case ts.SyntaxKind.GreaterThanGreaterThanEqualsToken:
    case ts.SyntaxKind.GreaterThanGreaterThanToken:
    case ts.SyntaxKind.LessThanLessThanEqualsToken:
    case ts.SyntaxKind.LessThanLessThanToken:
    case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken:
    case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanToken:
      return undefined
  }
}
