import type { AWST } from '../../awst/nodes'
import { nodeFactory } from '../../awst/node-factory'
import { arc4BaseContractType, baseContractType } from '../ptypes'
import { ContractReference } from '../../awst/models'
import { Constants } from '../../constants'
import { boolWType } from '../../awst/wtypes'
import { SourceLocation } from '../../awst/source-location'
import { intrinsicFactory } from '../../awst/intrinsic-factory'

export function buildLibAwst(): AWST[] {
  const sourceLocationArc4 = new SourceLocation({
    file: Constants.arc4ModuleName,
    line: 1,
    endLine: 1,
    column: 0,
    endColumn: 0,
  })
  const sourceLocationBase = new SourceLocation({
    file: Constants.baseContractModuleName,
    line: 1,
    endLine: 1,
    column: 0,
    endColumn: 0,
  })
  const contractCref = ContractReference.fromPType(arc4BaseContractType)
  const baseContractCref = ContractReference.fromPType(baseContractType)

  const baseContract = nodeFactory.contractFragment({
    id: baseContractCref,
    name: baseContractType.name,
    bases: [],
    init: null,
    subroutines: [],
    appState: new Map(),
    stateTotals: null,
    docstring: null,
    sourceLocation: sourceLocationBase,
    reservedScratchSpace: new Set(),
    approvalProgram: nodeFactory.contractMethod({
      memberName: Constants.approvalProgramMethodName,
      cref: baseContractCref,
      args: [],
      arc4MethodConfig: null,
      sourceLocation: sourceLocationBase,
      returnType: boolWType,
      synthetic: true,
      inheritable: true,
      documentation: nodeFactory.methodDocumentation(),
      body: nodeFactory.block(
        {
          sourceLocation: sourceLocationBase,
        },
        nodeFactory.expressionStatement({
          expr: intrinsicFactory.err({
            comment: 'Approval program not implemented',
            sourceLocation: sourceLocationBase,
          }),
        }),
      ),
    }),
    clearProgram: nodeFactory.contractMethod({
      memberName: Constants.clearStateProgramMethodName,
      cref: baseContractCref,
      args: [],
      arc4MethodConfig: null,
      sourceLocation: sourceLocationBase,
      returnType: boolWType,
      synthetic: true,
      inheritable: true,
      documentation: nodeFactory.methodDocumentation(),
      body: nodeFactory.block(
        {
          sourceLocation: sourceLocationBase,
        },
        nodeFactory.returnStatement({
          sourceLocation: sourceLocationBase,
          value: nodeFactory.boolConstant({ value: true, sourceLocation: sourceLocationBase }),
        }),
      ),
    }),
  })
  const contract = nodeFactory.contractFragment({
    id: contractCref,
    name: arc4BaseContractType.name,
    bases: [baseContractCref],
    init: null,
    subroutines: [],
    appState: new Map(),
    stateTotals: null,
    docstring: null,
    sourceLocation: sourceLocationArc4,
    reservedScratchSpace: new Set(),
    approvalProgram: nodeFactory.contractMethod({
      memberName: Constants.approvalProgramMethodName,
      cref: contractCref,
      args: [],
      arc4MethodConfig: null,
      sourceLocation: sourceLocationArc4,
      returnType: boolWType,
      synthetic: true,
      inheritable: true,
      documentation: nodeFactory.methodDocumentation(),
      body: nodeFactory.block(
        {
          sourceLocation: sourceLocationArc4,
        },
        nodeFactory.returnStatement({
          sourceLocation: sourceLocationArc4,
          value: nodeFactory.aRC4Router({ sourceLocation: sourceLocationArc4, wtype: boolWType }),
        }),
      ),
    }),
    clearProgram: null,
  })

  return [baseContract, contract]
}
