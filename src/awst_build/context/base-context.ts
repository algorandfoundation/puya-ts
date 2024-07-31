import ts from 'typescript'
import { SourceLocation } from '../../awst/source-location'
import { NodeBuilder } from '../eb'
import { TypeResolver } from '../type-resolver'
import { EvaluationContext } from './evaluation-context'
import { UniqueNameResolver } from './unique-name-resolver'
import { PType } from '../ptypes'
import { undefined } from 'zod'

export abstract class BaseContext {
  #evalCtx = new EvaluationContext()

  abstract getSourceLocation(node: ts.Node): SourceLocation

  abstract getBuilderForNode(node: ts.Identifier): NodeBuilder
  abstract getPTypeForNode(node: ts.Node): PType
  abstract resolveVariableName(node: ts.Identifier): string
  // abstract get resolver(): TypeResolver

  get evaluationCtx(): EvaluationContext {
    return this.#evalCtx
  }
}

export abstract class SubContext extends BaseContext {
  #parent: BaseContext
  readonly nameResolver: UniqueNameResolver

  protected constructor(parent: BaseContext, nameResolver: UniqueNameResolver) {
    super()
    this.#parent = parent
    this.nameResolver = nameResolver
  }

  getSourceLocation(node: ts.Node): SourceLocation {
    return this.#parent.getSourceLocation(node)
  }

  getBuilderForNode(node: ts.Identifier): NodeBuilder {
    return this.#parent.getBuilderForNode(node)
  }

  getPTypeForNode(node: ts.Node): PType {
    return this.#parent.getPTypeForNode(node)
  }
  resolveVariableName(node: ts.Identifier): string {
    return this.#parent.resolveVariableName(node)
  }

  // get resolver(): TypeResolver {
  //   return this.#parent.resolver
  // }
}
