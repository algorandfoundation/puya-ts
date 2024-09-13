import type { InstanceBuilder, NodeBuilder } from '../index'
import { FunctionBuilder } from '../index'
import { InstanceExpressionBuilder } from '../index'
import type { PType } from '../../ptypes'
import { uint64PType } from '../../ptypes'
import { GroupTransactionPType } from '../../ptypes'
import type { Expression } from '../../../awst/nodes'
import { invariant } from '../../../util'
import type { SourceLocation } from '../../../awst/source-location'
import { anyTxnFields, txnKindToFields } from './txn-fields'
import type { TxnFieldData } from '../../../awst/txn-fields'
import { TxnFields } from '../../../awst/txn-fields'
import { instanceEb } from '../../type-registry'
import { nodeFactory } from '../../../awst/node-factory'
import { parseFunctionArgs } from '../util/arg-parsing'

export class GroupTransactionExpressionBuilder extends InstanceExpressionBuilder<GroupTransactionPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof GroupTransactionPType, 'ptype must be GroupTransactionPType')
    super(expr, ptype)
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

class IndexedTransactionFieldFunctionBuilder extends FunctionBuilder {
  constructor(
    private gtxn: Expression,
    private config: { txnData: TxnFieldData; returnType: PType; memberName: string },
  ) {
    super(gtxn.sourceLocation)
  }
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
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
