import ts from 'typescript'
import { logger } from '../../logger'
import { invariant, isIn } from '../../util'
import { accept } from '../../visitor/visitor'
import { AwstBuildContext } from '../context/awst-build-context'
import { DecoratorDataBuilder } from '../eb'
import type {
  Arc4AbiDecoratorData,
  Arc4BareDecoratorData,
  DecoratorData,
  DecoratorDataForType,
  DecoratorType,
  ReadonlyDecoratorData,
  RoutingDecoratorData,
} from '../models/decorator-data'
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
          invariant(e instanceof Error, 'Only errors should be thrown')
          logger.error(e)
          return []
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
  static buildContractMethodData(target: ts.MethodDeclaration): RoutingDecoratorData | undefined {
    let abiDecorator: Arc4AbiDecoratorData | undefined = undefined
    let bareDecorator: Arc4BareDecoratorData | undefined = undefined
    let readonlyDecorator: ReadonlyDecoratorData | undefined = undefined
    for (const data of DecoratorVisitor.buildDecoratorData(target)) {
      switch (data.type) {
        case 'arc4.abimethod':
          if (abiDecorator) {
            logger.error(
              data.sourceLocation,
              'Only one abimethod decorator is allowed per method. Multiple on complete actions can be provided in a single decorator',
            )
          } else if (bareDecorator) {
            logger.error(data.sourceLocation, 'abimethod and baremethod decorators can not be combined on the one method')
          } else {
            abiDecorator = data
          }
          break
        case 'arc4.baremethod':
          if (bareDecorator) {
            logger.error(
              data.sourceLocation,
              'Only one baremethod decorator is allowed per method. Multiple on complete actions can be provided in a single decorator',
            )
          } else if (abiDecorator) {
            logger.error(data.sourceLocation, 'abimethod and baremethod decorators can not be combined on the one method')
          } else {
            bareDecorator = data
          }
          break
        case 'arc4.readonly':
          if (readonlyDecorator) {
            logger.error(data.sourceLocation, 'Only one readonly decorator is allowed per method')
          } else {
            readonlyDecorator = data
          }
          break
        default:
          logger.error(data.sourceLocation, `${data.type} is not supported on contract methods`)
      }
    }
    if (abiDecorator) {
      if (readonlyDecorator) {
        if (abiDecorator.readonly === false) {
          logger.error(
            readonlyDecorator.sourceLocation,
            'abimethod decorator readonly config conflicts with presence of readonly decorator',
          )
        } else {
          abiDecorator.readonly = true
        }
      }
      return abiDecorator
    } else if (bareDecorator) {
      if (readonlyDecorator) {
        logger.error(readonlyDecorator.sourceLocation, 'baremethod cannot be annotated with readonly decorator')
      }
      return bareDecorator
    } else if (readonlyDecorator) {
      return readonlyDecorator
    }
    return undefined
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
