import ts, { BindingPattern, PropertyName } from 'typescript'
import { DeliberateAny, Expand } from '../typescript-helpers'
import { logger, logPuyaExceptions } from '../logger'
import { getNodeName, LiteralExpressions, MapBaseType, SyntaxKindName, SyntaxKindNameType } from './syntax-names'
import { CodeError, NotSupported, PuyaError, TodoError } from '../errors'
import { BaseContext, SourceFileContext } from '../awst_build/context'
import * as awst from '../awst/nodes'
import { SourceLocation } from '../awst/source-location'
import { nodeFactory } from '../awst/node-factory'
import { wtypes } from '../awst'

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

export abstract class BaseVisitor<TContext extends BaseContext> implements Visitor<LiteralExpressions, awst.Literal> {
  constructor(public context: TContext) {}

  visitBigIntLiteral(node: ts.BigIntLiteral): awst.Literal {
    return nodeFactory.literal({
      value: BigInt(node.text.slice(0, -1)),
      sourceLocation: this.sourceLocation(node),
    })
  }

  visitRegularExpressionLiteral(node: ts.RegularExpressionLiteral): awst.Literal {
    throw new NotSupported('Regular expressions', {
      sourceLocation: this.sourceLocation(node),
    })
  }

  visitFalseKeyword(node: ts.FalseLiteral): awst.Literal {
    return nodeFactory.boolConstant({
      sourceLocation: this.sourceLocation(node),
      value: false,
    })
  }
  visitTrueKeyword(node: ts.TrueLiteral): awst.Literal {
    return nodeFactory.boolConstant({
      sourceLocation: this.sourceLocation(node),
      value: true,
    })
  }

  sourceLocation(node: ts.Node): SourceLocation {
    return this.context.getSourceLocation(node)
  }

  visitStringLiteral(node: ts.StringLiteral): awst.Literal {
    return new awst.Literal({
      sourceLocation: this.context.getSourceLocation(node),
      value: node.text,
    })
  }
  visitNoSubstitutionTemplateLiteral(node: ts.NoSubstitutionTemplateLiteral): awst.Literal {
    return new awst.Literal({
      sourceLocation: this.context.getSourceLocation(node),
      value: node.text,
    })
  }
  visitNumericLiteral(node: ts.NumericLiteral): awst.Literal {
    return new awst.Literal({
      sourceLocation: this.context.getSourceLocation(node),
      value: BigInt(node.text),
    })
  }
}
