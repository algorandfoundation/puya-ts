const algoTsPackage = '@algorandfoundation/algorand-typescript'

export const Constants = {
  algoTsPackage,
  moduleNames: {
    polytype: 'polytype/lib/polytype-module.d.ts',
    algoTs: {
      arc28: `${algoTsPackage}/arc-28.d.ts`,
      arc4: {
        index: `${algoTsPackage}/arc4/index.d.ts`,
        encodedTypes: `${algoTsPackage}/arc4/encoded-types.d.ts`,
        c2c: `${algoTsPackage}/arc4/c2c.d.ts`,
      },
      baseContract: `${algoTsPackage}/base-contract.d.ts`,
      box: `${algoTsPackage}/box.d.ts`,
      compiled: `${algoTsPackage}/compiled.d.ts`,
      itxn: `${algoTsPackage}/itxn.d.ts`,
      gtxn: `${algoTsPackage}/gtxn.d.ts`,
      logicSig: `${algoTsPackage}/logic-sig.d.ts`,
      mutableArray: `${algoTsPackage}/mutable-array.d.ts`,
      onCompleteAction: `${algoTsPackage}/on-complete-action.d.ts`,
      op: `${algoTsPackage}/op.d.ts`,
      primitives: `${algoTsPackage}/primitives.d.ts`,
      reference: `${algoTsPackage}/reference.d.ts`,
      state: `${algoTsPackage}/state.d.ts`,
      templateVar: `${algoTsPackage}/template-var.d.ts`,
      transactions: `${algoTsPackage}/transactions.d.ts`,
      util: `${algoTsPackage}/util.d.ts`,
    },
  },

  symbolNames: {
    approvalProgramMethodName: 'approvalProgram',
    clearStateProgramMethodName: 'clearStateProgram',
    arc4BareDecoratorName: 'arc4.baremethod',
    arc4AbiDecoratorName: 'arc4.abimethod',
    contractOptionsDecoratorName: 'contract',
    logicSigOptionsDecoratorName: 'logicsig',
    constructorMethodName: 'constructor',
    logicSigProgramMethodName: 'program',
    defaultCreateMethodName: '__algots__.defaultCreate',
  },

  algo: {
    arc4: {
      logPrefixHex: '151F7C75',
    },
    addressLength: 32,
    encodedAddressLength: 58,
    maxTransactionGroupSize: 16,
    zeroAddressB32: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ',
  },

  supportedAvmVersions: [10n, 11n],
  targetedPuyaVersion: '4.5.3',
  puyaGithubRepo: 'algorandfoundation/puya',
  minNodeVersion: '20.19.0',
} as const

export type SupportedAvmVersion = (typeof Constants.supportedAvmVersions)[number]
