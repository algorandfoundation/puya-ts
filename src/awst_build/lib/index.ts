import { ContractReference } from '../../awst/models'
import { nodeFactory } from '../../awst/node-factory'
import { SourceLocation } from '../../awst/source-location'
import { wtypes } from '../../awst/wtypes'
import { Constants } from '../../constants'
import type { AwstBuildContext } from '../context/awst-build-context'
import { ContractClassModel } from '../models/contract-class-model'
import { arc4BaseContractType, baseContractType } from '../ptypes'

export function buildLibAwst(context: AwstBuildContext) {
  const contractCref = ContractReference.fromPType(arc4BaseContractType)
  const baseContractCref = ContractReference.fromPType(baseContractType)

  const baseContract = new ContractClassModel({
    type: baseContractType,
    isAbstract: true,
    propertyInitialization: [],
    ctor: null,
    methods: [],
    appState: [],
    options: undefined,
    description: null,
    sourceLocation: SourceLocation.None,
    approvalProgram: null,
    clearProgram: nodeFactory.contractMethod({
      memberName: Constants.clearStateProgramMethodName,
      cref: baseContractCref,
      args: [],
      arc4MethodConfig: null,
      sourceLocation: SourceLocation.None,
      returnType: wtypes.boolWType,
      documentation: nodeFactory.methodDocumentation(),
      body: nodeFactory.block(
        {
          sourceLocation: SourceLocation.None,
        },
        nodeFactory.returnStatement({
          sourceLocation: SourceLocation.None,
          value: nodeFactory.boolConstant({ value: true, sourceLocation: SourceLocation.None }),
        }),
      ),
      inline: null,
    }),
  })
  context.addToCompilationSet(baseContractCref, baseContract)
  const contract = new ContractClassModel({
    type: arc4BaseContractType,
    isAbstract: true,
    propertyInitialization: [],
    ctor: null,
    methods: [],
    appState: [],
    options: undefined,
    description: null,
    clearProgram: null,
    sourceLocation: SourceLocation.None,
    approvalProgram: nodeFactory.contractMethod({
      memberName: Constants.approvalProgramMethodName,
      cref: contractCref,
      args: [],
      arc4MethodConfig: null,
      sourceLocation: SourceLocation.None,
      returnType: wtypes.boolWType,
      documentation: nodeFactory.methodDocumentation(),
      body: nodeFactory.block(
        {
          sourceLocation: SourceLocation.None,
        },
        nodeFactory.returnStatement({
          sourceLocation: SourceLocation.None,
          value: nodeFactory.aRC4Router({ sourceLocation: SourceLocation.None, wtype: wtypes.boolWType }),
        }),
      ),
      inline: null,
    }),
  })
  context.addToCompilationSet(contractCref, contract)
}
