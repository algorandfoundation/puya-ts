import { TransactionKind } from '../../../awst/models'
import { nodeFactory } from '../../../awst/node-factory'
import { ARC4ABIMethodConfig, type Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { TxnField } from '../../../awst/txn-fields'
import { codeInvariant, enumFromValue, invariant } from '../../../util'
import { buildArc4MethodConstant } from '../../arc4-util'
import { AwstBuildContext } from '../../context/awst-build-context'
import type { PType } from '../../ptypes'
import { anyItxnParamsType, itxnComposePType, ItxnParamsPType, ObjectPType, Uint64EnumMemberLiteralType, voidPType } from '../../ptypes'
import { getPropertyType } from '../../ptypes/visitors/index-type-visitor'
import { instanceEb } from '../../type-registry'
import { buildApplicationCallTxnFields } from '../arc4/c2c'
import { ContractMethodExpressionBuilder } from '../free-subroutine-expression-builder'
import { FunctionBuilder, NodeBuilder } from '../index'
import { parseFunctionArgs } from '../util/arg-parsing'
import { mapTransactionFields } from './inner-transaction-params'
import { getItxnParamsType } from './util'

export class ItxnComposeBuilder extends NodeBuilder {
  ptype = itxnComposePType

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'begin':
      case 'next':
        return new ItxnComposeBeginOrNextFunctionBuilder(name, sourceLocation)
      case 'submit':
        return new ItxnComposeSubmitFunctionBuilder(sourceLocation)
    }
    return super.memberAccess(name, sourceLocation)
  }
}

class ItxnComposeBeginOrNextFunctionBuilder extends FunctionBuilder {
  constructor(
    private methodCalled: 'begin' | 'next',
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }
  get typeDescription() {
    return this.methodCalled
  }

  private get startWithBegin() {
    return this.methodCalled === 'begin'
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const itxns: Expression[] = []

    if (args.length === 1) {
      // fields or itxn
      const {
        args: [itxnOrFields],
      } = parseFunctionArgs({
        args,
        typeArgs,
        genericTypeArgs: 0,
        callLocation: sourceLocation,
        funcName: this.typeDescription,
        argSpec: (a) => [a.required()],
      })
      if (itxnOrFields.ptype instanceof ItxnParamsPType) {
        itxns.push(itxnOrFields.resolve())
      } else {
        const mappedFields = new Map<TxnField, Expression>()
        // Set default fee to 0 (transaction will be paid for from transaction group budget, rather than from the application balance)
        mappedFields.set(TxnField.Fee, nodeFactory.uInt64Constant({ value: 0n, sourceLocation }))

        mapTransactionFields(mappedFields, itxnOrFields, undefined, sourceLocation)

        codeInvariant(
          itxnOrFields.ptype instanceof ObjectPType,
          `Arg 0 of ${this.typeDescription} must be an itxn params instance or an object containing itxn fields`,
          itxnOrFields.sourceLocation,
        )

        const type = getPropertyType(itxnOrFields.ptype, 'type', sourceLocation)
        let fieldsType: ItxnParamsPType
        if (type instanceof Uint64EnumMemberLiteralType) {
          const txnKind = enumFromValue(Number(type.value), TransactionKind)
          fieldsType = getItxnParamsType(txnKind)
        } else {
          fieldsType = anyItxnParamsType
        }

        itxns.push(
          nodeFactory.createInnerTransaction({
            fields: mappedFields,
            sourceLocation,
            wtype: fieldsType.wtype,
          }),
        )
      }
    } else {
      // abiCall
      const {
        args: [functionRef, fields],
      } = parseFunctionArgs({
        args,
        typeArgs,
        genericTypeArgs: 1,
        argSpec: (a) => [a.passthrough(), a.required()],
        callLocation: sourceLocation,
        funcName: this.typeDescription,
      })

      invariant(
        functionRef instanceof ContractMethodExpressionBuilder,
        `Arg 0 of ${this.typeDescription} should be an arc4 contract method`,
      )
      const {
        target: { memberName },
        contractType,
        ptype: functionType,
      } = functionRef
      const arc4Config = AwstBuildContext.current.getArc4Config(contractType, memberName)
      codeInvariant(arc4Config instanceof ARC4ABIMethodConfig, `${memberName} is not an ABI method`, functionRef.sourceLocation)
      const methodSelector = buildArc4MethodConstant(functionType, arc4Config, sourceLocation)

      itxns.push(
        ...buildApplicationCallTxnFields({
          arc4Config,
          methodSelector,
          fields,
          sourceLocation,
          functionType,
        }),
      )
    }
    return instanceEb(
      nodeFactory.setInnerTransactionFields({
        itxns,
        startWithBegin: this.startWithBegin,
        sourceLocation,
        wtype: voidPType.wtype,
      }),
      voidPType,
    )
  }
}

class ItxnComposeSubmitFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      argSpec: () => [],
      funcName: 'submit',
    })
    return instanceEb(
      nodeFactory.intrinsicCall({
        opCode: 'itxn_submit',
        stackArgs: [],
        immediates: [],
        wtype: voidPType.wtype,
        sourceLocation,
      }),
      voidPType,
    )
  }
}
