import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { type TxnField, type TxnFieldData, TxnFields } from '../../../awst/txn-fields'
import { invariant } from '../../../util'
import type { PType } from '../../ptypes'
import { InnerTransactionPType, uint64PType } from '../../ptypes'
import { anyTxnFields, txnKindToFields } from '../../txn-fields'
import { instanceEb } from '../../type-registry'
import type { NodeBuilder } from '../index'
import { FunctionBuilder, InstanceExpressionBuilder } from '../index'
import { parseFunctionArgs } from '../util/arg-parsing'

export class InnerTransactionExpressionBuilder extends InstanceExpressionBuilder<InnerTransactionPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof InnerTransactionPType, 'ptype must be InnerTransactionPType')
    super(expr, ptype)
  }
  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    const txnKind = this.ptype.kind
    const fields = txnKind === undefined ? anyTxnFields : txnKindToFields[txnKind]
    if (name in fields) {
      const { field, ptype: returnType } = fields[name as keyof typeof fields]
      const data = TxnFields[field]

      if (data.numValues === 1) {
        return instanceEb(
          nodeFactory.innerTransactionField({
            sourceLocation,
            itxn: this.resolve(),
            arrayIndex: null,
            field,
            wtype: data.wtype,
          }),
          returnType,
        )
      } else {
        return new IndexedTransactionFieldFunctionBuilder(this._expr, {
          txnData: data,
          returnType,
          memberName: name,
          field,
        })
      }
    }
    return super.memberAccess(name, sourceLocation)
  }
}

class IndexedTransactionFieldFunctionBuilder extends FunctionBuilder {
  constructor(
    private gtxn: Expression,
    private config: { txnData: TxnFieldData; returnType: PType; memberName: string; field: TxnField },
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
      nodeFactory.innerTransactionField({
        sourceLocation,
        itxn: this.gtxn,
        arrayIndex: index.resolve(),
        field: this.config.field,
        wtype: this.config.txnData.wtype,
      }),
      this.config.returnType,
    )
  }
}
