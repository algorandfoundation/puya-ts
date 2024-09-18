import type { InstanceBuilder, NodeBuilder } from '../index'
import { InstanceExpressionBuilder } from '../index'
import { FunctionBuilder } from '../index'
import type { SourceLocation } from '../../../awst/source-location'
import type { PType } from '../../ptypes'

import { ObjectPType } from '../../ptypes'
import { InnerTransactionFieldsPType } from '../../ptypes'
import { TransactionFunctionType } from '../../ptypes'
import { codeInvariant, invariant } from '../../../util'
import type { Expression } from '../../../awst/nodes'
import { nodeFactory } from '../../../awst/node-factory'
import { parseFunctionArgs } from '../util/arg-parsing'
import { anyTxnFields, txnKindToFields } from './txn-fields'
import { type TxnField, TxnFields } from '../../../awst/txn-fields'
import { logger } from '../../../logger'
import { requireExpressionOfType } from '../util'
import { getInnerTransactionFieldsType, getInnerTransactionType } from './util'
import { InnerTransactionExpressionBuilder } from './inner-transactions'

export class InnerTransactionFactoryFunctionBuilder extends FunctionBuilder {
  readonly ptype: TransactionFunctionType

  constructor(sourceLocation: SourceLocation, ptype: PType) {
    super(sourceLocation)
    invariant(ptype instanceof TransactionFunctionType, 'ptype must be TransactionFunctionType')
    this.ptype = ptype
  }

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [initialFields],
    } = parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      funcName: this.ptype.name,
      argSpec: (a) => [a.required()],
    })
    codeInvariant(initialFields.ptype instanceof ObjectPType, 'fields argument must be an object type')
    const mappedFields = new Map<TxnField, Expression>()
    const validFields = this.ptype.kind !== undefined ? txnKindToFields[this.ptype.kind] : anyTxnFields
    for (const [prop, propType] of initialFields.ptype.orderedProperties()) {
      if (prop in validFields) {
        const [txnField, fieldType] = validFields[prop as keyof typeof validFields]
        const txnFieldData = TxnFields[txnField]
        const propValue = initialFields.memberAccess(prop, sourceLocation)
        // TODO: Validate prop value
        mappedFields.set(txnField, requireExpressionOfType(propValue, fieldType))
      } else {
        logger.error(sourceLocation, `${prop} not in valid fields `)
      }
    }
    const fieldsType = getInnerTransactionFieldsType(this.ptype.kind)

    return new InnerTransactionFieldsExpressionBuilder(
      nodeFactory.createInnerTransaction({
        fields: mappedFields,
        sourceLocation,
        wtype: fieldsType.wtype,
      }),
      fieldsType,
    )
  }
}

abstract class InnerTxnFieldsMethodBuilder extends FunctionBuilder {
  constructor(
    protected builder: InnerTransactionFieldsExpressionBuilder,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }
}

class SubmitInnerTxnMethodBuilder extends InnerTxnFieldsMethodBuilder {
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      funcName: 'submit',
      argSpec: () => [],
    })
    const transactionPType = getInnerTransactionType(this.builder.ptype.kind)
    return new InnerTransactionExpressionBuilder(
      nodeFactory.submitInnerTransaction({
        itxns: [this.builder.resolve()],
        wtype: transactionPType.wtype,
        sourceLocation,
      }),
      transactionPType,
    )
  }
}

export class InnerTransactionFieldsExpressionBuilder extends InstanceExpressionBuilder<InnerTransactionFieldsPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof InnerTransactionFieldsPType, 'ptype must be InnerTransactionFieldsPType')
    super(expr, ptype)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'submit':
        return new SubmitInnerTxnMethodBuilder(this, sourceLocation)
    }
    return super.memberAccess(name, sourceLocation)
  }
}
