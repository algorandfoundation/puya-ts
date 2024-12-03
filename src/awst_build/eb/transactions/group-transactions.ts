import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import type { TxnFieldData } from '../../../awst/txn-fields'
import { TxnFields } from '../../../awst/txn-fields'
import { invariant } from '../../../util'
import type { PType } from '../../ptypes'
import { GroupTransactionPType, TransactionFunctionType, uint64PType } from '../../ptypes'
import { instanceEb } from '../../type-registry'
import type { NodeBuilder } from '../index'
import { FunctionBuilder, InstanceExpressionBuilder } from '../index'
import { parseFunctionArgs } from '../util/arg-parsing'
import { anyTxnFields, txnKindToFields } from './txn-fields'
import { getGroupTransactionType } from './util'

export class GroupTransactionExpressionBuilder extends InstanceExpressionBuilder<GroupTransactionPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof GroupTransactionPType, 'ptype must be GroupTransactionPType')
    super(expr, ptype)
  }

  hasProperty(name: string): boolean {
    const txnKind = this.ptype.kind
    const fields = txnKind === undefined ? anyTxnFields : txnKindToFields[txnKind]
    return name in fields
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    const txnKind = this.ptype.kind
    const fields = txnKind === undefined ? anyTxnFields : txnKindToFields[txnKind]
    if (name in fields) {
      const [field, returnType] = fields[name as keyof typeof fields]
      const data = TxnFields[field]

      if (data.numValues === 1) {
        return instanceEb(
          nodeFactory.intrinsicCall({
            sourceLocation,
            stackArgs: [this._expr],
            immediates: [data.immediate],
            wtype: data.wtype,
            opCode: 'gtxns',
          }),
          returnType,
        )
      } else {
        return new IndexedTransactionFieldFunctionBuilder(this._expr, {
          txnData: data,
          returnType,
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

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [groupIndex],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: this.ptype.name,
      argSpec: (a) => [a.required(uint64PType)],
    })
    const txnPType = getGroupTransactionType(this.ptype.kind)

    return new GroupTransactionExpressionBuilder(
      nodeFactory.reinterpretCast({
        expr: groupIndex.resolve(),
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
    private config: { txnData: TxnFieldData; returnType: PType; memberName: string },
  ) {
    super(gtxn.sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
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
        immediates: [this.config.txnData.immediate],
        wtype: this.config.txnData.wtype,
        opCode: 'gtxnsas',
      }),
      this.config.returnType,
    )
  }
}
