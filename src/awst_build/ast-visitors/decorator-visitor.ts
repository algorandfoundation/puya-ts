import ts from 'typescript'
import { AwstBuildFailureError } from '../../errors'
import { logger } from '../../logger'
import { invariant, isIn } from '../../util'
import { accept } from '../../visitor/visitor'
import { AwstBuildContext } from '../context/awst-build-context'
import { DecoratorDataBuilder } from '../eb'
import type { DecoratorData, DecoratorDataForType, DecoratorType } from '../models/decorator-data'
import { BaseVisitor } from './base-visitor'

export class DecoratorVisitor extends BaseVisitor {
  private accept = <TNode extends ts.Node>(node: TNode) => accept<DecoratorVisitor, TNode>(this, node)

  public readonly result: DecoratorData

  constructor(node: ts.Decorator) {
    super()

    const expr = this.accept(node.expression)
    invariant(expr instanceof DecoratorDataBuilder, 'expr must be DecoratorDataBuilder')
    this.result = expr.resolveDecoratorData()
  }

  private static buildDecoratorData(node: { modifiers?: ts.NodeArray<ts.ModifierLike> }): DecoratorData[] {
    return (
      node.modifiers?.flatMap((modifier) => {
        if (!ts.isDecorator(modifier)) return []
        try {
          return AwstBuildContext.current.runInChildContext(() => new DecoratorVisitor(modifier).result)
        } catch (e) {
          if (e instanceof AwstBuildFailureError) {
            return []
          }
          throw e
        }
      }) ?? []
    )
  }

  static buildContractData(target: ts.ClassDeclaration) {
    const data = DecoratorVisitor.buildDecoratorData(target)
    return DecoratorVisitor.filterDecoratorData(
      data,
      ['contract'],
      (t) => `${t} is not supported on contracts`,
      'Only one decorator is allowed per contract.',
    )
  }
  static buildLogicSigData(target: ts.ClassDeclaration) {
    const data = DecoratorVisitor.buildDecoratorData(target)
    return DecoratorVisitor.filterDecoratorData(
      data,
      ['logicsig'],
      (t) => `${t} is not supported on logic signatures`,
      'Only one decorator is allowed per logic signature.',
    )
  }
  static buildContractMethodData(target: ts.MethodDeclaration) {
    const data = DecoratorVisitor.buildDecoratorData(target)
    return DecoratorVisitor.filterDecoratorData(
      data,
      ['arc4.abimethod', 'arc4.baremethod'],
      (t) => `${t} is not supported on contract methods`,
      'Only one decorator is allowed per method. Multiple on complete actions can be provided in a single decorator',
    )
  }

  private static filterDecoratorData<TType extends DecoratorType>(
    decoratorData: DecoratorData[],
    types: TType[],
    notSupportedMessage: (type: DecoratorType) => string,
    duplicateMessage: string,
  ): DecoratorDataForType<TType> | undefined {
    let data: DecoratorDataForType<TType> | undefined
    for (const d of decoratorData) {
      if (isIn(d.type, types)) {
        if (data === undefined) {
          data = d as DecoratorDataForType<TType>
        } else {
          logger.error(d.sourceLocation, duplicateMessage)
        }
      } else {
        logger.error(d.sourceLocation, notSupportedMessage(d.type))
      }
    }
    return data
  }
}
