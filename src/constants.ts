const algoTsPackage = '@algorandfoundation/algorand-typescript'

export const Constants = {
  approvalProgramMethodName: 'approvalProgram',
  clearStateProgramMethodName: 'clearStateProgram',
  algoTsPackage,
  arc4ModuleName: `${algoTsPackage}/arc4/index.d.ts`,
  opModuleName: `${algoTsPackage}/op.d.ts`,
  templateVarModuleName: `${algoTsPackage}/template-var.d.ts`,
  logicSigModuleName: `${algoTsPackage}/logic-sig.d.ts`,
  baseContractModuleName: `${algoTsPackage}/base-contract.d.ts`,
  utilModuleName: `${algoTsPackage}/util.d.ts`,
  referenceModuleName: `${algoTsPackage}/reference.d.ts`,
  stateModuleName: `${algoTsPackage}/state.d.ts`,
  boxModuleName: `${algoTsPackage}/box.d.ts`,
  transactionsModuleName: `${algoTsPackage}/transactions.d.ts`,
  gtxnModuleName: `${algoTsPackage}/gtxn.d.ts`,
  itxnModuleName: `${algoTsPackage}/itxn.d.ts`,
  compiledModuleName: `${algoTsPackage}/compiled.d.ts`,
  arc28ModuleName: `${algoTsPackage}/arc-28.d.ts`,
  primitivesModuleName: `${algoTsPackage}/primitives.d.ts`,
  arc4EncodedTypesModuleName: `${algoTsPackage}/arc4/encoded-types.d.ts`,
  mutableArrayModuleName: `${algoTsPackage}/mutable-array.d.ts`,
  polytypeModuleName: 'polytype/lib/polytype-module.d.ts',
  arc4BareDecoratorName: 'arc4.baremethod',
  arc4AbiDecoratorName: 'arc4.abimethod',
  contractOptionsDecoratorName: 'contract',
  logicSigOptionsDecoratorName: 'logicsig',
  constructorMethodName: 'constructor',
  logicSigProgramMethodName: 'program',
  defaultCreateMethodName: '__algots__.defaultCreate',

  algo: {
    addressLength: 32,
    encodedAddressLength: 58,
    maxTransactionGroupSize: 16,
  },

  zeroAddressEncoded: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ',
  supportedAvmVersions: [10n, 11n],
  targetedPuyaVersion: '4.4.4',
} as const

export type SupportedAvmVersion = (typeof Constants.supportedAvmVersions)[number]
