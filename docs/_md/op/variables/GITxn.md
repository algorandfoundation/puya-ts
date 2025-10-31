---
title: GITxn
type: doc
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / GITxn

# Variable: GITxn

> `const` **GITxn**: `object`

Defined in: [op.ts:980](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L980)

Get values for inner transaction in the last group submitted

## Type declaration

### accounts()

> **accounts**(`t`, `a`): [`Account`](../../index/type-aliases/Account.md)

Accounts listed in the ApplicationCall transaction
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Account`](../../index/type-aliases/Account.md)

### amount()

> **amount**(`t`): [`uint64`](../../index/type-aliases/uint64.md)

microalgos
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### applicationArgs()

> **applicationArgs**(`t`, `a`): [`bytes`](../../index/type-aliases/bytes.md)

Arguments passed to the application in the ApplicationCall transaction
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### applicationId()

> **applicationId**(`t`): [`Application`](../../index/type-aliases/Application.md)

ApplicationID from ApplicationCall transaction
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Application`](../../index/type-aliases/Application.md)

### applications()

> **applications**(`t`, `a`): [`Application`](../../index/type-aliases/Application.md)

Foreign Apps listed in the ApplicationCall transaction
Min AVM version: 3

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Application`](../../index/type-aliases/Application.md)

### approvalProgram()

> **approvalProgram**(`t`): [`bytes`](../../index/type-aliases/bytes.md)

Approval program
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### approvalProgramPages()

> **approvalProgramPages**(`t`, `a`): [`bytes`](../../index/type-aliases/bytes.md)

Approval Program as an array of pages
Min AVM version: 7

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### assetAmount()

> **assetAmount**(`t`): [`uint64`](../../index/type-aliases/uint64.md)

value in Asset's units
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### assetCloseTo()

> **assetCloseTo**(`t`): [`Account`](../../index/type-aliases/Account.md)

32 byte address
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Account`](../../index/type-aliases/Account.md)

### assetReceiver()

> **assetReceiver**(`t`): [`Account`](../../index/type-aliases/Account.md)

32 byte address
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Account`](../../index/type-aliases/Account.md)

### assets()

> **assets**(`t`, `a`): [`Asset`](../../index/type-aliases/Asset.md)

Foreign Assets listed in the ApplicationCall transaction
Min AVM version: 3

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Asset`](../../index/type-aliases/Asset.md)

### assetSender()

> **assetSender**(`t`): [`Account`](../../index/type-aliases/Account.md)

32 byte address. Source of assets if Sender is the Asset's Clawback address.
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Account`](../../index/type-aliases/Account.md)

### clearStateProgram()

> **clearStateProgram**(`t`): [`bytes`](../../index/type-aliases/bytes.md)

Clear state program
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### clearStateProgramPages()

> **clearStateProgramPages**(`t`, `a`): [`bytes`](../../index/type-aliases/bytes.md)

ClearState Program as an array of pages
Min AVM version: 7

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### closeRemainderTo()

> **closeRemainderTo**(`t`): [`Account`](../../index/type-aliases/Account.md)

32 byte address
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Account`](../../index/type-aliases/Account.md)

### configAsset()

> **configAsset**(`t`): [`Asset`](../../index/type-aliases/Asset.md)

Asset ID in asset config transaction
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Asset`](../../index/type-aliases/Asset.md)

### configAssetClawback()

> **configAssetClawback**(`t`): [`Account`](../../index/type-aliases/Account.md)

32 byte address
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Account`](../../index/type-aliases/Account.md)

### configAssetDecimals()

> **configAssetDecimals**(`t`): [`uint64`](../../index/type-aliases/uint64.md)

Number of digits to display after the decimal place when displaying the asset
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### configAssetDefaultFrozen()

> **configAssetDefaultFrozen**(`t`): `boolean`

Whether the asset's slots are frozen by default or not, 0 or 1
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

`boolean`

### configAssetFreeze()

> **configAssetFreeze**(`t`): [`Account`](../../index/type-aliases/Account.md)

32 byte address
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Account`](../../index/type-aliases/Account.md)

### configAssetManager()

> **configAssetManager**(`t`): [`Account`](../../index/type-aliases/Account.md)

32 byte address
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Account`](../../index/type-aliases/Account.md)

### configAssetMetadataHash()

> **configAssetMetadataHash**(`t`): [`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

32 byte commitment to unspecified asset metadata
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

### configAssetName()

> **configAssetName**(`t`): [`bytes`](../../index/type-aliases/bytes.md)

The asset name
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### configAssetReserve()

> **configAssetReserve**(`t`): [`Account`](../../index/type-aliases/Account.md)

32 byte address
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Account`](../../index/type-aliases/Account.md)

### configAssetTotal()

> **configAssetTotal**(`t`): [`uint64`](../../index/type-aliases/uint64.md)

Total number of units of this asset created
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### configAssetUnitName()

> **configAssetUnitName**(`t`): [`bytes`](../../index/type-aliases/bytes.md)

Unit name of the asset
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### configAssetUrl()

> **configAssetUrl**(`t`): [`bytes`](../../index/type-aliases/bytes.md)

URL
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### createdApplicationId()

> **createdApplicationId**(`t`): [`Application`](../../index/type-aliases/Application.md)

ApplicationID allocated by the creation of an application (only with `itxn` in v5). Application mode only
Min AVM version: 5

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Application`](../../index/type-aliases/Application.md)

### createdAssetId()

> **createdAssetId**(`t`): [`Asset`](../../index/type-aliases/Asset.md)

Asset ID allocated by the creation of an ASA (only with `itxn` in v5). Application mode only
Min AVM version: 5

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Asset`](../../index/type-aliases/Asset.md)

### extraProgramPages()

> **extraProgramPages**(`t`): [`uint64`](../../index/type-aliases/uint64.md)

Number of additional pages for each of the application's approval and clear state programs. An ExtraProgramPages of 1 means 2048 more total bytes, or 1024 for each program.
Min AVM version: 4

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### fee()

> **fee**(`t`): [`uint64`](../../index/type-aliases/uint64.md)

microalgos
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### firstValid()

> **firstValid**(`t`): [`uint64`](../../index/type-aliases/uint64.md)

round number
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### firstValidTime()

> **firstValidTime**(`t`): [`uint64`](../../index/type-aliases/uint64.md)

UNIX timestamp of block before txn.FirstValid. Fails if negative
Min AVM version: 7

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### freezeAsset()

> **freezeAsset**(`t`): [`Asset`](../../index/type-aliases/Asset.md)

Asset ID being frozen or un-frozen
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Asset`](../../index/type-aliases/Asset.md)

### freezeAssetAccount()

> **freezeAssetAccount**(`t`): [`Account`](../../index/type-aliases/Account.md)

32 byte address of the account whose asset slot is being frozen or un-frozen
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Account`](../../index/type-aliases/Account.md)

### freezeAssetFrozen()

> **freezeAssetFrozen**(`t`): `boolean`

The new frozen value, 0 or 1
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

`boolean`

### globalNumByteSlice()

> **globalNumByteSlice**(`t`): [`uint64`](../../index/type-aliases/uint64.md)

Number of global state byteslices in ApplicationCall
Min AVM version: 3

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### globalNumUint()

> **globalNumUint**(`t`): [`uint64`](../../index/type-aliases/uint64.md)

Number of global state integers in ApplicationCall
Min AVM version: 3

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### groupIndex()

> **groupIndex**(`t`): [`uint64`](../../index/type-aliases/uint64.md)

Position of this transaction within an atomic transaction group. A stand-alone transaction is implicitly element 0 in a group of 1
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### lastLog()

> **lastLog**(`t`): [`bytes`](../../index/type-aliases/bytes.md)

The last message emitted. Empty bytes if none were emitted. Application mode only
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### lastValid()

> **lastValid**(`t`): [`uint64`](../../index/type-aliases/uint64.md)

round number
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### lease()

> **lease**(`t`): [`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

32 byte lease value
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

### localNumByteSlice()

> **localNumByteSlice**(`t`): [`uint64`](../../index/type-aliases/uint64.md)

Number of local state byteslices in ApplicationCall
Min AVM version: 3

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### localNumUint()

> **localNumUint**(`t`): [`uint64`](../../index/type-aliases/uint64.md)

Number of local state integers in ApplicationCall
Min AVM version: 3

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### logs()

> **logs**(`t`, `a`): [`bytes`](../../index/type-aliases/bytes.md)

Log messages emitted by an application call (only with `itxn` in v5). Application mode only
Min AVM version: 5

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### nonparticipation()

> **nonparticipation**(`t`): `boolean`

Marks an account nonparticipating for rewards
Min AVM version: 5

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

`boolean`

### note()

> **note**(`t`): [`bytes`](../../index/type-aliases/bytes.md)

Any data up to 1024 bytes
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### numAccounts()

> **numAccounts**(`t`): [`uint64`](../../index/type-aliases/uint64.md)

Number of Accounts
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### numAppArgs()

> **numAppArgs**(`t`): [`uint64`](../../index/type-aliases/uint64.md)

Number of ApplicationArgs
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### numApplications()

> **numApplications**(`t`): [`uint64`](../../index/type-aliases/uint64.md)

Number of Applications
Min AVM version: 3

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### numApprovalProgramPages()

> **numApprovalProgramPages**(`t`): [`uint64`](../../index/type-aliases/uint64.md)

Number of Approval Program pages
Min AVM version: 7

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### numAssets()

> **numAssets**(`t`): [`uint64`](../../index/type-aliases/uint64.md)

Number of Assets
Min AVM version: 3

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### numClearStateProgramPages()

> **numClearStateProgramPages**(`t`): [`uint64`](../../index/type-aliases/uint64.md)

Number of ClearState Program pages
Min AVM version: 7

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### numLogs()

> **numLogs**(`t`): [`uint64`](../../index/type-aliases/uint64.md)

Number of Logs (only with `itxn` in v5). Application mode only
Min AVM version: 5

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### onCompletion()

> **onCompletion**(`t`): [`OnCompleteAction`](../../index/enumerations/OnCompleteAction.md)

ApplicationCall transaction on completion action
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`OnCompleteAction`](../../index/enumerations/OnCompleteAction.md)

### receiver()

> **receiver**(`t`): [`Account`](../../index/type-aliases/Account.md)

32 byte address
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Account`](../../index/type-aliases/Account.md)

### rejectVersion()

> **rejectVersion**(`t`): [`uint64`](../../index/type-aliases/uint64.md)

Application version for which the txn must reject
Min AVM version: 12

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### rekeyTo()

> **rekeyTo**(`t`): [`Account`](../../index/type-aliases/Account.md)

32 byte Sender's new AuthAddr
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Account`](../../index/type-aliases/Account.md)

### selectionPk()

> **selectionPk**(`t`): [`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

32 byte address
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

### sender()

> **sender**(`t`): [`Account`](../../index/type-aliases/Account.md)

32 byte address
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Account`](../../index/type-aliases/Account.md)

### stateProofPk()

> **stateProofPk**(`t`): [`bytes`](../../index/type-aliases/bytes.md)\<`64`\>

State proof public key
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)\<`64`\>

### txId()

> **txId**(`t`): [`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

The computed ID for this transaction. 32 bytes.
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

### type()

> **type**(`t`): [`bytes`](../../index/type-aliases/bytes.md)

Transaction type as bytes
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### typeEnum()

> **typeEnum**(`t`): [`TransactionType`](../../index/enumerations/TransactionType.md)

Transaction type as integer
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`TransactionType`](../../index/enumerations/TransactionType.md)

### voteFirst()

> **voteFirst**(`t`): [`uint64`](../../index/type-aliases/uint64.md)

The first round that the participation key is valid.
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### voteKeyDilution()

> **voteKeyDilution**(`t`): [`uint64`](../../index/type-aliases/uint64.md)

Dilution for the 2-level participation key
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### voteLast()

> **voteLast**(`t`): [`uint64`](../../index/type-aliases/uint64.md)

The last round that the participation key is valid.
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### votePk()

> **votePk**(`t`): [`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

32 byte address
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

### xferAsset()

> **xferAsset**(`t`): [`Asset`](../../index/type-aliases/Asset.md)

Asset ID
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Asset`](../../index/type-aliases/Asset.md)
