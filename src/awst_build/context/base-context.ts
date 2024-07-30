import ts from 'typescript'
import { SourceLocation } from '../../awst/source-location'
import { NodeBuilder } from '../eb'
import { TypeResolver } from '../type-resolver'
import { EvaluationContext } from './evaluation-context'
import { awst } from '../../awst'

export abstract class BaseContext {
  abstract getSourceLocation(node: ts.Node): SourceLocation

  abstract tryResolveConstant(node: ts.Identifier): awst.ConstantDeclaration | undefined

  abstract getBuilderForNode(node: ts.Identifier): NodeBuilder

  abstract get resolver(): TypeResolver

  abstract get evaluationCtx(): EvaluationContext
}
