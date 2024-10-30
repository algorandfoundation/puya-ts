import { ContractReference } from '../../awst/models'
import { nodeFactory } from '../../awst/node-factory'
import { SourceLocation } from '../../awst/source-location'
import { wtypes } from '../../awst/wtypes'
import { Constants } from '../../constants'
import type { AwstBuildContext } from '../context/awst-build-context'
import { Index } from '../models'
import { arc4BaseContractType, baseContractType } from '../ptypes'

export function buildLibAwst(context: AwstBuildContext) {
  const contractCref = ContractReference.fromPType(arc4BaseContractType)
  const baseContractCref = ContractReference.fromPType(baseContractType)

  const baseContract = new Index({
    type: baseContractType,
    isAbstract: true,
    propertyInitialization: [],
    ctor: nodeFactory.contractMethod({
      memberName: Constants.constructorMethodName,
      cref: contractCref,
      args: [],
      sourceLocation: SourceLocation.None,
      documentation: nodeFactory.methodDocumentation(),
      body: nodeFactory.block(
        { sourceLocation: SourceLocation.None },
        nodeFactory.expressionStatement({
          expr: nodeFactory.subroutineCallExpression({
            args: [],
            wtype: wtypes.voidWType,
            target: nodeFactory.instanceMethodTarget({
              memberName: Constants.constructorMethodName,
            }),
            sourceLocation: SourceLocation.None,
          }),
        }),
      ),
      returnType: wtypes.voidWType,
      arc4MethodConfig: null,
    }),
    bases: [],
    methods: [],
    appState: [],
    stateTotals: null,
    description: null,
    sourceLocation: SourceLocation.None,
    reservedScratchSpace: new Set(),
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
    }),
  })
  context.addToCompilationSet(baseContractCref, baseContract)
  const contract = new Index({
    type: arc4BaseContractType,
    isAbstract: true,
    propertyInitialization: [],
    ctor: nodeFactory.contractMethod({
      memberName: Constants.constructorMethodName,
      cref: contractCref,
      args: [],
      sourceLocation: SourceLocation.None,
      documentation: nodeFactory.methodDocumentation(),
      body: nodeFactory.block({ sourceLocation: SourceLocation.None }),
      returnType: wtypes.voidWType,
      arc4MethodConfig: null,
    }),
    methods: [],
    appState: [],
    stateTotals: null,
    description: null,
    bases: [baseContractCref],
    clearProgram: null,
    sourceLocation: SourceLocation.None,
    reservedScratchSpace: new Set(),
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
    }),
  })
  context.addToCompilationSet(contractCref, contract)
}
