import * as ptypes from './ptypes'
import { Expression } from '../awst/nodes'

export type ImmediateArgMapping = {
  name: string
  ptypes: ptypes.PType[]
}

export type StackArg = {
  name: string
  ptypes: ptypes.PType[]
}

export type Signature = {
  argNames: string[]
  immediateArgs: Array<ImmediateArgMapping | bigint | string>
  stackArgs: Array<StackArg | Expression>
  returnType: ptypes.PType
}

export type IntrinsicOpMapping = {
  type: 'op-mapping'
  op: string
  signatures: Signature[]
}
export type IntrinsicOpGrouping = {
  type: 'op-grouping'
  name: string
  ops: Record<string, IntrinsicOpMapping>
}
export const OP_METADATA: Record<string, IntrinsicOpMapping | IntrinsicOpGrouping> = {
  AcctParams: {
    type: 'op-grouping',
    name: 'AcctParams',
    ops: {
      acctBalance: {
        type: 'op-mapping',
        op: 'acct_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AcctBalance'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.accountPType, ptypes.uint64PType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.uint64PType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      acctMinBalance: {
        type: 'op-mapping',
        op: 'acct_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AcctMinBalance'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.accountPType, ptypes.uint64PType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.uint64PType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      acctAuthAddr: {
        type: 'op-mapping',
        op: 'acct_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AcctAuthAddr'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.accountPType, ptypes.uint64PType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.accountPType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      acctTotalNumUint: {
        type: 'op-mapping',
        op: 'acct_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AcctTotalNumUint'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.accountPType, ptypes.uint64PType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.uint64PType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      acctTotalNumByteSlice: {
        type: 'op-mapping',
        op: 'acct_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AcctTotalNumByteSlice'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.accountPType, ptypes.uint64PType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.uint64PType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      acctTotalExtraAppPages: {
        type: 'op-mapping',
        op: 'acct_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AcctTotalExtraAppPages'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.accountPType, ptypes.uint64PType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.uint64PType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      acctTotalAppsCreated: {
        type: 'op-mapping',
        op: 'acct_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AcctTotalAppsCreated'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.accountPType, ptypes.uint64PType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.uint64PType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      acctTotalAppsOptedIn: {
        type: 'op-mapping',
        op: 'acct_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AcctTotalAppsOptedIn'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.accountPType, ptypes.uint64PType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.uint64PType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      acctTotalAssetsCreated: {
        type: 'op-mapping',
        op: 'acct_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AcctTotalAssetsCreated'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.accountPType, ptypes.uint64PType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.uint64PType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      acctTotalAssets: {
        type: 'op-mapping',
        op: 'acct_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AcctTotalAssets'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.accountPType, ptypes.uint64PType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.uint64PType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      acctTotalBoxes: {
        type: 'op-mapping',
        op: 'acct_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AcctTotalBoxes'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.accountPType, ptypes.uint64PType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.uint64PType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      acctTotalBoxBytes: {
        type: 'op-mapping',
        op: 'acct_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AcctTotalBoxBytes'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.accountPType, ptypes.uint64PType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.uint64PType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
    },
  },
  addw: {
    type: 'op-mapping',
    op: 'addw',
    signatures: [
      {
        argNames: ['a', 'b'],
        immediateArgs: [],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.uint64PType] },
          { name: 'b', ptypes: [ptypes.uint64PType] },
        ],
        returnType: new ptypes.TuplePType({ items: [ptypes.uint64PType, ptypes.uint64PType], immutable: true }),
      },
    ],
  },
  AppGlobal: {
    type: 'op-grouping',
    name: 'AppGlobal',
    ops: {
      delete: {
        type: 'op-mapping',
        op: 'app_global_del',
        signatures: [
          { argNames: ['a'], immediateArgs: [], stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }], returnType: ptypes.voidPType },
        ],
      },
      getBytes: {
        type: 'op-mapping',
        op: 'app_global_get',
        signatures: [
          { argNames: ['a'], immediateArgs: [], stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }], returnType: ptypes.bytesPType },
        ],
      },
      getUint64: {
        type: 'op-mapping',
        op: 'app_global_get',
        signatures: [
          { argNames: ['a'], immediateArgs: [], stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }], returnType: ptypes.uint64PType },
        ],
      },
      getExBytes: {
        type: 'op-mapping',
        op: 'app_global_get_ex',
        signatures: [
          {
            argNames: ['a', 'b'],
            immediateArgs: [],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.applicationPType] },
              { name: 'b', ptypes: [ptypes.bytesPType] },
            ],
            returnType: new ptypes.TuplePType({ items: [ptypes.bytesPType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      getExUint64: {
        type: 'op-mapping',
        op: 'app_global_get_ex',
        signatures: [
          {
            argNames: ['a', 'b'],
            immediateArgs: [],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.applicationPType] },
              { name: 'b', ptypes: [ptypes.bytesPType] },
            ],
            returnType: new ptypes.TuplePType({ items: [ptypes.uint64PType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      put: {
        type: 'op-mapping',
        op: 'app_global_put',
        signatures: [
          {
            argNames: ['a', 'b'],
            immediateArgs: [],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.bytesPType] },
              { name: 'b', ptypes: [ptypes.uint64PType, ptypes.bytesPType] },
            ],
            returnType: ptypes.voidPType,
          },
        ],
      },
    },
  },
  AppLocal: {
    type: 'op-grouping',
    name: 'AppLocal',
    ops: {
      delete: {
        type: 'op-mapping',
        op: 'app_local_del',
        signatures: [
          {
            argNames: ['a', 'b'],
            immediateArgs: [],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.accountPType, ptypes.uint64PType] },
              { name: 'b', ptypes: [ptypes.bytesPType] },
            ],
            returnType: ptypes.voidPType,
          },
        ],
      },
      getBytes: {
        type: 'op-mapping',
        op: 'app_local_get',
        signatures: [
          {
            argNames: ['a', 'b'],
            immediateArgs: [],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.accountPType, ptypes.uint64PType] },
              { name: 'b', ptypes: [ptypes.bytesPType] },
            ],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      getUint64: {
        type: 'op-mapping',
        op: 'app_local_get',
        signatures: [
          {
            argNames: ['a', 'b'],
            immediateArgs: [],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.accountPType, ptypes.uint64PType] },
              { name: 'b', ptypes: [ptypes.bytesPType] },
            ],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      getExBytes: {
        type: 'op-mapping',
        op: 'app_local_get_ex',
        signatures: [
          {
            argNames: ['a', 'b', 'c'],
            immediateArgs: [],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.accountPType, ptypes.uint64PType] },
              { name: 'b', ptypes: [ptypes.applicationPType] },
              { name: 'c', ptypes: [ptypes.bytesPType] },
            ],
            returnType: new ptypes.TuplePType({ items: [ptypes.bytesPType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      getExUint64: {
        type: 'op-mapping',
        op: 'app_local_get_ex',
        signatures: [
          {
            argNames: ['a', 'b', 'c'],
            immediateArgs: [],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.accountPType, ptypes.uint64PType] },
              { name: 'b', ptypes: [ptypes.applicationPType] },
              { name: 'c', ptypes: [ptypes.bytesPType] },
            ],
            returnType: new ptypes.TuplePType({ items: [ptypes.uint64PType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      put: {
        type: 'op-mapping',
        op: 'app_local_put',
        signatures: [
          {
            argNames: ['a', 'b', 'c'],
            immediateArgs: [],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.accountPType, ptypes.uint64PType] },
              { name: 'b', ptypes: [ptypes.bytesPType] },
              { name: 'c', ptypes: [ptypes.uint64PType, ptypes.bytesPType] },
            ],
            returnType: ptypes.voidPType,
          },
        ],
      },
    },
  },
  appOptedIn: {
    type: 'op-mapping',
    op: 'app_opted_in',
    signatures: [
      {
        argNames: ['a', 'b'],
        immediateArgs: [],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.accountPType, ptypes.uint64PType] },
          { name: 'b', ptypes: [ptypes.applicationPType] },
        ],
        returnType: ptypes.boolPType,
      },
    ],
  },
  AppParams: {
    type: 'op-grouping',
    name: 'AppParams',
    ops: {
      appApprovalProgram: {
        type: 'op-mapping',
        op: 'app_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AppApprovalProgram'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.applicationPType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.bytesPType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      appClearStateProgram: {
        type: 'op-mapping',
        op: 'app_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AppClearStateProgram'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.applicationPType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.bytesPType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      appGlobalNumUint: {
        type: 'op-mapping',
        op: 'app_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AppGlobalNumUint'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.applicationPType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.uint64PType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      appGlobalNumByteSlice: {
        type: 'op-mapping',
        op: 'app_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AppGlobalNumByteSlice'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.applicationPType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.uint64PType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      appLocalNumUint: {
        type: 'op-mapping',
        op: 'app_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AppLocalNumUint'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.applicationPType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.uint64PType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      appLocalNumByteSlice: {
        type: 'op-mapping',
        op: 'app_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AppLocalNumByteSlice'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.applicationPType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.uint64PType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      appExtraProgramPages: {
        type: 'op-mapping',
        op: 'app_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AppExtraProgramPages'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.applicationPType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.uint64PType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      appCreator: {
        type: 'op-mapping',
        op: 'app_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AppCreator'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.applicationPType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.accountPType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      appAddress: {
        type: 'op-mapping',
        op: 'app_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AppAddress'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.applicationPType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.accountPType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
    },
  },
  arg: {
    type: 'op-mapping',
    op: 'args',
    signatures: [
      { argNames: ['a'], immediateArgs: [], stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }], returnType: ptypes.bytesPType },
    ],
  },
  AssetHolding: {
    type: 'op-grouping',
    name: 'AssetHolding',
    ops: {
      assetBalance: {
        type: 'op-mapping',
        op: 'asset_holding_get',
        signatures: [
          {
            argNames: ['a', 'b'],
            immediateArgs: ['AssetBalance'],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.accountPType, ptypes.uint64PType] },
              { name: 'b', ptypes: [ptypes.assetPType] },
            ],
            returnType: new ptypes.TuplePType({ items: [ptypes.uint64PType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      assetFrozen: {
        type: 'op-mapping',
        op: 'asset_holding_get',
        signatures: [
          {
            argNames: ['a', 'b'],
            immediateArgs: ['AssetFrozen'],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.accountPType, ptypes.uint64PType] },
              { name: 'b', ptypes: [ptypes.assetPType] },
            ],
            returnType: new ptypes.TuplePType({ items: [ptypes.boolPType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
    },
  },
  AssetParams: {
    type: 'op-grouping',
    name: 'AssetParams',
    ops: {
      assetTotal: {
        type: 'op-mapping',
        op: 'asset_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AssetTotal'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.assetPType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.uint64PType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      assetDecimals: {
        type: 'op-mapping',
        op: 'asset_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AssetDecimals'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.assetPType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.uint64PType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      assetDefaultFrozen: {
        type: 'op-mapping',
        op: 'asset_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AssetDefaultFrozen'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.assetPType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.boolPType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      assetUnitName: {
        type: 'op-mapping',
        op: 'asset_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AssetUnitName'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.assetPType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.bytesPType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      assetName: {
        type: 'op-mapping',
        op: 'asset_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AssetName'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.assetPType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.bytesPType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      assetUrl: {
        type: 'op-mapping',
        op: 'asset_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AssetURL'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.assetPType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.bytesPType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      assetMetadataHash: {
        type: 'op-mapping',
        op: 'asset_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AssetMetadataHash'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.assetPType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.bytesPType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      assetManager: {
        type: 'op-mapping',
        op: 'asset_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AssetManager'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.assetPType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.accountPType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      assetReserve: {
        type: 'op-mapping',
        op: 'asset_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AssetReserve'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.assetPType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.accountPType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      assetFreeze: {
        type: 'op-mapping',
        op: 'asset_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AssetFreeze'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.assetPType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.accountPType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      assetClawback: {
        type: 'op-mapping',
        op: 'asset_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AssetClawback'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.assetPType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.accountPType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      assetCreator: {
        type: 'op-mapping',
        op: 'asset_params_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AssetCreator'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.assetPType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.accountPType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
    },
  },
  balance: {
    type: 'op-mapping',
    op: 'balance',
    signatures: [
      {
        argNames: ['a'],
        immediateArgs: [],
        stackArgs: [{ name: 'a', ptypes: [ptypes.accountPType, ptypes.uint64PType] }],
        returnType: ptypes.uint64PType,
      },
    ],
  },
  base64Decode: {
    type: 'op-mapping',
    op: 'base64_decode',
    signatures: [
      {
        argNames: ['e', 'a'],
        immediateArgs: [{ name: 'e', ptypes: [ptypes.base64PType] }],
        stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }],
        returnType: ptypes.bytesPType,
      },
    ],
  },
  bitLength: {
    type: 'op-mapping',
    op: 'bitlen',
    signatures: [
      {
        argNames: ['a'],
        immediateArgs: [],
        stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType, ptypes.bytesPType] }],
        returnType: ptypes.uint64PType,
      },
    ],
  },
  Block: {
    type: 'op-grouping',
    name: 'Block',
    ops: {
      blkSeed: {
        type: 'op-mapping',
        op: 'block',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['BlkSeed'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      blkTimestamp: {
        type: 'op-mapping',
        op: 'block',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['BlkTimestamp'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.uint64PType,
          },
        ],
      },
    },
  },
  Box: {
    type: 'op-grouping',
    name: 'Box',
    ops: {
      create: {
        type: 'op-mapping',
        op: 'box_create',
        signatures: [
          {
            argNames: ['a', 'b'],
            immediateArgs: [],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.bytesPType] },
              { name: 'b', ptypes: [ptypes.uint64PType] },
            ],
            returnType: ptypes.boolPType,
          },
        ],
      },
      delete: {
        type: 'op-mapping',
        op: 'box_del',
        signatures: [
          { argNames: ['a'], immediateArgs: [], stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }], returnType: ptypes.boolPType },
        ],
      },
      extract: {
        type: 'op-mapping',
        op: 'box_extract',
        signatures: [
          {
            argNames: ['a', 'b', 'c'],
            immediateArgs: [],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.bytesPType] },
              { name: 'b', ptypes: [ptypes.uint64PType] },
              { name: 'c', ptypes: [ptypes.uint64PType] },
            ],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      get: {
        type: 'op-mapping',
        op: 'box_get',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: [],
            stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.bytesPType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      length: {
        type: 'op-mapping',
        op: 'box_len',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: [],
            stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }],
            returnType: new ptypes.TuplePType({ items: [ptypes.uint64PType, ptypes.boolPType], immutable: true }),
          },
        ],
      },
      put: {
        type: 'op-mapping',
        op: 'box_put',
        signatures: [
          {
            argNames: ['a', 'b'],
            immediateArgs: [],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.bytesPType] },
              { name: 'b', ptypes: [ptypes.bytesPType] },
            ],
            returnType: ptypes.voidPType,
          },
        ],
      },
      replace: {
        type: 'op-mapping',
        op: 'box_replace',
        signatures: [
          {
            argNames: ['a', 'b', 'c'],
            immediateArgs: [],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.bytesPType] },
              { name: 'b', ptypes: [ptypes.uint64PType] },
              { name: 'c', ptypes: [ptypes.bytesPType] },
            ],
            returnType: ptypes.voidPType,
          },
        ],
      },
      resize: {
        type: 'op-mapping',
        op: 'box_resize',
        signatures: [
          {
            argNames: ['a', 'b'],
            immediateArgs: [],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.bytesPType] },
              { name: 'b', ptypes: [ptypes.uint64PType] },
            ],
            returnType: ptypes.voidPType,
          },
        ],
      },
      splice: {
        type: 'op-mapping',
        op: 'box_splice',
        signatures: [
          {
            argNames: ['a', 'b', 'c', 'd'],
            immediateArgs: [],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.bytesPType] },
              { name: 'b', ptypes: [ptypes.uint64PType] },
              { name: 'c', ptypes: [ptypes.uint64PType] },
              { name: 'd', ptypes: [ptypes.bytesPType] },
            ],
            returnType: ptypes.voidPType,
          },
        ],
      },
    },
  },
  bsqrt: {
    type: 'op-mapping',
    op: 'bsqrt',
    signatures: [
      { argNames: ['a'], immediateArgs: [], stackArgs: [{ name: 'a', ptypes: [ptypes.biguintPType] }], returnType: ptypes.biguintPType },
    ],
  },
  btoi: {
    type: 'op-mapping',
    op: 'btoi',
    signatures: [
      { argNames: ['a'], immediateArgs: [], stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }], returnType: ptypes.uint64PType },
    ],
  },
  bzero: {
    type: 'op-mapping',
    op: 'bzero',
    signatures: [
      { argNames: ['a'], immediateArgs: [], stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }], returnType: ptypes.bytesPType },
    ],
  },
  concat: {
    type: 'op-mapping',
    op: 'concat',
    signatures: [
      {
        argNames: ['a', 'b'],
        immediateArgs: [],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.bytesPType] },
          { name: 'b', ptypes: [ptypes.bytesPType] },
        ],
        returnType: ptypes.bytesPType,
      },
    ],
  },
  divmodw: {
    type: 'op-mapping',
    op: 'divmodw',
    signatures: [
      {
        argNames: ['a', 'b', 'c', 'd'],
        immediateArgs: [],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.uint64PType] },
          { name: 'b', ptypes: [ptypes.uint64PType] },
          { name: 'c', ptypes: [ptypes.uint64PType] },
          { name: 'd', ptypes: [ptypes.uint64PType] },
        ],
        returnType: new ptypes.TuplePType({
          items: [ptypes.uint64PType, ptypes.uint64PType, ptypes.uint64PType, ptypes.uint64PType],
          immutable: true,
        }),
      },
    ],
  },
  divw: {
    type: 'op-mapping',
    op: 'divw',
    signatures: [
      {
        argNames: ['a', 'b', 'c'],
        immediateArgs: [],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.uint64PType] },
          { name: 'b', ptypes: [ptypes.uint64PType] },
          { name: 'c', ptypes: [ptypes.uint64PType] },
        ],
        returnType: ptypes.uint64PType,
      },
    ],
  },
  EllipticCurve: {
    type: 'op-grouping',
    name: 'EllipticCurve',
    ops: {
      add: {
        type: 'op-mapping',
        op: 'ec_add',
        signatures: [
          {
            argNames: ['g', 'a', 'b'],
            immediateArgs: [{ name: 'g', ptypes: [ptypes.ecPType] }],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.bytesPType] },
              { name: 'b', ptypes: [ptypes.bytesPType] },
            ],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      mapTo: {
        type: 'op-mapping',
        op: 'ec_map_to',
        signatures: [
          {
            argNames: ['g', 'a'],
            immediateArgs: [{ name: 'g', ptypes: [ptypes.ecPType] }],
            stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      scalarMulMulti: {
        type: 'op-mapping',
        op: 'ec_multi_scalar_mul',
        signatures: [
          {
            argNames: ['g', 'a', 'b'],
            immediateArgs: [{ name: 'g', ptypes: [ptypes.ecPType] }],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.bytesPType] },
              { name: 'b', ptypes: [ptypes.bytesPType] },
            ],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      pairingCheck: {
        type: 'op-mapping',
        op: 'ec_pairing_check',
        signatures: [
          {
            argNames: ['g', 'a', 'b'],
            immediateArgs: [{ name: 'g', ptypes: [ptypes.ecPType] }],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.bytesPType] },
              { name: 'b', ptypes: [ptypes.bytesPType] },
            ],
            returnType: ptypes.boolPType,
          },
        ],
      },
      scalarMul: {
        type: 'op-mapping',
        op: 'ec_scalar_mul',
        signatures: [
          {
            argNames: ['g', 'a', 'b'],
            immediateArgs: [{ name: 'g', ptypes: [ptypes.ecPType] }],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.bytesPType] },
              { name: 'b', ptypes: [ptypes.bytesPType] },
            ],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      subgroupCheck: {
        type: 'op-mapping',
        op: 'ec_subgroup_check',
        signatures: [
          {
            argNames: ['g', 'a'],
            immediateArgs: [{ name: 'g', ptypes: [ptypes.ecPType] }],
            stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }],
            returnType: ptypes.boolPType,
          },
        ],
      },
    },
  },
  ecdsaPkDecompress: {
    type: 'op-mapping',
    op: 'ecdsa_pk_decompress',
    signatures: [
      {
        argNames: ['v', 'a'],
        immediateArgs: [{ name: 'v', ptypes: [ptypes.ecdsaPType] }],
        stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }],
        returnType: new ptypes.TuplePType({ items: [ptypes.bytesPType, ptypes.bytesPType], immutable: true }),
      },
    ],
  },
  ecdsaPkRecover: {
    type: 'op-mapping',
    op: 'ecdsa_pk_recover',
    signatures: [
      {
        argNames: ['v', 'a', 'b', 'c', 'd'],
        immediateArgs: [{ name: 'v', ptypes: [ptypes.ecdsaPType] }],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.bytesPType] },
          { name: 'b', ptypes: [ptypes.uint64PType] },
          { name: 'c', ptypes: [ptypes.bytesPType] },
          { name: 'd', ptypes: [ptypes.bytesPType] },
        ],
        returnType: new ptypes.TuplePType({ items: [ptypes.bytesPType, ptypes.bytesPType], immutable: true }),
      },
    ],
  },
  ecdsaVerify: {
    type: 'op-mapping',
    op: 'ecdsa_verify',
    signatures: [
      {
        argNames: ['v', 'a', 'b', 'c', 'd', 'e'],
        immediateArgs: [{ name: 'v', ptypes: [ptypes.ecdsaPType] }],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.bytesPType] },
          { name: 'b', ptypes: [ptypes.bytesPType] },
          { name: 'c', ptypes: [ptypes.bytesPType] },
          { name: 'd', ptypes: [ptypes.bytesPType] },
          { name: 'e', ptypes: [ptypes.bytesPType] },
        ],
        returnType: ptypes.boolPType,
      },
    ],
  },
  ed25519verify: {
    type: 'op-mapping',
    op: 'ed25519verify',
    signatures: [
      {
        argNames: ['a', 'b', 'c'],
        immediateArgs: [],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.bytesPType] },
          { name: 'b', ptypes: [ptypes.bytesPType] },
          { name: 'c', ptypes: [ptypes.bytesPType] },
        ],
        returnType: ptypes.boolPType,
      },
    ],
  },
  ed25519verifyBare: {
    type: 'op-mapping',
    op: 'ed25519verify_bare',
    signatures: [
      {
        argNames: ['a', 'b', 'c'],
        immediateArgs: [],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.bytesPType] },
          { name: 'b', ptypes: [ptypes.bytesPType] },
          { name: 'c', ptypes: [ptypes.bytesPType] },
        ],
        returnType: ptypes.boolPType,
      },
    ],
  },
  exp: {
    type: 'op-mapping',
    op: 'exp',
    signatures: [
      {
        argNames: ['a', 'b'],
        immediateArgs: [],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.uint64PType] },
          { name: 'b', ptypes: [ptypes.uint64PType] },
        ],
        returnType: ptypes.uint64PType,
      },
    ],
  },
  expw: {
    type: 'op-mapping',
    op: 'expw',
    signatures: [
      {
        argNames: ['a', 'b'],
        immediateArgs: [],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.uint64PType] },
          { name: 'b', ptypes: [ptypes.uint64PType] },
        ],
        returnType: new ptypes.TuplePType({ items: [ptypes.uint64PType, ptypes.uint64PType], immutable: true }),
      },
    ],
  },
  extract: {
    type: 'op-mapping',
    op: 'extract3',
    signatures: [
      {
        argNames: ['a', 'b', 'c'],
        immediateArgs: [],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.bytesPType] },
          { name: 'b', ptypes: [ptypes.uint64PType] },
          { name: 'c', ptypes: [ptypes.uint64PType] },
        ],
        returnType: ptypes.bytesPType,
      },
    ],
  },
  extractUint16: {
    type: 'op-mapping',
    op: 'extract_uint16',
    signatures: [
      {
        argNames: ['a', 'b'],
        immediateArgs: [],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.bytesPType] },
          { name: 'b', ptypes: [ptypes.uint64PType] },
        ],
        returnType: ptypes.uint64PType,
      },
    ],
  },
  extractUint32: {
    type: 'op-mapping',
    op: 'extract_uint32',
    signatures: [
      {
        argNames: ['a', 'b'],
        immediateArgs: [],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.bytesPType] },
          { name: 'b', ptypes: [ptypes.uint64PType] },
        ],
        returnType: ptypes.uint64PType,
      },
    ],
  },
  extractUint64: {
    type: 'op-mapping',
    op: 'extract_uint64',
    signatures: [
      {
        argNames: ['a', 'b'],
        immediateArgs: [],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.bytesPType] },
          { name: 'b', ptypes: [ptypes.uint64PType] },
        ],
        returnType: ptypes.uint64PType,
      },
    ],
  },
  gaid: {
    type: 'op-mapping',
    op: 'gaids',
    signatures: [
      { argNames: ['a'], immediateArgs: [], stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }], returnType: ptypes.applicationPType },
    ],
  },
  getBit: {
    type: 'op-mapping',
    op: 'getbit',
    signatures: [
      {
        argNames: ['a', 'b'],
        immediateArgs: [],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.uint64PType, ptypes.bytesPType] },
          { name: 'b', ptypes: [ptypes.uint64PType] },
        ],
        returnType: ptypes.uint64PType,
      },
    ],
  },
  getBytes: {
    type: 'op-mapping',
    op: 'getbyte',
    signatures: [
      {
        argNames: ['a', 'b'],
        immediateArgs: [],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.bytesPType] },
          { name: 'b', ptypes: [ptypes.uint64PType] },
        ],
        returnType: ptypes.uint64PType,
      },
    ],
  },
  GITxn: {
    type: 'op-grouping',
    name: 'GITxn',
    ops: {
      sender: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'Sender'],
            stackArgs: [],
            returnType: ptypes.accountPType,
          },
        ],
      },
      fee: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'Fee'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      firstValid: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'FirstValid'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      firstValidTime: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'FirstValidTime'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      lastValid: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'LastValid'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      note: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'Note'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      lease: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'Lease'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      receiver: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'Receiver'],
            stackArgs: [],
            returnType: ptypes.accountPType,
          },
        ],
      },
      amount: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'Amount'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      closeRemainderTo: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'CloseRemainderTo'],
            stackArgs: [],
            returnType: ptypes.accountPType,
          },
        ],
      },
      votePk: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'VotePK'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      selectionPk: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'SelectionPK'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      voteFirst: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'VoteFirst'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      voteLast: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'VoteLast'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      voteKeyDilution: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'VoteKeyDilution'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      type: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'Type'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      typeEnum: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'TypeEnum'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      xferAsset: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'XferAsset'],
            stackArgs: [],
            returnType: ptypes.assetPType,
          },
        ],
      },
      assetAmount: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'AssetAmount'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      assetSender: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'AssetSender'],
            stackArgs: [],
            returnType: ptypes.accountPType,
          },
        ],
      },
      assetReceiver: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'AssetReceiver'],
            stackArgs: [],
            returnType: ptypes.accountPType,
          },
        ],
      },
      assetCloseTo: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'AssetCloseTo'],
            stackArgs: [],
            returnType: ptypes.accountPType,
          },
        ],
      },
      groupIndex: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'GroupIndex'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      txId: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'TxID'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      applicationId: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ApplicationID'],
            stackArgs: [],
            returnType: ptypes.applicationPType,
          },
        ],
      },
      onCompletion: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'OnCompletion'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      applicationArgs: {
        type: 'op-mapping',
        op: 'gitxnas',
        signatures: [
          {
            argNames: ['t', 'a'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ApplicationArgs'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      numAppArgs: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'NumAppArgs'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      accounts: {
        type: 'op-mapping',
        op: 'gitxnas',
        signatures: [
          {
            argNames: ['t', 'a'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'Accounts'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.accountPType,
          },
        ],
      },
      numAccounts: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'NumAccounts'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      approvalProgram: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ApprovalProgram'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      clearStateProgram: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ClearStateProgram'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      rekeyTo: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'RekeyTo'],
            stackArgs: [],
            returnType: ptypes.accountPType,
          },
        ],
      },
      configAsset: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ConfigAsset'],
            stackArgs: [],
            returnType: ptypes.assetPType,
          },
        ],
      },
      configAssetTotal: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ConfigAssetTotal'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      configAssetDecimals: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ConfigAssetDecimals'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      configAssetDefaultFrozen: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ConfigAssetDefaultFrozen'],
            stackArgs: [],
            returnType: ptypes.boolPType,
          },
        ],
      },
      configAssetUnitName: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ConfigAssetUnitName'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      configAssetName: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ConfigAssetName'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      configAssetUrl: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ConfigAssetURL'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      configAssetMetadataHash: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ConfigAssetMetadataHash'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      configAssetManager: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ConfigAssetManager'],
            stackArgs: [],
            returnType: ptypes.accountPType,
          },
        ],
      },
      configAssetReserve: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ConfigAssetReserve'],
            stackArgs: [],
            returnType: ptypes.accountPType,
          },
        ],
      },
      configAssetFreeze: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ConfigAssetFreeze'],
            stackArgs: [],
            returnType: ptypes.accountPType,
          },
        ],
      },
      configAssetClawback: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ConfigAssetClawback'],
            stackArgs: [],
            returnType: ptypes.accountPType,
          },
        ],
      },
      freezeAsset: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'FreezeAsset'],
            stackArgs: [],
            returnType: ptypes.assetPType,
          },
        ],
      },
      freezeAssetAccount: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'FreezeAssetAccount'],
            stackArgs: [],
            returnType: ptypes.accountPType,
          },
        ],
      },
      freezeAssetFrozen: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'FreezeAssetFrozen'],
            stackArgs: [],
            returnType: ptypes.boolPType,
          },
        ],
      },
      assets: {
        type: 'op-mapping',
        op: 'gitxnas',
        signatures: [
          {
            argNames: ['t', 'a'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'Assets'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.assetPType,
          },
        ],
      },
      numAssets: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'NumAssets'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      applications: {
        type: 'op-mapping',
        op: 'gitxnas',
        signatures: [
          {
            argNames: ['t', 'a'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'Applications'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.applicationPType,
          },
        ],
      },
      numApplications: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'NumApplications'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      globalNumUint: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'GlobalNumUint'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      globalNumByteSlice: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'GlobalNumByteSlice'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      localNumUint: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'LocalNumUint'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      localNumByteSlice: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'LocalNumByteSlice'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      extraProgramPages: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ExtraProgramPages'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      nonparticipation: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'Nonparticipation'],
            stackArgs: [],
            returnType: ptypes.boolPType,
          },
        ],
      },
      logs: {
        type: 'op-mapping',
        op: 'gitxnas',
        signatures: [
          {
            argNames: ['t', 'a'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'Logs'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      numLogs: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'NumLogs'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      createdAssetId: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'CreatedAssetID'],
            stackArgs: [],
            returnType: ptypes.assetPType,
          },
        ],
      },
      createdApplicationId: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'CreatedApplicationID'],
            stackArgs: [],
            returnType: ptypes.applicationPType,
          },
        ],
      },
      lastLog: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'LastLog'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      stateProofPk: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'StateProofPK'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      approvalProgramPages: {
        type: 'op-mapping',
        op: 'gitxnas',
        signatures: [
          {
            argNames: ['t', 'a'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ApprovalProgramPages'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      numApprovalProgramPages: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'NumApprovalProgramPages'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      clearStateProgramPages: {
        type: 'op-mapping',
        op: 'gitxnas',
        signatures: [
          {
            argNames: ['t', 'a'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ClearStateProgramPages'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      numClearStateProgramPages: {
        type: 'op-mapping',
        op: 'gitxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'NumClearStateProgramPages'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
    },
  },
  gloadBytes: {
    type: 'op-mapping',
    op: 'gloadss',
    signatures: [
      {
        argNames: ['a', 'b'],
        immediateArgs: [],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.uint64PType] },
          { name: 'b', ptypes: [ptypes.uint64PType] },
        ],
        returnType: ptypes.bytesPType,
      },
    ],
  },
  gloadUint64: {
    type: 'op-mapping',
    op: 'gloadss',
    signatures: [
      {
        argNames: ['a', 'b'],
        immediateArgs: [],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.uint64PType] },
          { name: 'b', ptypes: [ptypes.uint64PType] },
        ],
        returnType: ptypes.uint64PType,
      },
    ],
  },
  Global: {
    type: 'op-grouping',
    name: 'Global',
    ops: {
      minTxnFee: {
        type: 'op-mapping',
        op: 'global',
        signatures: [{ argNames: [], immediateArgs: ['MinTxnFee'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      minBalance: {
        type: 'op-mapping',
        op: 'global',
        signatures: [{ argNames: [], immediateArgs: ['MinBalance'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      maxTxnLife: {
        type: 'op-mapping',
        op: 'global',
        signatures: [{ argNames: [], immediateArgs: ['MaxTxnLife'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      zeroAddress: {
        type: 'op-mapping',
        op: 'global',
        signatures: [{ argNames: [], immediateArgs: ['ZeroAddress'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      groupSize: {
        type: 'op-mapping',
        op: 'global',
        signatures: [{ argNames: [], immediateArgs: ['GroupSize'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      logicSigVersion: {
        type: 'op-mapping',
        op: 'global',
        signatures: [{ argNames: [], immediateArgs: ['LogicSigVersion'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      round: {
        type: 'op-mapping',
        op: 'global',
        signatures: [{ argNames: [], immediateArgs: ['Round'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      latestTimestamp: {
        type: 'op-mapping',
        op: 'global',
        signatures: [{ argNames: [], immediateArgs: ['LatestTimestamp'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      currentApplicationId: {
        type: 'op-mapping',
        op: 'global',
        signatures: [{ argNames: [], immediateArgs: ['CurrentApplicationID'], stackArgs: [], returnType: ptypes.applicationPType }],
      },
      creatorAddress: {
        type: 'op-mapping',
        op: 'global',
        signatures: [{ argNames: [], immediateArgs: ['CreatorAddress'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      currentApplicationAddress: {
        type: 'op-mapping',
        op: 'global',
        signatures: [{ argNames: [], immediateArgs: ['CurrentApplicationAddress'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      groupId: {
        type: 'op-mapping',
        op: 'global',
        signatures: [{ argNames: [], immediateArgs: ['GroupID'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      opcodeBudget: {
        type: 'op-mapping',
        op: 'global',
        signatures: [{ argNames: [], immediateArgs: ['OpcodeBudget'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      callerApplicationId: {
        type: 'op-mapping',
        op: 'global',
        signatures: [{ argNames: [], immediateArgs: ['CallerApplicationID'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      callerApplicationAddress: {
        type: 'op-mapping',
        op: 'global',
        signatures: [{ argNames: [], immediateArgs: ['CallerApplicationAddress'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      assetCreateMinBalance: {
        type: 'op-mapping',
        op: 'global',
        signatures: [{ argNames: [], immediateArgs: ['AssetCreateMinBalance'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      assetOptInMinBalance: {
        type: 'op-mapping',
        op: 'global',
        signatures: [{ argNames: [], immediateArgs: ['AssetOptInMinBalance'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      genesisHash: {
        type: 'op-mapping',
        op: 'global',
        signatures: [{ argNames: [], immediateArgs: ['GenesisHash'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
    },
  },
  GTxn: {
    type: 'op-grouping',
    name: 'GTxn',
    ops: {
      sender: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'Sender'],
            stackArgs: [],
            returnType: ptypes.accountPType,
          },
        ],
      },
      fee: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'Fee'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      firstValid: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'FirstValid'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      firstValidTime: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'FirstValidTime'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      lastValid: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'LastValid'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      note: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'Note'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      lease: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'Lease'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      receiver: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'Receiver'],
            stackArgs: [],
            returnType: ptypes.accountPType,
          },
        ],
      },
      amount: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'Amount'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      closeRemainderTo: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'CloseRemainderTo'],
            stackArgs: [],
            returnType: ptypes.accountPType,
          },
        ],
      },
      votePk: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'VotePK'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      selectionPk: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'SelectionPK'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      voteFirst: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'VoteFirst'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      voteLast: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'VoteLast'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      voteKeyDilution: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'VoteKeyDilution'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      type: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'Type'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      typeEnum: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'TypeEnum'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      xferAsset: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'XferAsset'],
            stackArgs: [],
            returnType: ptypes.assetPType,
          },
        ],
      },
      assetAmount: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'AssetAmount'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      assetSender: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'AssetSender'],
            stackArgs: [],
            returnType: ptypes.accountPType,
          },
        ],
      },
      assetReceiver: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'AssetReceiver'],
            stackArgs: [],
            returnType: ptypes.accountPType,
          },
        ],
      },
      assetCloseTo: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'AssetCloseTo'],
            stackArgs: [],
            returnType: ptypes.accountPType,
          },
        ],
      },
      groupIndex: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'GroupIndex'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      txId: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'TxID'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      applicationId: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ApplicationID'],
            stackArgs: [],
            returnType: ptypes.applicationPType,
          },
        ],
      },
      onCompletion: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'OnCompletion'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      applicationArgs: {
        type: 'op-mapping',
        op: 'gtxnsas',
        signatures: [
          {
            argNames: ['a', 'b'],
            immediateArgs: ['ApplicationArgs'],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.uint64PType] },
              { name: 'b', ptypes: [ptypes.uint64PType] },
            ],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      numAppArgs: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'NumAppArgs'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      accounts: {
        type: 'op-mapping',
        op: 'gtxnsas',
        signatures: [
          {
            argNames: ['a', 'b'],
            immediateArgs: ['Accounts'],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.uint64PType] },
              { name: 'b', ptypes: [ptypes.uint64PType] },
            ],
            returnType: ptypes.accountPType,
          },
        ],
      },
      numAccounts: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'NumAccounts'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      approvalProgram: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ApprovalProgram'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      clearStateProgram: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ClearStateProgram'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      rekeyTo: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'RekeyTo'],
            stackArgs: [],
            returnType: ptypes.accountPType,
          },
        ],
      },
      configAsset: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ConfigAsset'],
            stackArgs: [],
            returnType: ptypes.assetPType,
          },
        ],
      },
      configAssetTotal: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ConfigAssetTotal'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      configAssetDecimals: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ConfigAssetDecimals'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      configAssetDefaultFrozen: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ConfigAssetDefaultFrozen'],
            stackArgs: [],
            returnType: ptypes.boolPType,
          },
        ],
      },
      configAssetUnitName: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ConfigAssetUnitName'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      configAssetName: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ConfigAssetName'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      configAssetUrl: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ConfigAssetURL'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      configAssetMetadataHash: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ConfigAssetMetadataHash'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      configAssetManager: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ConfigAssetManager'],
            stackArgs: [],
            returnType: ptypes.accountPType,
          },
        ],
      },
      configAssetReserve: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ConfigAssetReserve'],
            stackArgs: [],
            returnType: ptypes.accountPType,
          },
        ],
      },
      configAssetFreeze: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ConfigAssetFreeze'],
            stackArgs: [],
            returnType: ptypes.accountPType,
          },
        ],
      },
      configAssetClawback: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ConfigAssetClawback'],
            stackArgs: [],
            returnType: ptypes.accountPType,
          },
        ],
      },
      freezeAsset: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'FreezeAsset'],
            stackArgs: [],
            returnType: ptypes.assetPType,
          },
        ],
      },
      freezeAssetAccount: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'FreezeAssetAccount'],
            stackArgs: [],
            returnType: ptypes.accountPType,
          },
        ],
      },
      freezeAssetFrozen: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'FreezeAssetFrozen'],
            stackArgs: [],
            returnType: ptypes.boolPType,
          },
        ],
      },
      assets: {
        type: 'op-mapping',
        op: 'gtxnsas',
        signatures: [
          {
            argNames: ['a', 'b'],
            immediateArgs: ['Assets'],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.uint64PType] },
              { name: 'b', ptypes: [ptypes.uint64PType] },
            ],
            returnType: ptypes.assetPType,
          },
        ],
      },
      numAssets: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'NumAssets'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      applications: {
        type: 'op-mapping',
        op: 'gtxnsas',
        signatures: [
          {
            argNames: ['a', 'b'],
            immediateArgs: ['Applications'],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.uint64PType] },
              { name: 'b', ptypes: [ptypes.uint64PType] },
            ],
            returnType: ptypes.applicationPType,
          },
        ],
      },
      numApplications: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'NumApplications'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      globalNumUint: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'GlobalNumUint'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      globalNumByteSlice: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'GlobalNumByteSlice'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      localNumUint: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'LocalNumUint'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      localNumByteSlice: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'LocalNumByteSlice'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      extraProgramPages: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'ExtraProgramPages'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      nonparticipation: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'Nonparticipation'],
            stackArgs: [],
            returnType: ptypes.boolPType,
          },
        ],
      },
      logs: {
        type: 'op-mapping',
        op: 'gtxnsas',
        signatures: [
          {
            argNames: ['a', 'b'],
            immediateArgs: ['Logs'],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.uint64PType] },
              { name: 'b', ptypes: [ptypes.uint64PType] },
            ],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      numLogs: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'NumLogs'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      createdAssetId: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'CreatedAssetID'],
            stackArgs: [],
            returnType: ptypes.assetPType,
          },
        ],
      },
      createdApplicationId: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'CreatedApplicationID'],
            stackArgs: [],
            returnType: ptypes.applicationPType,
          },
        ],
      },
      lastLog: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'LastLog'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      stateProofPk: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'StateProofPK'],
            stackArgs: [],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      approvalProgramPages: {
        type: 'op-mapping',
        op: 'gtxnsas',
        signatures: [
          {
            argNames: ['a', 'b'],
            immediateArgs: ['ApprovalProgramPages'],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.uint64PType] },
              { name: 'b', ptypes: [ptypes.uint64PType] },
            ],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      numApprovalProgramPages: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'NumApprovalProgramPages'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      clearStateProgramPages: {
        type: 'op-mapping',
        op: 'gtxnsas',
        signatures: [
          {
            argNames: ['a', 'b'],
            immediateArgs: ['ClearStateProgramPages'],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.uint64PType] },
              { name: 'b', ptypes: [ptypes.uint64PType] },
            ],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      numClearStateProgramPages: {
        type: 'op-mapping',
        op: 'gtxn',
        signatures: [
          {
            argNames: ['t'],
            immediateArgs: [{ name: 't', ptypes: [ptypes.uint64PType] }, 'NumClearStateProgramPages'],
            stackArgs: [],
            returnType: ptypes.uint64PType,
          },
        ],
      },
    },
  },
  itob: {
    type: 'op-mapping',
    op: 'itob',
    signatures: [
      { argNames: ['a'], immediateArgs: [], stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }], returnType: ptypes.bytesPType },
    ],
  },
  ITxn: {
    type: 'op-grouping',
    name: 'ITxn',
    ops: {
      sender: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['Sender'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      fee: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['Fee'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      firstValid: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['FirstValid'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      firstValidTime: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['FirstValidTime'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      lastValid: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['LastValid'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      note: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['Note'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      lease: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['Lease'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      receiver: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['Receiver'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      amount: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['Amount'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      closeRemainderTo: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['CloseRemainderTo'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      votePk: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['VotePK'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      selectionPk: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['SelectionPK'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      voteFirst: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['VoteFirst'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      voteLast: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['VoteLast'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      voteKeyDilution: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['VoteKeyDilution'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      type: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['Type'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      typeEnum: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['TypeEnum'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      xferAsset: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['XferAsset'], stackArgs: [], returnType: ptypes.assetPType }],
      },
      assetAmount: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['AssetAmount'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      assetSender: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['AssetSender'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      assetReceiver: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['AssetReceiver'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      assetCloseTo: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['AssetCloseTo'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      groupIndex: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['GroupIndex'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      txId: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['TxID'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      applicationId: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['ApplicationID'], stackArgs: [], returnType: ptypes.applicationPType }],
      },
      onCompletion: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['OnCompletion'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      applicationArgs: {
        type: 'op-mapping',
        op: 'itxnas',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['ApplicationArgs'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      numAppArgs: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['NumAppArgs'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      accounts: {
        type: 'op-mapping',
        op: 'itxnas',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['Accounts'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.accountPType,
          },
        ],
      },
      numAccounts: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['NumAccounts'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      approvalProgram: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['ApprovalProgram'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      clearStateProgram: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['ClearStateProgram'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      rekeyTo: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['RekeyTo'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      configAsset: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['ConfigAsset'], stackArgs: [], returnType: ptypes.assetPType }],
      },
      configAssetTotal: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['ConfigAssetTotal'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      configAssetDecimals: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['ConfigAssetDecimals'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      configAssetDefaultFrozen: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['ConfigAssetDefaultFrozen'], stackArgs: [], returnType: ptypes.boolPType }],
      },
      configAssetUnitName: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['ConfigAssetUnitName'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      configAssetName: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['ConfigAssetName'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      configAssetUrl: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['ConfigAssetURL'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      configAssetMetadataHash: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['ConfigAssetMetadataHash'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      configAssetManager: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['ConfigAssetManager'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      configAssetReserve: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['ConfigAssetReserve'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      configAssetFreeze: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['ConfigAssetFreeze'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      configAssetClawback: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['ConfigAssetClawback'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      freezeAsset: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['FreezeAsset'], stackArgs: [], returnType: ptypes.assetPType }],
      },
      freezeAssetAccount: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['FreezeAssetAccount'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      freezeAssetFrozen: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['FreezeAssetFrozen'], stackArgs: [], returnType: ptypes.boolPType }],
      },
      assets: {
        type: 'op-mapping',
        op: 'itxnas',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['Assets'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.assetPType,
          },
        ],
      },
      numAssets: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['NumAssets'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      applications: {
        type: 'op-mapping',
        op: 'itxnas',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['Applications'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.applicationPType,
          },
        ],
      },
      numApplications: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['NumApplications'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      globalNumUint: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['GlobalNumUint'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      globalNumByteSlice: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['GlobalNumByteSlice'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      localNumUint: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['LocalNumUint'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      localNumByteSlice: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['LocalNumByteSlice'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      extraProgramPages: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['ExtraProgramPages'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      nonparticipation: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['Nonparticipation'], stackArgs: [], returnType: ptypes.boolPType }],
      },
      logs: {
        type: 'op-mapping',
        op: 'itxnas',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['Logs'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      numLogs: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['NumLogs'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      createdAssetId: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['CreatedAssetID'], stackArgs: [], returnType: ptypes.assetPType }],
      },
      createdApplicationId: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['CreatedApplicationID'], stackArgs: [], returnType: ptypes.applicationPType }],
      },
      lastLog: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['LastLog'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      stateProofPk: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['StateProofPK'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      approvalProgramPages: {
        type: 'op-mapping',
        op: 'itxnas',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['ApprovalProgramPages'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      numApprovalProgramPages: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['NumApprovalProgramPages'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      clearStateProgramPages: {
        type: 'op-mapping',
        op: 'itxnas',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['ClearStateProgramPages'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      numClearStateProgramPages: {
        type: 'op-mapping',
        op: 'itxn',
        signatures: [{ argNames: [], immediateArgs: ['NumClearStateProgramPages'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
    },
  },
  ITxnCreate: {
    type: 'op-grouping',
    name: 'ITxnCreate',
    ops: {
      begin: {
        type: 'op-mapping',
        op: 'itxn_begin',
        signatures: [{ argNames: [], immediateArgs: [], stackArgs: [], returnType: ptypes.voidPType }],
      },
      setSender: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['Sender'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.accountPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setFee: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['Fee'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setNote: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['Note'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setReceiver: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['Receiver'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.accountPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setAmount: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['Amount'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setCloseRemainderTo: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['CloseRemainderTo'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.accountPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setVotePk: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['VotePK'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setSelectionPk: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['SelectionPK'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setVoteFirst: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['VoteFirst'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setVoteLast: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['VoteLast'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setVoteKeyDilution: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['VoteKeyDilution'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setType: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['Type'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setTypeEnum: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['TypeEnum'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setXferAsset: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['XferAsset'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.assetPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setAssetAmount: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AssetAmount'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setAssetSender: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AssetSender'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.accountPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setAssetReceiver: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AssetReceiver'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.accountPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setAssetCloseTo: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['AssetCloseTo'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.accountPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setApplicationId: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['ApplicationID'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.applicationPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setOnCompletion: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['OnCompletion'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setApplicationArgs: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['ApplicationArgs'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setAccounts: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['Accounts'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.accountPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setApprovalProgram: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['ApprovalProgram'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setClearStateProgram: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['ClearStateProgram'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setRekeyTo: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['RekeyTo'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.accountPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setConfigAsset: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['ConfigAsset'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.assetPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setConfigAssetTotal: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['ConfigAssetTotal'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setConfigAssetDecimals: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['ConfigAssetDecimals'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setConfigAssetDefaultFrozen: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['ConfigAssetDefaultFrozen'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.boolPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setConfigAssetUnitName: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['ConfigAssetUnitName'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setConfigAssetName: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['ConfigAssetName'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setConfigAssetUrl: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['ConfigAssetURL'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setConfigAssetMetadataHash: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['ConfigAssetMetadataHash'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setConfigAssetManager: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['ConfigAssetManager'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.accountPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setConfigAssetReserve: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['ConfigAssetReserve'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.accountPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setConfigAssetFreeze: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['ConfigAssetFreeze'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.accountPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setConfigAssetClawback: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['ConfigAssetClawback'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.accountPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setFreezeAsset: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['FreezeAsset'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.assetPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setFreezeAssetAccount: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['FreezeAssetAccount'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.accountPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setFreezeAssetFrozen: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['FreezeAssetFrozen'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.boolPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setAssets: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['Assets'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setApplications: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['Applications'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setGlobalNumUint: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['GlobalNumUint'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setGlobalNumByteSlice: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['GlobalNumByteSlice'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setLocalNumUint: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['LocalNumUint'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setLocalNumByteSlice: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['LocalNumByteSlice'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setExtraProgramPages: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['ExtraProgramPages'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setNonparticipation: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['Nonparticipation'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.boolPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setStateProofPk: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['StateProofPK'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setApprovalProgramPages: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['ApprovalProgramPages'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      setClearStateProgramPages: {
        type: 'op-mapping',
        op: 'itxn_field',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['ClearStateProgramPages'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }],
            returnType: ptypes.voidPType,
          },
        ],
      },
      next: {
        type: 'op-mapping',
        op: 'itxn_next',
        signatures: [{ argNames: [], immediateArgs: [], stackArgs: [], returnType: ptypes.voidPType }],
      },
      submit: {
        type: 'op-mapping',
        op: 'itxn_submit',
        signatures: [{ argNames: [], immediateArgs: [], stackArgs: [], returnType: ptypes.voidPType }],
      },
    },
  },
  JsonRef: {
    type: 'op-grouping',
    name: 'JsonRef',
    ops: {
      jsonString: {
        type: 'op-mapping',
        op: 'json_ref',
        signatures: [
          {
            argNames: ['a', 'b'],
            immediateArgs: ['JSONString'],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.bytesPType] },
              { name: 'b', ptypes: [ptypes.bytesPType] },
            ],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      jsonUint64: {
        type: 'op-mapping',
        op: 'json_ref',
        signatures: [
          {
            argNames: ['a', 'b'],
            immediateArgs: ['JSONUint64'],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.bytesPType] },
              { name: 'b', ptypes: [ptypes.bytesPType] },
            ],
            returnType: ptypes.uint64PType,
          },
        ],
      },
      jsonObject: {
        type: 'op-mapping',
        op: 'json_ref',
        signatures: [
          {
            argNames: ['a', 'b'],
            immediateArgs: ['JSONObject'],
            stackArgs: [
              { name: 'a', ptypes: [ptypes.bytesPType] },
              { name: 'b', ptypes: [ptypes.bytesPType] },
            ],
            returnType: ptypes.bytesPType,
          },
        ],
      },
    },
  },
  keccak256: {
    type: 'op-mapping',
    op: 'keccak256',
    signatures: [
      { argNames: ['a'], immediateArgs: [], stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }], returnType: ptypes.bytesPType },
    ],
  },
  len: {
    type: 'op-mapping',
    op: 'len',
    signatures: [
      { argNames: ['a'], immediateArgs: [], stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }], returnType: ptypes.uint64PType },
    ],
  },
  minBalance: {
    type: 'op-mapping',
    op: 'min_balance',
    signatures: [
      {
        argNames: ['a'],
        immediateArgs: [],
        stackArgs: [{ name: 'a', ptypes: [ptypes.accountPType, ptypes.uint64PType] }],
        returnType: ptypes.uint64PType,
      },
    ],
  },
  mulw: {
    type: 'op-mapping',
    op: 'mulw',
    signatures: [
      {
        argNames: ['a', 'b'],
        immediateArgs: [],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.uint64PType] },
          { name: 'b', ptypes: [ptypes.uint64PType] },
        ],
        returnType: new ptypes.TuplePType({ items: [ptypes.uint64PType, ptypes.uint64PType], immutable: true }),
      },
    ],
  },
  replace: {
    type: 'op-mapping',
    op: 'replace3',
    signatures: [
      {
        argNames: ['a', 'b', 'c'],
        immediateArgs: [],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.bytesPType] },
          { name: 'b', ptypes: [ptypes.uint64PType] },
          { name: 'c', ptypes: [ptypes.bytesPType] },
        ],
        returnType: ptypes.bytesPType,
      },
    ],
  },
  selectBytes: {
    type: 'op-mapping',
    op: 'select',
    signatures: [
      {
        argNames: ['a', 'b', 'c'],
        immediateArgs: [],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.uint64PType, ptypes.bytesPType] },
          { name: 'b', ptypes: [ptypes.uint64PType, ptypes.bytesPType] },
          { name: 'c', ptypes: [ptypes.boolPType] },
        ],
        returnType: ptypes.bytesPType,
      },
    ],
  },
  selectUint64: {
    type: 'op-mapping',
    op: 'select',
    signatures: [
      {
        argNames: ['a', 'b', 'c'],
        immediateArgs: [],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.uint64PType, ptypes.bytesPType] },
          { name: 'b', ptypes: [ptypes.uint64PType, ptypes.bytesPType] },
          { name: 'c', ptypes: [ptypes.boolPType] },
        ],
        returnType: ptypes.uint64PType,
      },
    ],
  },
  setBitBytes: {
    type: 'op-mapping',
    op: 'setbit',
    signatures: [
      {
        argNames: ['a', 'b', 'c'],
        immediateArgs: [],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.uint64PType, ptypes.bytesPType] },
          { name: 'b', ptypes: [ptypes.uint64PType] },
          { name: 'c', ptypes: [ptypes.uint64PType] },
        ],
        returnType: ptypes.bytesPType,
      },
    ],
  },
  setBitUint64: {
    type: 'op-mapping',
    op: 'setbit',
    signatures: [
      {
        argNames: ['a', 'b', 'c'],
        immediateArgs: [],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.uint64PType, ptypes.bytesPType] },
          { name: 'b', ptypes: [ptypes.uint64PType] },
          { name: 'c', ptypes: [ptypes.uint64PType] },
        ],
        returnType: ptypes.uint64PType,
      },
    ],
  },
  setBytes: {
    type: 'op-mapping',
    op: 'setbyte',
    signatures: [
      {
        argNames: ['a', 'b', 'c'],
        immediateArgs: [],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.bytesPType] },
          { name: 'b', ptypes: [ptypes.uint64PType] },
          { name: 'c', ptypes: [ptypes.uint64PType] },
        ],
        returnType: ptypes.bytesPType,
      },
    ],
  },
  sha256: {
    type: 'op-mapping',
    op: 'sha256',
    signatures: [
      { argNames: ['a'], immediateArgs: [], stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }], returnType: ptypes.bytesPType },
    ],
  },
  sha3_256: {
    type: 'op-mapping',
    op: 'sha3_256',
    signatures: [
      { argNames: ['a'], immediateArgs: [], stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }], returnType: ptypes.bytesPType },
    ],
  },
  sha512_256: {
    type: 'op-mapping',
    op: 'sha512_256',
    signatures: [
      { argNames: ['a'], immediateArgs: [], stackArgs: [{ name: 'a', ptypes: [ptypes.bytesPType] }], returnType: ptypes.bytesPType },
    ],
  },
  shl: {
    type: 'op-mapping',
    op: 'shl',
    signatures: [
      {
        argNames: ['a', 'b'],
        immediateArgs: [],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.uint64PType] },
          { name: 'b', ptypes: [ptypes.uint64PType] },
        ],
        returnType: ptypes.uint64PType,
      },
    ],
  },
  shr: {
    type: 'op-mapping',
    op: 'shr',
    signatures: [
      {
        argNames: ['a', 'b'],
        immediateArgs: [],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.uint64PType] },
          { name: 'b', ptypes: [ptypes.uint64PType] },
        ],
        returnType: ptypes.uint64PType,
      },
    ],
  },
  sqrt: {
    type: 'op-mapping',
    op: 'sqrt',
    signatures: [
      { argNames: ['a'], immediateArgs: [], stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }], returnType: ptypes.uint64PType },
    ],
  },
  substring: {
    type: 'op-mapping',
    op: 'substring3',
    signatures: [
      {
        argNames: ['a', 'b', 'c'],
        immediateArgs: [],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.bytesPType] },
          { name: 'b', ptypes: [ptypes.uint64PType] },
          { name: 'c', ptypes: [ptypes.uint64PType] },
        ],
        returnType: ptypes.bytesPType,
      },
    ],
  },
  Txn: {
    type: 'op-grouping',
    name: 'Txn',
    ops: {
      sender: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['Sender'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      fee: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['Fee'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      firstValid: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['FirstValid'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      firstValidTime: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['FirstValidTime'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      lastValid: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['LastValid'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      note: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['Note'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      lease: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['Lease'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      receiver: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['Receiver'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      amount: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['Amount'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      closeRemainderTo: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['CloseRemainderTo'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      votePk: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['VotePK'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      selectionPk: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['SelectionPK'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      voteFirst: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['VoteFirst'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      voteLast: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['VoteLast'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      voteKeyDilution: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['VoteKeyDilution'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      type: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['Type'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      typeEnum: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['TypeEnum'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      xferAsset: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['XferAsset'], stackArgs: [], returnType: ptypes.assetPType }],
      },
      assetAmount: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['AssetAmount'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      assetSender: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['AssetSender'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      assetReceiver: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['AssetReceiver'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      assetCloseTo: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['AssetCloseTo'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      groupIndex: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['GroupIndex'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      txId: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['TxID'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      applicationId: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['ApplicationID'], stackArgs: [], returnType: ptypes.applicationPType }],
      },
      onCompletion: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['OnCompletion'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      applicationArgs: {
        type: 'op-mapping',
        op: 'txnas',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['ApplicationArgs'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      numAppArgs: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['NumAppArgs'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      accounts: {
        type: 'op-mapping',
        op: 'txnas',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['Accounts'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.accountPType,
          },
        ],
      },
      numAccounts: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['NumAccounts'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      approvalProgram: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['ApprovalProgram'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      clearStateProgram: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['ClearStateProgram'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      rekeyTo: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['RekeyTo'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      configAsset: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['ConfigAsset'], stackArgs: [], returnType: ptypes.assetPType }],
      },
      configAssetTotal: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['ConfigAssetTotal'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      configAssetDecimals: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['ConfigAssetDecimals'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      configAssetDefaultFrozen: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['ConfigAssetDefaultFrozen'], stackArgs: [], returnType: ptypes.boolPType }],
      },
      configAssetUnitName: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['ConfigAssetUnitName'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      configAssetName: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['ConfigAssetName'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      configAssetUrl: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['ConfigAssetURL'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      configAssetMetadataHash: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['ConfigAssetMetadataHash'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      configAssetManager: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['ConfigAssetManager'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      configAssetReserve: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['ConfigAssetReserve'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      configAssetFreeze: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['ConfigAssetFreeze'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      configAssetClawback: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['ConfigAssetClawback'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      freezeAsset: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['FreezeAsset'], stackArgs: [], returnType: ptypes.assetPType }],
      },
      freezeAssetAccount: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['FreezeAssetAccount'], stackArgs: [], returnType: ptypes.accountPType }],
      },
      freezeAssetFrozen: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['FreezeAssetFrozen'], stackArgs: [], returnType: ptypes.boolPType }],
      },
      assets: {
        type: 'op-mapping',
        op: 'txnas',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['Assets'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.assetPType,
          },
        ],
      },
      numAssets: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['NumAssets'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      applications: {
        type: 'op-mapping',
        op: 'txnas',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['Applications'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.applicationPType,
          },
        ],
      },
      numApplications: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['NumApplications'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      globalNumUint: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['GlobalNumUint'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      globalNumByteSlice: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['GlobalNumByteSlice'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      localNumUint: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['LocalNumUint'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      localNumByteSlice: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['LocalNumByteSlice'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      extraProgramPages: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['ExtraProgramPages'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      nonparticipation: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['Nonparticipation'], stackArgs: [], returnType: ptypes.boolPType }],
      },
      logs: {
        type: 'op-mapping',
        op: 'txnas',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['Logs'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      numLogs: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['NumLogs'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      createdAssetId: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['CreatedAssetID'], stackArgs: [], returnType: ptypes.assetPType }],
      },
      createdApplicationId: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['CreatedApplicationID'], stackArgs: [], returnType: ptypes.applicationPType }],
      },
      lastLog: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['LastLog'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      stateProofPk: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['StateProofPK'], stackArgs: [], returnType: ptypes.bytesPType }],
      },
      approvalProgramPages: {
        type: 'op-mapping',
        op: 'txnas',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['ApprovalProgramPages'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      numApprovalProgramPages: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['NumApprovalProgramPages'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
      clearStateProgramPages: {
        type: 'op-mapping',
        op: 'txnas',
        signatures: [
          {
            argNames: ['a'],
            immediateArgs: ['ClearStateProgramPages'],
            stackArgs: [{ name: 'a', ptypes: [ptypes.uint64PType] }],
            returnType: ptypes.bytesPType,
          },
        ],
      },
      numClearStateProgramPages: {
        type: 'op-mapping',
        op: 'txn',
        signatures: [{ argNames: [], immediateArgs: ['NumClearStateProgramPages'], stackArgs: [], returnType: ptypes.uint64PType }],
      },
    },
  },
  vrfVerify: {
    type: 'op-mapping',
    op: 'vrf_verify',
    signatures: [
      {
        argNames: ['s', 'a', 'b', 'c'],
        immediateArgs: [{ name: 's', ptypes: [ptypes.vrfVerifyPType] }],
        stackArgs: [
          { name: 'a', ptypes: [ptypes.bytesPType] },
          { name: 'b', ptypes: [ptypes.bytesPType] },
          { name: 'c', ptypes: [ptypes.bytesPType] },
        ],
        returnType: new ptypes.TuplePType({ items: [ptypes.bytesPType, ptypes.boolPType], immutable: true }),
      },
    ],
  },
}
