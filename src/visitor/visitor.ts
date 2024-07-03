import ts from 'typescript'
import { DeliberateAny } from '../typescript-helpers'
import { logger, logPuyaExceptions } from '../logger'
import { getNodeName, MapBaseType, SyntaxKindName, SyntaxKindNameType } from './syntax-names'
import { BaseContext } from '../awst_build/context'
import { AwstBuildFailureError } from '../errors'

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
  const sourceLocation = visitor.context.getSourceLocation(node)
  if (node.kind in SyntaxKindName) {
    const nodeName = getNodeName(node)
    const visitFunction = `visit${nodeName}`
    if (visitFunction in Object.getPrototypeOf(visitor)) {
      const result = logPuyaExceptions(() => Object.getPrototypeOf(visitor)[visitFunction].call(visitor, node), sourceLocation)
      if (result !== undefined) return result
    } else {
      logger.error(sourceLocation, `Unsupported syntax visitor ${nodeName}`)
    }
  } else {
    logger.error(sourceLocation, `Unknown syntax kind ${node.kind}`)
  }
  throw new AwstBuildFailureError()
}
