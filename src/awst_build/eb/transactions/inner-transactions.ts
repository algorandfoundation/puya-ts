import type ts from 'typescript'
import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { invariant } from '../../../util'
import type { PType } from '../../ptypes'
import { InnerTransactionPType, uint64PType } from '../../ptypes'
import type { TxnFieldMetaData } from '../../txn-fields'
import { getTxnFieldMetaData } from '../../txn-fields'
import { instanceEb } from '../../type-registry'
import type { NodeBuilder } from '../index'
import { FunctionBuilder, InstanceExpressionBuilder } from '../index'
import { parseFunctionArgs } from '../util/arg-parsing'

export class InnerTransactionExpressionBuilder extends InstanceExpressionBuilder<InnerTransactionPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof InnerTransactionPType, 'ptype must be InnerTransactionPType')
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
          nodeFactory.innerTransactionField({
            sourceLocation,
            itxn: this.resolve(),
            arrayIndex: null,
            field: data.field,
            wtype: data.ptype.wtypeOrThrow,
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
      nodeFactory.innerTransactionField({
        sourceLocation,
        itxn: this.gtxn,
        arrayIndex: index.resolve(),
        field: this.config.txnData.field,
        wtype: this.config.txnData.ptype.wtypeOrThrow,
      }),
      this.config.txnData.ptype,
    )
  }
}
