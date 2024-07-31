import { BaseVisitor } from './base-visitor'
import { SourceFileContext } from './source-file-context'
import ts from 'typescript'
import { ARC4CreateOption, OnCompletionAction } from '../awst/models'
import { accept } from '../visitor/visitor'
import { invariant } from '../util'
import { DecoratorDataBuilder } from './eb/arc4-bare-method-decorator-builder'
import { SourceLocation } from '../awst/source-location'
import { Constants } from '../constants'
import { BaseContext } from './context/base-context'

export type Arc4AbiDecoratorData = {
  type: typeof Constants.arc4AbiDecoratorName
  create: ARC4CreateOption
  ocas: OnCompletionAction[]
  sourceLocation: SourceLocation
  readonly: boolean
  nameOverride: string | undefined
  defaultArguments: Record<
    string,
    | {
        type: 'constant'
        value: string | boolean | bigint | Uint8Array
      }
    | {
        type: 'member'
        name: string
      }
  >
}

export type Arc4BareDecoratorData = {
  type: typeof Constants.arc4BareDecoratorName
  create: ARC4CreateOption
  ocas: OnCompletionAction[]
  sourceLocation: SourceLocation
}

export type DecoratorData = Arc4BareDecoratorData | Arc4AbiDecoratorData

export class DecoratorVisitor extends BaseVisitor<BaseContext> {
  private accept = <TNode extends ts.Node>(node: TNode) => accept<DecoratorVisitor, TNode>(this, node)

  public readonly result: DecoratorData

  constructor(context: BaseContext, node: ts.Decorator) {
    super(context)

    const expr = this.accept(node.expression)
    invariant(expr instanceof DecoratorDataBuilder, 'expr must be DecoratorDataBuilder')
    this.result = expr.resolveDecoratorData()
  }

  static buildDecoratorData(context: BaseContext, node: ts.Decorator): DecoratorData {
    return new DecoratorVisitor(context, node).result
  }
}
