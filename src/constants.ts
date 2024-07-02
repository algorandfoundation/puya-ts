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
  primitivesModuleName: `${algoTsPackage}/primitives.d.ts`,
} as const
