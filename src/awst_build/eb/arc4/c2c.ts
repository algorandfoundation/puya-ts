import { OnCompletionAction, TransactionKind } from '../../../awst/models'
import { nodeFactory } from '../../../awst/node-factory'
import type { ARC4MethodConfig, Expression, MethodConstant, SubmitInnerTransaction } from '../../../awst/nodes'
import { ARC4ABIMethodConfig, ARC4BareMethodConfig, ARC4CreateOption, CompiledContract, IntegerConstant } from '../../../awst/nodes'
import { SourceLocation } from '../../../awst/source-location'
import { TxnField } from '../../../awst/txn-fields'
import { wtypes } from '../../../awst/wtypes'
import { Constants } from '../../../constants'
import { logger } from '../../../logger'
import { codeInvariant, enumFromValue, hexToUint8Array, invariant } from '../../../util'
import { getArc4MethodConstant, ptypeToArc4EncodedType } from '../../arc4-util'
import { AwstBuildContext } from '../../context/awst-build-context'
import type { FunctionPType, PType } from '../../ptypes'
import { applicationCallItxnParamsType, applicationItxnType, bytesPType, compiledContractType, voidPType } from '../../ptypes'
import {
  abiCallFunction,
  compileArc4Function,
  ContractProxyGeneric,
  ContractProxyType,
  TypedApplicationCallResponseGeneric,
} from '../../ptypes/arc4-types'
import { instanceEb } from '../../type-registry'
import { CompileFunctionBuilder } from '../compiled/compile-function'
import { ContractMethodExpressionBuilder } from '../free-subroutine-expression-builder'
import type { InstanceBuilder } from '../index'
import { FunctionBuilder, InstanceExpressionBuilder, NodeBuilder } from '../index'
import { isStaticallyIterable, StaticIterator } from '../traits/static-iterator'
import { mapTransactionFields } from '../transactions/inner-transaction-params'
import { txnFieldName } from '../transactions/txn-fields'
import { requireInstanceBuilder } from '../util'
import { parseFunctionArgs } from '../util/arg-parsing'
import { validatePrefix } from './util'

export class AbiCallFunctionBuilder extends FunctionBuilder {
  readonly ptype = abiCallFunction

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [functionRef, fields],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 2,
      argSpec: (a) => [a.passthrough(), a.required()],
      callLocation: sourceLocation,
      funcName: this.typeDescription,
    })

    invariant(functionRef instanceof ContractMethodExpressionBuilder, `Arg 0 of ${this.typeDescription} should be an arc4 contract method`)
    const {
      target: { memberName },
      contractType,
      ptype: functionType,
    } = functionRef
    const arc4Config = AwstBuildContext.current.getArc4Config(contractType, memberName)
    codeInvariant(arc4Config instanceof ARC4ABIMethodConfig, `${memberName} is not an ABI method`, functionRef.sourceLocation)
    const methodSelector = getArc4MethodConstant(functionType, arc4Config, sourceLocation)

    const itxnResult = makeApplicationCall({
      fields,
      methodSelector: methodSelector,
      functionType,
      arc4Config,
      sourceLocation,
    })
    return formatApplicationCallResponse({ itxnResult, functionType, sourceLocation })
  }
}

export class CompileArc4FunctionBuilder extends CompileFunctionBuilder {
  readonly ptype = compileArc4Function

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const result = requireInstanceBuilder(super.call(args, [], sourceLocation)).resolve()
    codeInvariant(result instanceof CompiledContract, `${this.typeDescription} expects a contract type`, sourceLocation)
    const proxyType = ContractProxyGeneric.parameterise([...typeArgs])
    return new ContractProxyExpressionBuilder(result, proxyType)
  }
}

export class ContractProxyExpressionBuilder extends InstanceExpressionBuilder<ContractProxyType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof ContractProxyType, 'ptype must be instance of ContractProxyType')
    super(expr, ptype)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'call':
        return new ContractProxyCallBuilder(this, sourceLocation)
      case 'bareCreate':
        return new ContractProxyBareCreateFunctionBuilder(this, sourceLocation)
    }
    if (name in compiledContractType.properties) {
      return instanceEb(
        nodeFactory.fieldExpression({
          base: this._expr,
          name,
          wtype: compiledContractType.properties[name].wtypeOrThrow,
          sourceLocation,
        }),
        compiledContractType.properties[name],
      )
    }

    return super.memberAccess(name, sourceLocation)
  }
}

export class ContractProxyBareCreateFunctionBuilder extends FunctionBuilder {
  constructor(
    private readonly proxy: ContractProxyExpressionBuilder,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [fields],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      funcName: 'bareCreate',
      argSpec: (a) => [a.optional()],
      callLocation: sourceLocation,
    })
    const arc4Configs = AwstBuildContext.current.getArc4Config(this.proxy.ptype.contractType)
    const createConfigs = arc4Configs.filter((c) => c.create !== ARC4CreateOption.disallow)
    const bareCreate = createConfigs.find((c) => c instanceof ARC4BareMethodConfig)
    if (createConfigs.length && !bareCreate) {
      logger.error(sourceLocation, `${this.proxy.ptype.contractType} has no bare create method`)
    }

    const itxnResult = makeApplicationCall({
      arc4Config:
        bareCreate ??
        new ARC4BareMethodConfig({
          allowedCompletionTypes: [OnCompletionAction.NoOp],
          create: ARC4CreateOption.require,
          sourceLocation: SourceLocation.None,
        }),
      sourceLocation,
      methodSelector: null,
      functionType: null,
      fields,
      proxy: this.proxy,
    })

    return instanceEb(itxnResult, applicationItxnType)
  }
}
export class ContractProxyCallBuilder extends NodeBuilder {
  readonly ptype = undefined

  constructor(
    private readonly proxy: ContractProxyExpressionBuilder,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }
  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    const maybeFunction = this.proxy.ptype.contractType.methods[name]
    if (maybeFunction) {
      return new ContractProxyCallFunctionBuilder(this.proxy, maybeFunction, sourceLocation)
    }

    return super.memberAccess(name, sourceLocation)
  }
}

export class ContractProxyCallFunctionBuilder extends FunctionBuilder {
  constructor(
    private readonly proxy: ContractProxyExpressionBuilder,
    private readonly functionType: FunctionPType,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [fields],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      funcName: this.functionType.name,
      argSpec: (a) => [a.optional()],
      callLocation: sourceLocation,
    })

    const arc4Config = AwstBuildContext.current.getArc4Config(this.proxy.ptype.contractType, this.functionType.name)
    codeInvariant(arc4Config, `${this.functionType.name} is not callable`)

    const methodSelector =
      arc4Config instanceof ARC4ABIMethodConfig ? getArc4MethodConstant(this.functionType, arc4Config, sourceLocation) : null

    return formatApplicationCallResponse({
      itxnResult: makeApplicationCall({
        proxy: this.proxy,
        arc4Config: arc4Config,
        functionType: this.functionType,
        methodSelector,
        fields,
        sourceLocation,
      }),
      functionType: this.functionType,
      sourceLocation,
    })
  }
}
const typedAppCallIgnoredFields = new Set(['args', 'appArgs'])

function makeApplicationCall({
  sourceLocation,
  fields,
  arc4Config,
  proxy,
  methodSelector,
  functionType,
}: {
  proxy?: InstanceBuilder
  fields?: InstanceBuilder
  functionType: FunctionPType | null
  arc4Config: ARC4MethodConfig
  methodSelector: MethodConstant | null
  sourceLocation: SourceLocation
}): SubmitInnerTransaction {
  const mappedFields = new Map<TxnField, Expression>([
    // Set default fee to 0 (transaction will be paid for from transaction group budget, rather than from the application balance)
    [TxnField.Fee, nodeFactory.uInt64Constant({ value: 0n, sourceLocation })],
    [TxnField.TypeEnum, nodeFactory.uInt64Constant({ value: 6n, sourceLocation, tealAlias: 'appl' })],
  ])

  // Map any explicitly provided fields
  if (fields) {
    mapTransactionFields(mappedFields, fields, TransactionKind.appl, sourceLocation, typedAppCallIgnoredFields)
  }
  // Add implicit fields
  if (proxy) {
    // Create a copy of the fields
    const implicitFields = getImplicitFields({ proxy, mappedFields, sourceLocation, methodConfig: arc4Config })
    // Only add fields that aren't explicitly provided
    for (const [key, expr] of implicitFields) {
      if (!mappedFields.has(key)) {
        mappedFields.set(key, expr)
      }
    }
  }
  // Add app args by merging provided args with method selector
  if (arc4Config instanceof ARC4ABIMethodConfig) {
    invariant(methodSelector && functionType, 'methodSelector and functionType both required for abi calls')
    addAppArgs({ fields, methodSelector, mappedFields, sourceLocation, functionType })
  }
  // Build itxn and submit
  const itxn = nodeFactory.createInnerTransaction({
    fields: mappedFields,
    sourceLocation,
    wtype: applicationCallItxnParamsType.wtype,
  })

  return nodeFactory.submitInnerTransaction({
    itxns: [itxn],
    wtype: applicationItxnType.wtype,
    sourceLocation,
  })
}

function formatApplicationCallResponse({
  itxnResult,
  functionType,
  sourceLocation,
}: {
  itxnResult: SubmitInnerTransaction
  functionType: FunctionPType
  sourceLocation: SourceLocation
}) {
  if (functionType.returnType.equals(voidPType)) {
    const responseType = TypedApplicationCallResponseGeneric.parameterise([voidPType])
    return instanceEb(
      nodeFactory.tupleExpression({
        items: [itxnResult],
        sourceLocation,
        wtype: responseType.wtype,
      }),
      responseType,
    )
  }

  // Extract return value and return
  const itxnSingle = nodeFactory.singleEvaluation({ source: itxnResult })

  const responseType = TypedApplicationCallResponseGeneric.parameterise([functionType.returnType])
  const returnValue = getReturnValueExpr(itxnSingle, functionType.returnType, sourceLocation)
  return instanceEb(
    nodeFactory.tupleExpression({
      items: [itxnSingle, returnValue],
      sourceLocation,
      wtype: responseType.wtype,
    }),
    responseType,
  )
}

function getImplicitFields({
  proxy,
  methodConfig,
  mappedFields,
  sourceLocation,
}: {
  proxy: InstanceBuilder
  methodConfig: ARC4ABIMethodConfig | ARC4BareMethodConfig
  mappedFields: ReadonlyMap<TxnField, Expression>
  sourceLocation: SourceLocation
}) {
  const implicitFields = new Map<TxnField, Expression>()
  const hasAppId = mappedFields.has(TxnField.ApplicationID)

  const oca = getOca(mappedFields.get(TxnField.OnCompletion), methodConfig.allowedCompletionTypes, sourceLocation)
  implicitFields.set(
    TxnField.OnCompletion,
    nodeFactory.uInt64Constant({
      value: BigInt(oca),
      sourceLocation,
    }),
  )
  if (hasAppId) {
    codeInvariant(
      methodConfig.create !== ARC4CreateOption.require,
      `Cannot specify ${txnFieldName.appId} as target method is only callable in a create scenario`,
      mappedFields.get(TxnField.ApplicationID)?.sourceLocation,
    )
  } else {
    codeInvariant(
      methodConfig.create !== ARC4CreateOption.disallow,
      `${txnFieldName.appId} must be specified to call this method`,
      sourceLocation,
    )
  }
  // Update or possible create
  if (oca === OnCompletionAction.UpdateApplication || !hasAppId) {
    implicitFields.set(
      TxnField.ApprovalProgramPages,
      requireInstanceBuilder(proxy.memberAccess('approvalProgram', sourceLocation)).resolve(),
    )
    implicitFields.set(
      TxnField.ClearStateProgramPages,
      requireInstanceBuilder(proxy.memberAccess('clearStateProgram', sourceLocation)).resolve(),
    )
    if (!hasAppId) {
      implicitFields.set(TxnField.GlobalNumUint, requireInstanceBuilder(proxy.memberAccess('globalUints', sourceLocation)).resolve())
      implicitFields.set(TxnField.GlobalNumByteSlice, requireInstanceBuilder(proxy.memberAccess('globalBytes', sourceLocation)).resolve())
      implicitFields.set(TxnField.LocalNumByteSlice, requireInstanceBuilder(proxy.memberAccess('localBytes', sourceLocation)).resolve())
      implicitFields.set(TxnField.LocalNumUint, requireInstanceBuilder(proxy.memberAccess('localUints', sourceLocation)).resolve())
      implicitFields.set(
        TxnField.ExtraProgramPages,
        requireInstanceBuilder(proxy.memberAccess('extraProgramPages', sourceLocation)).resolve(),
      )
    }
  }
  return implicitFields
}

function getOca(
  ocaField: Expression | undefined,
  allowedCompletionTypes: OnCompletionAction[],
  sourceLocation: SourceLocation,
): OnCompletionAction {
  if (ocaField) {
    codeInvariant(
      ocaField instanceof IntegerConstant,
      `${txnFieldName.onCompletion} should be a compile time constant`,
      ocaField.sourceLocation,
    )
    const oca = enumFromValue(Number(ocaField.value), OnCompletionAction)
    codeInvariant(allowedCompletionTypes.includes(oca), `${txnFieldName.onCompletion} should be one of ${allowedCompletionTypes}`)
    return oca
  } else {
    const oca = allowedCompletionTypes[0]
    if (allowedCompletionTypes.length > 1) {
      logger.warn(sourceLocation, `Method allows multiple on complete actions, defaulting to ${oca}`)
    }
    return oca
  }
}

function addAppArgs({
  fields,
  methodSelector,
  functionType,
  mappedFields,
  sourceLocation,
}: {
  mappedFields: Map<TxnField, Expression>
  fields?: InstanceBuilder
  functionType: FunctionPType
  methodSelector: MethodConstant
  sourceLocation: SourceLocation
}) {
  const appArgsBuilder = fields && fields.hasProperty('args') && fields.memberAccess('args', sourceLocation)
  const appArgs: Expression[] = [methodSelector]
  if (appArgsBuilder) {
    codeInvariant(isStaticallyIterable(appArgsBuilder), 'Unsupported expression for args', appArgsBuilder.sourceLocation)
    appArgs.push(
      ...appArgsBuilder[StaticIterator]().map((arg, index) => {
        const [paramName, paramType] = functionType.parameters[index]

        const encodedType = ptypeToArc4EncodedType(paramType, sourceLocation)

        const resolvedArg = arg.resolveToPType(paramType)

        if (encodedType.equals(paramType)) {
          return resolvedArg.resolve()
        }

        return nodeFactory.aRC4Encode({
          value: arg.resolve(),
          wtype: encodedType.wtype,
          sourceLocation: arg.sourceLocation,
        })
      }),
    )
  }
  mappedFields.set(
    TxnField.ApplicationArgs,
    nodeFactory.tupleExpression({
      items: appArgs,
      sourceLocation,
    }),
  )
}

function getReturnValueExpr(itxnResult: Expression, returnType: PType, sourceLocation: SourceLocation) {
  const returnValueLog = nodeFactory.innerTransactionField({
    field: TxnField.LastLog,
    arrayIndex: null,
    itxn: itxnResult,
    wtype: wtypes.bytesWType,
    sourceLocation,
  })
  const logPrefix = nodeFactory.bytesConstant({ value: hexToUint8Array(Constants.algo.arc4.logPrefixHex), sourceLocation })

  const unprefixedLog = validatePrefix(instanceEb(returnValueLog, bytesPType), logPrefix, sourceLocation)

  const arc4Return = ptypeToArc4EncodedType(returnType, sourceLocation)

  const returnValueArc4 = nodeFactory.reinterpretCast({
    expr: unprefixedLog,
    sourceLocation,
    wtype: arc4Return.wtype,
  })

  if (returnType.equals(arc4Return)) return returnValueArc4
  return nodeFactory.aRC4Decode({
    value: returnValueArc4,
    wtype: returnType.wtypeOrThrow,
    sourceLocation,
  })
}
