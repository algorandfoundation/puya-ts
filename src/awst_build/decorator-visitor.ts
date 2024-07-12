import { BaseVisitor } from './base-visitor'
import { SourceFileContext } from './context'
import ts from 'typescript'
import { ARC4CreateOption, OnCompletionAction } from '../awst/arc4'
import { accept } from '../visitor/visitor'
import { invariant } from '../util'
import { DecoratorDataBuilder } from './eb/arc4-bare-method-decorator-builder'
import { SourceLocation } from '../awst/source-location'

export type DecoratorData =
  | {
      type: 'arc4.baremethod'
      create: ARC4CreateOption
      ocas: OnCompletionAction[]
      sourceLocation: SourceLocation
    }
  | {
      type: 'arc4.abimethod'
      create: ARC4CreateOption
      ocas: OnCompletionAction[]
      sourceLocation: SourceLocation
      readonly: boolean
      nameOverride?: string
    }

export class DecoratorVisitor extends BaseVisitor<SourceFileContext> {
  private accept = <TNode extends ts.Node>(node: TNode) => accept<DecoratorVisitor, TNode>(this, node)

  public readonly result: DecoratorData

  constructor(context: SourceFileContext, node: ts.Decorator) {
    super(context)

    const expr = this.accept(node.expression)
    invariant(expr instanceof DecoratorDataBuilder, 'expr must be DecoratorDataBuilder')
    this.result = expr.resolveDecoratorData()
  }

  static buildDecoratorData(context: SourceFileContext, node: ts.Decorator): DecoratorData {
    return new DecoratorVisitor(context, node).result
  }
}
