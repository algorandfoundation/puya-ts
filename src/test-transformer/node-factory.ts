import ts from 'typescript'
import type { DeliberateAny } from '../typescript-helpers'
import { getPropertyNameAsString } from './helpers'
import type { TypeReflector } from './type-reflector'

const factory = ts.factory
export const nodeFactory = {
  importHelpers() {
    return factory.createImportDeclaration(
      undefined,
      factory.createImportClause(false, undefined, factory.createNamespaceImport(factory.createIdentifier('runtimeHelpers'))),
      factory.createStringLiteral('@algorandfoundation/algo-ts-testing/runtime-helpers'),
      undefined,
    )
  },

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

  attachMetaData(classIdentifier: ts.Identifier, method: ts.MethodDeclaration, typeReflector: TypeReflector) {
    const methodName = getPropertyNameAsString(method.name)
    const metadata = factory.createObjectLiteralExpression([
      factory.createPropertyAssignment('methodName', methodName),
      factory.createPropertyAssignment('methodSelector', methodName),
      factory.createPropertyAssignment(
        'argTypes',
        factory.createArrayLiteralExpression(method.parameters.map((p) => factory.createStringLiteral(typeReflector.reflectType(p)))),
      ),
      factory.createPropertyAssignment('returnType', factory.createStringLiteral(method.type?.getText() ?? 'n/a')),
    ])
    return factory.createExpressionStatement(
      factory.createCallExpression(
        factory.createPropertyAccessExpression(factory.createIdentifier('runtimeHelpers'), factory.createIdentifier('attachAbiMetadata')),
        undefined,
        [classIdentifier, methodName, metadata],
      ),
    )
  },
} satisfies Record<string, (...args: DeliberateAny[]) => ts.Node>
