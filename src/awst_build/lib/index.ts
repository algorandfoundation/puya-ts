import { ContractReference } from '../../awst/models'
import { nodeFactory } from '../../awst/node-factory'
import type { AWST, Expression, Subroutine } from '../../awst/nodes'
import { NumericComparison, UInt64BinaryOperator } from '../../awst/nodes'
import { SourceLocation } from '../../awst/source-location'
import { wtypes } from '../../awst/wtypes'
import { Constants } from '../../constants'
import { utf8ToUint8Array } from '../../util'
import { AwstBuildContext } from '../context/awst-build-context'
import { ContractClassModel } from '../models/contract-class-model'
import { arc4BaseContractType, baseContractType, itoaMethod } from '../ptypes'

export function buildLibAwst(): AWST[] {
  const contractCref = ContractReference.fromPType(arc4BaseContractType)
  const baseContractCref = ContractReference.fromPType(baseContractType)

  const baseContract = new ContractClassModel({
    type: baseContractType,
    isAbstract: true,
    propertyInitialization: [],
    ctor: nodeFactory.contractMethod({
      memberName: Constants.symbolNames.constructorMethodName,
      cref: baseContractCref,
      args: [],
      arc4MethodConfig: null,
      sourceLocation: SourceLocation.None,
      returnType: wtypes.voidWType,
      documentation: nodeFactory.methodDocumentation(),
      body: nodeFactory.block({ sourceLocation: SourceLocation.None }),
      inline: true,
    }),
    methods: [],
    appState: [],
    options: undefined,
    description: null,
    sourceLocation: SourceLocation.None,
    approvalProgram: null,
    clearProgram: nodeFactory.contractMethod({
      memberName: Constants.symbolNames.clearStateProgramMethodName,
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
  AwstBuildContext.current.addToCompilationSet(baseContractCref, baseContract)
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
      memberName: Constants.symbolNames.approvalProgramMethodName,
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
  AwstBuildContext.current.addToCompilationSet(contractCref, contract)

  return [buildItoa()]
}

function buildItoa(): Subroutine {
  const digits = nodeFactory.bytesConstant({
    sourceLocation: SourceLocation.None,
    value: utf8ToUint8Array('0123456789'),
  })
  const radix = nodeFactory.uInt64Constant({
    sourceLocation: SourceLocation.None,
    value: 10n,
  })
  const paramRef = nodeFactory.varExpression({
    sourceLocation: SourceLocation.None,
    name: 'i',
    wtype: wtypes.uint64WType,
  })

  const charAtIndex = (index: Expression) =>
    nodeFactory.reinterpretCast({
      wtype: wtypes.stringWType,
      sourceLocation: SourceLocation.None,
      expr: nodeFactory.indexExpression({
        sourceLocation: SourceLocation.None,
        wtype: wtypes.bytesWType,
        index: index,
        base: digits,
      }),
    })

  return nodeFactory.subroutine({
    returnType: wtypes.stringWType,
    sourceLocation: SourceLocation.None,
    args: [
      nodeFactory.subroutineArgument({
        name: 'i',
        sourceLocation: SourceLocation.None,
        wtype: wtypes.uint64WType,
      }),
    ],
    body: nodeFactory.block(
      { sourceLocation: SourceLocation.None },
      nodeFactory.ifElse({
        condition: nodeFactory.numericComparisonExpression({
          lhs: paramRef,
          rhs: radix,
          operator: NumericComparison.lt,
          sourceLocation: SourceLocation.None,
        }),
        ifBranch: nodeFactory.block(
          { sourceLocation: SourceLocation.None },
          nodeFactory.returnStatement({ value: charAtIndex(paramRef), sourceLocation: SourceLocation.None }),
        ),
        elseBranch: nodeFactory.block(
          { sourceLocation: SourceLocation.None },
          nodeFactory.returnStatement({
            sourceLocation: SourceLocation.None,
            value: nodeFactory.intrinsicCall({
              stackArgs: [
                nodeFactory.subroutineCallExpression({
                  sourceLocation: SourceLocation.None,
                  args: [
                    nodeFactory.callArg({
                      name: 'i',
                      value: nodeFactory.uInt64BinaryOperation({
                        sourceLocation: SourceLocation.None,
                        op: UInt64BinaryOperator.floorDiv,
                        left: paramRef,
                        right: radix,
                      }),
                    }),
                  ],
                  target: nodeFactory.subroutineID({ target: itoaMethod.fullName }),
                  wtype: wtypes.stringWType,
                }),
                charAtIndex(
                  nodeFactory.uInt64BinaryOperation({
                    sourceLocation: SourceLocation.None,
                    op: UInt64BinaryOperator.mod,
                    left: paramRef,
                    right: radix,
                  }),
                ),
              ],
              immediates: [],
              opCode: 'concat',
              wtype: wtypes.stringWType,
              sourceLocation: SourceLocation.None,
            }),
          }),
        ),
        sourceLocation: SourceLocation.None,
      }),
    ),
    documentation: nodeFactory.methodDocumentation({}),
    inline: null,
    id: itoaMethod.fullName,
    name: itoaMethod.name,
  })
}
