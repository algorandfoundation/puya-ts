import { OnCompletionAction, TransactionKind } from '../../../awst/models'
import { nodeFactory } from '../../../awst/node-factory'
import type { ARC4MethodConfig, Expression, MethodConstant } from '../../../awst/nodes'
import { ARC4ABIMethodConfig, ARC4BareMethodConfig, ARC4CreateOption, CompiledContract, IntegerConstant } from '../../../awst/nodes'
import { SourceLocation } from '../../../awst/source-location'
import { TxnField } from '../../../awst/txn-fields'
import { wtypes } from '../../../awst/wtypes'
import { Constants } from '../../../constants'
import { logger } from '../../../logger'
import { codeInvariant, enumFromValue, hexToUint8Array, invariant } from '../../../util'
import { parseArc4Method } from '../../../util/arc4-signature-parser'
import { buildArc4MethodConstant, ptypeToArc4EncodedType } from '../../arc4-util'
import { AwstBuildContext } from '../../context/awst-build-context'
import type { FunctionPType, PType } from '../../ptypes'
import {
  accountPType,
  applicationCallItxnParamsType,
  applicationItxnType,
  applicationPType,
  assetPType,
  bytesPType,
  compiledContractType,
  GroupTransactionPType,
  ItxnParamsPType,
  voidPType,
} from '../../ptypes'
import {
  abiCallFunction,
  compileArc4Function,
  ContractProxyGeneric,
  ContractProxyType,
  TypedApplicationCallResponseGeneric,
} from '../../ptypes/arc4-types'
import { txnFieldName } from '../../txn-fields'
import { instanceEb } from '../../type-registry'
import { CompileFunctionBuilder } from '../compiled/compile-function'
import { ContractMethodExpressionBuilder } from '../free-subroutine-expression-builder'
import type { InstanceBuilder } from '../index'
import { FunctionBuilder, InstanceExpressionBuilder, NodeBuilder } from '../index'
import { isStaticallyIterable, StaticIterator } from '../traits/static-iterator'
import { mapTransactionFields } from '../transactions/inner-transaction-params'
import { requireExpressionOfType, requireInstanceBuilder } from '../util'
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
    codeInvariant(
      arc4Config instanceof ARC4ABIMethodConfig,
      `${memberName} is not an ABI method, or the containing contract has not been visited (possibly due to a circular reference)`,
      functionRef.sourceLocation,
    )
    const methodSelector = buildArc4MethodConstant(functionType, arc4Config, sourceLocation)

    const itxnResult = makeApplicationCall({
      fields,
      methodSelector,
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
      applicationProxy: this.proxy,
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
    codeInvariant(
      arc4Config instanceof ARC4ABIMethodConfig,
      `${this.functionType.name} is not an ABI method, or the containing contract has not been visited (possibly due to a circular reference)`,
      sourceLocation,
    )
    const methodSelector =
      arc4Config instanceof ARC4ABIMethodConfig ? buildArc4MethodConstant(this.functionType, arc4Config, sourceLocation) : null

    return formatApplicationCallResponse({
      itxnResult: makeApplicationCall({
        applicationProxy: this.proxy,
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

export function buildApplicationCallTxnFields({
  sourceLocation,
  fields,
  arc4Config,
  applicationProxy,
  methodSelector,
  functionType,
}: {
  applicationProxy?: InstanceBuilder
  fields?: InstanceBuilder
  functionType: FunctionPType | null
  arc4Config: ARC4MethodConfig
  methodSelector: MethodConstant | null
  sourceLocation: SourceLocation
}) {
  const itxnGroup: Expression[] = []
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
  if (applicationProxy) {
    // Create a copy of the fields
    const implicitFields = getImplicitFields({ applicationProxy: applicationProxy, mappedFields, sourceLocation, methodConfig: arc4Config })
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
    const { itxns, appArgs, foreignApps, foreignAssets, foreignAccounts } = parseAppArgs({
      fields,
      methodSelector,
      sourceLocation,
      functionType,
    })
    mappedFields.set(TxnField.ApplicationArgs, appArgs)
    if (foreignApps) mappedFields.set(TxnField.Applications, foreignApps)
    if (foreignAssets) mappedFields.set(TxnField.Assets, foreignAssets)
    if (foreignAccounts) mappedFields.set(TxnField.Accounts, foreignAccounts)

    itxnGroup.push(...itxns)
  }
  // Build itxn and submit
  itxnGroup.push(
    nodeFactory.createInnerTransaction({
      fields: mappedFields,
      sourceLocation,
      wtype: applicationCallItxnParamsType.wtype,
    }),
  )
  return itxnGroup
}

function makeApplicationCall({
  sourceLocation,
  fields,
  arc4Config,
  applicationProxy,
  methodSelector,
  functionType,
}: {
  applicationProxy?: InstanceBuilder
  fields?: InstanceBuilder
  functionType: FunctionPType | null
  arc4Config: ARC4MethodConfig
  methodSelector: MethodConstant | null
  sourceLocation: SourceLocation
}): Expression {
  const itxnGroup = buildApplicationCallTxnFields({
    sourceLocation,
    fields,
    arc4Config,
    applicationProxy,
    methodSelector,
    functionType,
  })
  const txnGroup = nodeFactory.submitInnerTransaction({
    itxns: itxnGroup,
    sourceLocation,
  })

  return txnGroup.itxns.length === 1
    ? txnGroup
    : nodeFactory.tupleItemExpression({
        base: txnGroup,
        index: BigInt(txnGroup.itxns.length - 1),
        sourceLocation,
      })
}

function formatApplicationCallResponse({
  itxnResult,
  functionType,
  sourceLocation,
}: {
  itxnResult: Expression
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
  applicationProxy,
  methodConfig,
  mappedFields,
  sourceLocation,
}: {
  applicationProxy: InstanceBuilder
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
      requireInstanceBuilder(applicationProxy.memberAccess('approvalProgram', sourceLocation)).resolve(),
    )
    implicitFields.set(
      TxnField.ClearStateProgramPages,
      requireInstanceBuilder(applicationProxy.memberAccess('clearStateProgram', sourceLocation)).resolve(),
    )
    if (!hasAppId) {
      implicitFields.set(
        TxnField.GlobalNumUint,
        requireInstanceBuilder(applicationProxy.memberAccess('globalUints', sourceLocation)).resolve(),
      )
      implicitFields.set(
        TxnField.GlobalNumByteSlice,
        requireInstanceBuilder(applicationProxy.memberAccess('globalBytes', sourceLocation)).resolve(),
      )
      implicitFields.set(
        TxnField.LocalNumByteSlice,
        requireInstanceBuilder(applicationProxy.memberAccess('localBytes', sourceLocation)).resolve(),
      )
      implicitFields.set(
        TxnField.LocalNumUint,
        requireInstanceBuilder(applicationProxy.memberAccess('localUints', sourceLocation)).resolve(),
      )
      implicitFields.set(
        TxnField.ExtraProgramPages,
        requireInstanceBuilder(applicationProxy.memberAccess('extraProgramPages', sourceLocation)).resolve(),
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

function parseAppArgs({
  fields,
  methodSelector,
  functionType,
  sourceLocation,
}: {
  fields?: InstanceBuilder
  functionType: FunctionPType
  methodSelector: MethodConstant
  sourceLocation: SourceLocation
}) {
  const results = {
    itxns: new Array<Expression>(),
    foreignApps: new Array<Expression>(),
    foreignAccounts: new Array<Expression>(),
    foreignAssets: new Array<Expression>(),
  }

  const appArgsBuilder = fields && fields.hasProperty('args') && fields.memberAccess('args', sourceLocation)
  const parsedSignature = parseArc4Method(methodSelector.value)
  const appArgs: Expression[] = [methodSelector]
  if (appArgsBuilder) {
    codeInvariant(isStaticallyIterable(appArgsBuilder), 'Unsupported expression for args', appArgsBuilder.sourceLocation)
    appArgs.push(
      ...appArgsBuilder[StaticIterator]().flatMap((arg, index) => {
        const [paramName, paramType] = functionType.parameters[index]
        const publicParamType = parsedSignature.parameters[index]

        if (paramType instanceof GroupTransactionPType) {
          codeInvariant(arg.ptype instanceof ItxnParamsPType, `${paramName} should be an ItxnParams object`)
          if (paramType.kind !== undefined) {
            codeInvariant(
              arg.ptype.kind === paramType.kind,
              `${paramName} should be an ItxnParams object for a ${TransactionKind[paramType.kind]} txn`,
            )
          }
          // Push any itxn params to the itxn array in order
          results.itxns.push(arg.resolve())
          return []
        }

        if (paramType.equals(assetPType)) {
          if (publicParamType.equals(assetPType)) {
            return handleForeignRef(results.foreignAssets, 0n, paramType, arg)
          } else {
            return nodeFactory.reinterpretCast({
              expr: requireExpressionOfType(arg, assetPType),
              sourceLocation: arg.sourceLocation,
              wtype: wtypes.uint64WType,
            })
          }
        }
        if (paramType.equals(applicationPType)) {
          if (publicParamType.equals(applicationPType)) {
            return handleForeignRef(results.foreignApps, 1n, paramType, arg)
          } else {
            return nodeFactory.reinterpretCast({
              expr: requireExpressionOfType(arg, applicationPType),
              sourceLocation: arg.sourceLocation,
              wtype: wtypes.uint64WType,
            })
          }
        }
        if (paramType.equals(accountPType)) {
          if (publicParamType.equals(accountPType)) {
            return handleForeignRef(results.foreignAccounts, 1n, paramType, arg)
          } else {
            return nodeFactory.reinterpretCast({
              expr: requireExpressionOfType(arg, accountPType),
              sourceLocation: arg.sourceLocation,
              wtype: new wtypes.BytesWType({ length: 32n }),
            })
          }
        }

        const encodedType = ptypeToArc4EncodedType(paramType, sourceLocation)

        const resolvedArg = requireExpressionOfType(arg, paramType)

        if (encodedType.equals(paramType)) {
          return resolvedArg
        }

        return nodeFactory.aRC4Encode({
          value: resolvedArg,
          wtype: encodedType.wtype,
          sourceLocation: arg.sourceLocation,
          errorMessage: null,
        })
      }),
    )
  }
  return {
    appArgs: nodeFactory.tupleExpression({
      items: appArgs,
      sourceLocation,
    }),
    itxns: results.itxns,
    foreignApps: results.foreignApps.length
      ? nodeFactory.tupleExpression({
          items: results.foreignApps,
          sourceLocation,
        })
      : null,
    foreignAccounts: results.foreignAccounts.length
      ? nodeFactory.tupleExpression({
          items: results.foreignAccounts,
          sourceLocation,
        })
      : null,
    foreignAssets: results.foreignAssets.length
      ? nodeFactory.tupleExpression({
          items: results.foreignAssets,
          sourceLocation,
        })
      : null,
  }
}

/**
 * Adds the arg expression to the foreign refs array and returns the index of that item
 * @param refsArray The foreign refs array associated with the ref type
 * @param offset The initial offset for the ref type. Account 0 is Txn.sender and App 0 is Global.currentApplication
 * @param paramType The ptype for the parameter
 * @param arg The builder for the arg value
 */
function handleForeignRef(refsArray: Expression[], offset: bigint, paramType: PType, arg: InstanceBuilder) {
  refsArray.push(requireExpressionOfType(arg, paramType))
  return nodeFactory.integerConstant({
    value: BigInt(refsArray.length - 1) + offset,
    wtype: new wtypes.ARC4UIntN({ n: 8n }),
    sourceLocation: SourceLocation.None,
    tealAlias: null,
  })
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
    errorMessage: null,
  })
}
