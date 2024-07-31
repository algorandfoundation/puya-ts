const algoTsPackage = '@algorandfoundation/algo-ts'

export const Constants = {
  approvalProgramMethodName: 'approvalProgram',
  clearStateProgramMethodName: 'clearStateProgram',
  algoTsPackage,
  arc4ModuleName: `${algoTsPackage}/arc4/index.d.ts`,
  opModuleName: `${algoTsPackage}/op.d.ts`,
  baseContractModuleName: `${algoTsPackage}/base-contract.d.ts`,
  utilModuleName: `${algoTsPackage}/util.d.ts`,
  referenceModuleName: `${algoTsPackage}/reference.d.ts`,
  stateModuleName: `${algoTsPackage}/state.d.ts`,
  boxModuleName: `${algoTsPackage}/box.d.ts`,
  primitivesModuleName: `${algoTsPackage}/primitives.d.ts`,
  arc4BareDecoratorName: 'arc4.baremethod',
  arc4AbiDecoratorName: 'arc4.abimethod',
} as const
