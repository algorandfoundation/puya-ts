import { ContractReference, LogicSigReference } from '../../../awst/models'
import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { TxnField } from '../../../awst/txn-fields'
import { codeInvariant, invariant } from '../../../util'
import type { PType } from '../../ptypes'
import {
  compiledContractType,
  compiledLogicSigType,
  compileFunctionType,
  ContractClassPType,
  isObjectType,
  LogicSigPType,
  uint64PType,
} from '../../ptypes'
import { instanceEb } from '../../type-registry'
import type { InstanceBuilder, NodeBuilder } from '../index'
import { FunctionBuilder } from '../index'
import { requireBuilderOfType, requireInstanceBuilder, requireStringConstant } from '../util'
import { parseFunctionArgs } from '../util/arg-parsing'

export class CompileFunctionBuilder extends FunctionBuilder {
  readonly ptype = compileFunctionType

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [contractOrSig, options],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: this.typeDescription,
      argSpec: (a) => [a.required(ContractClassPType, LogicSigPType), a.optional()],
    })

    const templateVarOptions = parseTemplateVars(options)

    if (contractOrSig.ptype instanceof ContractClassPType) {
      return instanceEb(
        nodeFactory.compiledContract({
          contract: ContractReference.fromPType(contractOrSig.ptype),
          allocationOverrides: parseAllocationOverrides(options),
          ...templateVarOptions,
          wtype: compiledContractType.wtype,
          sourceLocation,
        }),
        compiledContractType,
      )
    } else {
      invariant(contractOrSig.ptype instanceof LogicSigPType, 'ptype must be LogicSigPType')
      return instanceEb(
        nodeFactory.compiledLogicSig({
          logicSig: LogicSigReference.fromPType(contractOrSig.ptype),
          ...templateVarOptions,
          wtype: compiledLogicSigType.wtype,
          sourceLocation,
        }),
        compiledLogicSigType,
      )
    }
  }
}
const optionsNames = {
  prefix: 'templateVarsPrefix',
  templateVars: 'templateVars',
}

function parseTemplateVars(options: InstanceBuilder | undefined): { prefix: string | null; templateVariables: Map<string, Expression> } {
  const prefix = options?.hasProperty(optionsNames.prefix)
    ? requireStringConstant(options.memberAccess(optionsNames.prefix, options.sourceLocation)).value
    : null

  const templateVariables = new Map<string, Expression>()

  if (options?.hasProperty(optionsNames.templateVars)) {
    const templateVars = requireInstanceBuilder(options.memberAccess(optionsNames.templateVars, options.sourceLocation))
    codeInvariant(isObjectType(templateVars.ptype), `${optionsNames.templateVars} must be an object type`, templateVars.sourceLocation)

    for (const [varName] of templateVars.ptype.orderedProperties()) {
      templateVariables.set(varName, requireInstanceBuilder(templateVars.memberAccess(varName, templateVars.sourceLocation)).resolve())
    }
  }

  return {
    prefix,
    templateVariables,
  }
}

const allocationOverrides = {
  extraProgramPages: [TxnField.ExtraProgramPages, uint64PType],
  globalUints: [TxnField.ExtraProgramPages, uint64PType],
  globalBytes: [TxnField.ExtraProgramPages, uint64PType],
  localUints: [TxnField.ExtraProgramPages, uint64PType],
  localBytes: [TxnField.ExtraProgramPages, uint64PType],
} as const

function parseAllocationOverrides(options: InstanceBuilder | undefined): Map<TxnField, Expression> {
  const overrides = new Map<TxnField, Expression>()
  if (options) {
    for (const [property, [field, fieldType]] of Object.entries(allocationOverrides)) {
      if (options.hasProperty(property)) {
        overrides.set(field, requireBuilderOfType(options.memberAccess(property, options.sourceLocation), fieldType).resolve())
      }
    }
  }
  return overrides
}
