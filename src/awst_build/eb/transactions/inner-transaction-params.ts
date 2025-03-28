import type { TransactionKind } from '../../../awst/models'
import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { TxnField, TxnFields } from '../../../awst/txn-fields'
import { logger } from '../../../logger'
import { codeInvariant, invariant } from '../../../util'
import type { PType } from '../../ptypes'
import { ItxnParamsPType, ObjectPType, submitGroupItxnFunction, TransactionFunctionType, TuplePType } from '../../ptypes'
import type { TxnFieldsMetaData } from '../../txn-fields'
import { anyTxnFields, txnKindToFields } from '../../txn-fields'
import { instanceEb } from '../../type-registry'
import type { InstanceBuilder, NodeBuilder } from '../index'
import { FunctionBuilder, InstanceExpressionBuilder } from '../index'
import { isStaticallyIterable, StaticIterator } from '../traits/static-iterator'
import { parseFunctionArgs } from '../util/arg-parsing'
import { resolveCompatExpression } from '../util/resolve-compat-builder'
import { InnerTransactionExpressionBuilder } from './inner-transactions'
import { getInnerTransactionType, getItxnParamsType } from './util'

export class ItxnParamsFactoryFunctionBuilder extends FunctionBuilder {
  readonly ptype: TransactionFunctionType

  constructor(sourceLocation: SourceLocation, ptype: PType) {
    super(sourceLocation)
    invariant(ptype instanceof TransactionFunctionType, 'ptype must be TransactionFunctionType')
    this.ptype = ptype
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
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
    const mappedFields = new Map<TxnField, Expression>()
    // Set default fee to 0 (transaction will be paid for from transaction group budget, rather than from the application balance)
    mappedFields.set(TxnField.Fee, nodeFactory.uInt64Constant({ value: 0n, sourceLocation }))
    if (this.ptype.kind) mappedFields.set(TxnField.TypeEnum, nodeFactory.uInt64Constant({ value: BigInt(this.ptype.kind), sourceLocation }))
    mapTransactionFields(mappedFields, initialFields, this.ptype.kind, sourceLocation)
    invariant(this.ptype.kind !== undefined, 'Cannot have untyped itxn params factory', sourceLocation)
    const fieldsType = getItxnParamsType(this.ptype.kind)

    return new ItxnParamsExpressionBuilder(
      nodeFactory.createInnerTransaction({
        fields: mappedFields,
        sourceLocation,
        wtype: fieldsType.wtype,
      }),
      fieldsType,
    )
  }
}

export function mapTransactionFields(
  mappedFields: Map<TxnField, Expression>,
  fields: InstanceBuilder,
  kind: TransactionKind | undefined,
  sourceLocation: SourceLocation,
  ignoreProps?: Set<string>,
) {
  codeInvariant(fields.ptype instanceof ObjectPType, 'fields argument must be an object type')
  const validFields: TxnFieldsMetaData = kind !== undefined ? txnKindToFields[kind] : anyTxnFields
  for (const [prop] of fields.ptype.orderedProperties()) {
    if (ignoreProps?.has(prop)) continue
    if (prop in validFields) {
      const { field: txnField, ptype: fieldType } = validFields[prop as keyof typeof validFields]
      const txnFieldData = TxnFields[txnField]
      const propValue = fields.memberAccess(prop, sourceLocation)
      if (txnField === TxnField.ApplicationArgs) {
        codeInvariant(isStaticallyIterable(propValue), 'Unsupported expression for appArgs', propValue.sourceLocation)
        mappedFields.set(
          txnField,
          nodeFactory.tupleExpression({
            items: propValue[StaticIterator]().map((i) => i.toBytes(propValue.sourceLocation)),
            sourceLocation: propValue.sourceLocation,
          }),
        )
      } else if (txnFieldData.numValues > 1) {
        if (isStaticallyIterable(propValue)) {
          mappedFields.set(
            txnField,
            nodeFactory.tupleExpression({
              items: propValue[StaticIterator]().map((i) => resolveCompatExpression(i, fieldType)),
              sourceLocation: propValue.sourceLocation,
            }),
          )
        } else if (txnFieldData.arrayPromote) {
          mappedFields.set(
            txnField,
            nodeFactory.tupleExpression({
              items: [resolveCompatExpression(propValue, fieldType)],
              sourceLocation: propValue.sourceLocation,
            }),
          )
        } else {
          logger.error(propValue.sourceLocation, `Unsupported expression for ${prop}`)
        }
      } else {
        mappedFields.set(txnField, resolveCompatExpression(propValue, fieldType))
      }
    } else {
      logger.warn(sourceLocation, `Ignoring additional property: ${prop}`)
    }
  }
}

abstract class InnerTxnFieldsMethodBuilder extends FunctionBuilder {
  constructor(
    protected builder: ItxnParamsExpressionBuilder,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }
}

class SubmitInnerTxnMethodBuilder extends InnerTxnFieldsMethodBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      funcName: 'submit',
      argSpec: () => [],
    })
    invariant(this.builder.ptype.kind !== undefined, 'Cannot have untyped itxn params type', sourceLocation)

    const transactionPType = getInnerTransactionType(this.builder.ptype.kind)
    return new InnerTransactionExpressionBuilder(
      nodeFactory.submitInnerTransaction({
        itxns: [this.builder.resolve()],
        sourceLocation,
      }),
      transactionPType,
    )
  }
}

export class SubmitItxnGroupFunctionBuilder extends FunctionBuilder {
  ptype = submitGroupItxnFunction

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const { args: itxnParams } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 1,
      callLocation: sourceLocation,
      funcName: this.typeDescription,
      argSpec: (a) => [a.required(ItxnParamsPType), ...args.slice(1).map((_) => a.required(ItxnParamsPType))],
    })
    const resultType = new TuplePType({
      items: itxnParams.map((p, i) => {
        codeInvariant(p.ptype instanceof ItxnParamsPType, `Argument ${i} must be an itxn params type`, p.sourceLocation)
        invariant(p.ptype.kind !== undefined, 'Cannot have untyped itxn params type', sourceLocation)

        return getInnerTransactionType(p.ptype.kind)
      }),
    })

    return instanceEb(
      nodeFactory.submitInnerTransaction({
        itxns: itxnParams.map((p) => p.resolve()),
        sourceLocation,
      }),
      resultType,
    )
  }
}

class SetInnerTxnMethodBuilder extends InnerTxnFieldsMethodBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [updatedFields],
    } = parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      funcName: 'set',
      argSpec: (a) => [a.required()],
    })

    const mappedFields = new Map<TxnField, Expression>()
    const fieldsType = this.builder.ptype

    mapTransactionFields(mappedFields, updatedFields, fieldsType.kind, sourceLocation)

    return new ItxnParamsExpressionBuilder(
      nodeFactory.updateInnerTransaction({
        itxn: this.builder.resolve(),
        fields: mappedFields,
        sourceLocation,
        wtype: fieldsType.wtype,
      }),
      fieldsType,
    )
  }
}
class CopyInnerTxnMethodBuilder extends InnerTxnFieldsMethodBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      funcName: 'copy',
      argSpec: () => [],
    })

    return new ItxnParamsExpressionBuilder(
      nodeFactory.copy({
        value: this.builder.resolve(),
        sourceLocation,
      }),
      this.builder.ptype,
    )
  }
}

export class ItxnParamsExpressionBuilder extends InstanceExpressionBuilder<ItxnParamsPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof ItxnParamsPType, 'ptype must be InnerTransactionFieldsPType')
    super(expr, ptype)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'submit':
        return new SubmitInnerTxnMethodBuilder(this, sourceLocation)
      case 'set':
        return new SetInnerTxnMethodBuilder(this, sourceLocation)
      case 'copy':
        return new CopyInnerTxnMethodBuilder(this, sourceLocation)
    }
    return super.memberAccess(name, sourceLocation)
  }
}
