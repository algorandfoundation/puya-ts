import type ts from 'typescript'
import type { AwstBuildContext } from '../awst_build/context/awst-build-context'
import { CodeError } from '../errors'
import { patchErrorLocation } from '../logger'
import type { DeliberateAny } from '../typescript-helpers'
import type { MapBaseType, SyntaxKindNameType } from './syntax-names'
import { getNodeName, SyntaxKindName } from './syntax-names'

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

export const accept = <TSelf extends { context: AwstBuildContext }, T extends ts.Node>(
  visitor: TSelf,
  node: T,
): ReturnTypeForNode<MapBaseType<T>, TSelf> => {
  const sourceLocation = visitor.context.getSourceLocation(node)
  if (node.kind in SyntaxKindName) {
    const nodeName = getNodeName(node)
    const visitFunction = `visit${nodeName}`
    if (visitFunction in Object.getPrototypeOf(visitor)) {
      return patchErrorLocation(() => Object.getPrototypeOf(visitor)[visitFunction].call(visitor, node), sourceLocation)()
    } else {
      throw new CodeError(`Unsupported syntax visitor ${nodeName}`, { sourceLocation })
    }
  } else {
    throw new CodeError(`Unknown syntax kind ${node.kind}`, { sourceLocation })
  }
}
