import ts from 'typescript'
import { DeliberateAny } from '../typescript-helpers'
import { logger, logPuyaExceptions } from '../logger'
import { getNodeName, LiteralExpressions, MapBaseType, SyntaxKindName, SyntaxKindNameType } from './syntax-names'
import { NotSupported } from '../errors'
import { BaseContext } from '../awst_build/context'
import { SourceLocation } from '../awst/source-location'
import { InstanceBuilder } from '../awst_build/eb'
import { LiteralExpressionBuilder } from '../awst_build/eb/literal-expression-builder'

type UnionToIntersection<T> = (T extends DeliberateAny ? (x: T) => void : never) extends (x: infer TIntersection) => void
  ? TIntersection
  : never

export type Visitor<T extends { kind: ts.SyntaxKind }, TReturn> = UnionToIntersection<
  T extends DeliberateAny
    ? { [key in T['kind'] as key extends keyof SyntaxKindNameType ? `visit${SyntaxKindNameType[key]}` : never]: (node: T) => TReturn }
    : never
>

/**
 * This type relies on `T` being a concrete node with a `kind` property that is resolved to a single `SyntaxKind`.
 * There are lots of nodes (such as ts.Expression) which are base types for several nodes which means this type
 * will return `typeof SyntaxKind` instead of `typeof SyntaxKind.someValue` and that will break the rest of the
 * generic types here. `MapBaseType<TNode>` exists to convert these base types into a union of their concrete implementors
 */
export type KindForNode<T extends ts.Node> = T extends { kind: infer TKind } ? TKind : never

export type VisitorMethod<TKind> = TKind extends keyof SyntaxKindNameType ? `visit${SyntaxKindNameType[TKind]}` : never

export type MethodReturnType<TMethod, TVisitor> = TMethod extends keyof TVisitor
  ? TVisitor[TMethod] extends (...args: DeliberateAny[]) => infer TReturn
    ? TReturn
    : never
  : never

export type ReturnTypeForNode<T extends ts.Node, TVisitor> = MethodReturnType<VisitorMethod<KindForNode<T>>, TVisitor>

export const accept = <TSelf extends { context: BaseContext }, T extends ts.Node>(
  visitor: TSelf,
  node: T,
): ReturnTypeForNode<MapBaseType<T>, TSelf> => {
  if (node.kind in SyntaxKindName) {
    const nodeName = getNodeName(node)
    const visitFunction = `visit${nodeName}`
    const sourceLocation = visitor.context.getSourceLocation(node)
    if (visitFunction in Object.getPrototypeOf(visitor)) {
      return logPuyaExceptions(() => Object.getPrototypeOf(visitor)[visitFunction].call(visitor, node), sourceLocation)
    } else {
      logger.error(sourceLocation, `Unsupported syntax visitor ${nodeName}`)
    }
  }
  // Return a value so the visitor can keep traversing and potentially discover more errors
  return {} as DeliberateAny
}

export abstract class BaseVisitor<TContext extends BaseContext> implements Visitor<LiteralExpressions, InstanceBuilder> {
  constructor(public context: TContext) {}

  visitBigIntLiteral(node: ts.BigIntLiteral): InstanceBuilder {
    return new LiteralExpressionBuilder(BigInt(node.text.slice(0, -1)), this.sourceLocation(node))
  }

  visitRegularExpressionLiteral(node: ts.RegularExpressionLiteral): InstanceBuilder {
    throw new NotSupported('Regular expressions', {
      sourceLocation: this.sourceLocation(node),
    })
  }

  visitFalseKeyword(node: ts.FalseLiteral): InstanceBuilder {
    return new LiteralExpressionBuilder(false, this.sourceLocation(node))
  }

  visitTrueKeyword(node: ts.TrueLiteral): InstanceBuilder {
    return new LiteralExpressionBuilder(true, this.sourceLocation(node))
  }

  sourceLocation(node: ts.Node): SourceLocation {
    return this.context.getSourceLocation(node)
  }

  visitStringLiteral(node: ts.StringLiteral): InstanceBuilder {
    return new LiteralExpressionBuilder(node.text, this.sourceLocation(node))
  }

  visitNoSubstitutionTemplateLiteral(node: ts.NoSubstitutionTemplateLiteral): InstanceBuilder {
    return new LiteralExpressionBuilder(node.text, this.sourceLocation(node))
  }

  visitNumericLiteral(node: ts.NumericLiteral): InstanceBuilder {
    return new LiteralExpressionBuilder(BigInt(node.text), this.sourceLocation(node))
  }
}
