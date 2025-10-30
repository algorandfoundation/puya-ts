import type ts from 'typescript'
import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import type { PType } from '../../ptypes'
import { numberPType, uint64PType } from '../../ptypes'
import { instanceEb } from '../../type-registry'
import type { NodeBuilder } from '../index'
import { FunctionBuilder } from '../index'
import { OptionalExpressionBuilder } from '../optional-expression-builder'
import { parseFunctionArgs } from '../util/arg-parsing'
import { translateNegativeIndex } from '../util/translate-negative-index'

export class AtFunctionBuilder extends FunctionBuilder {
  constructor(
    private expr: Expression,
    private itemPType: PType,
    private exprLength: Expression | bigint,
    sourceLocation: SourceLocation,
    private returnsOptional = false,
  ) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation<ts.CallExpression>): NodeBuilder {
    const {
      args: [index],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: 'at',
      argSpec: (a) => [a.required(uint64PType, numberPType)],
    })

    const result = instanceEb(
      nodeFactory.indexExpression({
        base: this.expr,
        sourceLocation: sourceLocation,
        index: translateNegativeIndex(this.exprLength, index),
        wtype: this.itemPType.wtypeOrThrow,
      }),
      this.itemPType,
    )
    return this.returnsOptional ? new OptionalExpressionBuilder(result) : result
  }
}
