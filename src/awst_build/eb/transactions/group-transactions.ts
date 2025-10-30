import type ts from 'typescript'
import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import { IntegerConstant } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { Constants } from '../../../constants'
import { logger } from '../../../logger'
import { invariant } from '../../../util'
import type { PType } from '../../ptypes'
import { GroupTransactionPType, TransactionFunctionType, uint64PType } from '../../ptypes'
import type { TxnFieldMetaData } from '../../txn-fields'
import { getTxnFieldMetaData } from '../../txn-fields'
import { instanceEb } from '../../type-registry'
import type { NodeBuilder } from '../index'
import { FunctionBuilder, InstanceExpressionBuilder } from '../index'
import { parseFunctionArgs } from '../util/arg-parsing'
import { getGroupTransactionType } from './util'

export class GroupTransactionExpressionBuilder extends InstanceExpressionBuilder<GroupTransactionPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof GroupTransactionPType, 'ptype must be GroupTransactionPType')
    super(expr, ptype)
  }

  hasProperty(name: string): boolean {
    return getTxnFieldMetaData({ kind: this.ptype.kind, memberName: name }) !== false
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    const data = getTxnFieldMetaData({ kind: this.ptype.kind, memberName: name })
    if (data) {
      if (data.indexable !== true) {
        return instanceEb(
          nodeFactory.intrinsicCall({
            sourceLocation,
            stackArgs: [this._expr],
            immediates: [data.field],
            wtype: data.ptype.wtypeOrThrow,
            opCode: 'gtxns',
          }),
          data.ptype,
        )
      } else {
        return new IndexedTransactionFieldFunctionBuilder(this._expr, {
          txnData: data,
          memberName: name,
        })
      }
    }
    return super.memberAccess(name, sourceLocation)
  }
}

export class GroupTransactionFunctionBuilder extends FunctionBuilder {
  readonly ptype: TransactionFunctionType

  constructor(sourceLocation: SourceLocation, ptype: PType) {
    super(sourceLocation)
    invariant(ptype instanceof TransactionFunctionType, 'ptype must be instance of TransactionFunctionType')
    this.ptype = ptype
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation<ts.CallExpression>): NodeBuilder {
    const {
      args: [groupIndexBuilder],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: this.ptype.name,
      argSpec: (a) => [a.required(uint64PType)],
    })
    const txnPType = getGroupTransactionType(this.ptype.kind)
    const groupIndex = groupIndexBuilder.resolve()
    if (groupIndex instanceof IntegerConstant && groupIndex.value >= Constants.algo.maxTransactionGroupSize) {
      logger.error(groupIndex.sourceLocation, `transaction group index should be less than ${Constants.algo.maxTransactionGroupSize}`)
    }

    return new GroupTransactionExpressionBuilder(
      nodeFactory.groupTransactionReference({
        index: groupIndex,
        wtype: txnPType.wtype,
        sourceLocation,
      }),
      txnPType,
    )
  }
}

class IndexedTransactionFieldFunctionBuilder extends FunctionBuilder {
  constructor(
    private gtxn: Expression,
    private config: { txnData: TxnFieldMetaData; memberName: string },
  ) {
    super(gtxn.sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation<ts.CallExpression>): NodeBuilder {
    const {
      args: [index],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: this.config.memberName,
      argSpec: (a) => [a.required(uint64PType)],
    })

    return instanceEb(
      nodeFactory.intrinsicCall({
        sourceLocation,
        stackArgs: [this.gtxn, index.resolve()],
        immediates: [this.config.txnData.field],
        wtype: this.config.txnData.ptype.wtypeOrThrow,
        opCode: 'gtxnsas',
      }),
      this.config.txnData.ptype,
    )
  }
}
