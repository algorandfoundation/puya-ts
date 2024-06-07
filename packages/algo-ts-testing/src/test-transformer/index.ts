import ts from 'typescript'
import { DeliberateAny } from '../../../../src/typescript-helpers'
import { supportedBinaryOpString } from './supported-binary-op-string'

const factory = ts.factory
const importHelpers = factory.createImportDeclaration(
  undefined,
  factory.createImportClause(false, undefined, factory.createNamespaceImport(factory.createIdentifier('runtimeHelpers'))),
  factory.createStringLiteral('@algorandfoundation/algo-ts-testing/runtime-helpers'),
  undefined,
)

const nodes = {
  switchableValue(x: ts.Expression) {
    return factory.createCallExpression(
      factory.createPropertyAccessExpression(factory.createIdentifier('runtimeHelpers'), factory.createIdentifier('switchableValue')),
      undefined,
      [x],
    )
  },
  binaryOp(left: ts.Expression, right: ts.Expression, op: string) {
    return factory.createCallExpression(
      factory.createPropertyAccessExpression(factory.createIdentifier('runtimeHelpers'), factory.createIdentifier('binaryOp')),
      undefined,
      [left, right, factory.createStringLiteral(op)],
    )
  },
} satisfies Record<string, (...args: DeliberateAny[]) => ts.Node>

export const puyaTsTransformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
  return (sourceFile) => {
    if (!sourceFile.fileName.endsWith('.algo.ts')) return sourceFile
    const visitor = (node: ts.Node): ts.Node => {
      return ts.visitEachChild(updateNode(node), visitor, context)
    }

    return ts.visitNode(factory.updateSourceFile(sourceFile, [importHelpers, ...sourceFile.statements]), visitor) as ts.SourceFile
  }
}

function updateNode(node: ts.Node): ts.Node {
  if (ts.isSwitchStatement(node)) {
    return factory.updateSwitchStatement(node, nodes.switchableValue(node.expression), node.caseBlock)
  }

  if (ts.isCaseClause(node)) {
    return factory.updateCaseClause(node, nodes.switchableValue(node.expression), node.statements)
  }

  if (ts.isBinaryExpression(node)) {
    const tokenText = supportedBinaryOpString(node.operatorToken.kind)
    if (tokenText) {
      return nodes.binaryOp(node.left, node.right, tokenText)
    }
  }

  return node
}
