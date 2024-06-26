const algoTsPackage = '@algorandfoundation/algo-ts'

export const Constants = {
  approvalProgramMethodName: 'approvalProgram',
  clearStateMethodName: 'clearState',
  algoTsPackage,
  opModuleName: `${algoTsPackage}/op.d.ts`,
  utilModuleName: `${algoTsPackage}/util.d.ts`,
  referenceModuleName: `${algoTsPackage}/reference.d.ts`,
  stateModuleName: `${algoTsPackage}/state.d.ts`,
  primitivesModuleName: `${algoTsPackage}/primitives.d.ts`,
} as const
