import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import { UInt64BinaryOperator } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import type { WType } from '../../../awst/wtypes'
import { logger } from '../../../logger'
import type { PType } from '../../ptypes'
import { numberPType, uint64PType } from '../../ptypes'
import { instanceEb } from '../../type-registry'
import { FunctionBuilder, type InstanceBuilder } from '../index'
import { getBigIntOrUint64Expr } from '../util'
import { parseFunctionArgs } from '../util/arg-parsing'

export class AtFunctionBuilder extends FunctionBuilder {
  constructor(
    private expr: Expression,
    private itemPType: PType & { wtype: WType },
    private exprLength: Expression | bigint,
  ) {
    super(expr.sourceLocation)
  }

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation) {
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

    const indexParam = getBigIntOrUint64Expr(index)
    let indexExpr: Expression

    if (typeof indexParam === 'bigint') {
      if (typeof this.exprLength === 'bigint') {
        let indexValue = indexParam < 0 ? this.exprLength + indexParam : indexParam
        if (indexValue < 0n || indexValue >= this.exprLength) {
          logger.warn(index.sourceLocation, 'Index access out of bounds')
          indexValue = 0n
        }
        indexExpr = nodeFactory.uInt64Constant({
          value: indexValue,
          sourceLocation: index.sourceLocation,
        })
      } else {
        indexExpr = nodeFactory.uInt64BinaryOperation({
          op: UInt64BinaryOperator.sub,
          left: this.exprLength,
          right: nodeFactory.uInt64Constant({
            value: indexParam * -1n,
            sourceLocation: index.sourceLocation,
          }),
          sourceLocation: index.sourceLocation,
        })
      }
    } else {
      indexExpr = indexParam
    }

    return instanceEb(
      nodeFactory.indexExpression({
        base: this.expr,
        sourceLocation: sourceLocation,
        index: indexExpr,
        wtype: this.itemPType.wtype,
      }),
      this.itemPType,
    )
  }
}