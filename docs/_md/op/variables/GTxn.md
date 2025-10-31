---
title: GTxn
type: doc
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / GTxn

# Variable: GTxn

> `const` **GTxn**: `object`

Defined in: [op.ts:1740](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L1740)

Get values for transactions in the current group

## Type declaration

### accounts()

> **accounts**(`a`, `b`): [`Account`](../../index/type-aliases/Account.md)

Accounts listed in the ApplicationCall transaction
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

##### b

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Account`](../../index/type-aliases/Account.md)

### amount()

> **amount**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

microalgos
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### applicationArgs()

> **applicationArgs**(`a`, `b`): [`bytes`](../../index/type-aliases/bytes.md)

Arguments passed to the application in the ApplicationCall transaction
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

##### b

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### applicationId()

> **applicationId**(`a`): [`Application`](../../index/type-aliases/Application.md)

ApplicationID from ApplicationCall transaction
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Application`](../../index/type-aliases/Application.md)

### applications()

> **applications**(`a`, `b`): [`Application`](../../index/type-aliases/Application.md)

Foreign Apps listed in the ApplicationCall transaction
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

##### b

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Application`](../../index/type-aliases/Application.md)

### approvalProgram()

> **approvalProgram**(`a`): [`bytes`](../../index/type-aliases/bytes.md)

Approval program
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### approvalProgramPages()

> **approvalProgramPages**(`a`, `b`): [`bytes`](../../index/type-aliases/bytes.md)

Approval Program as an array of pages
Min AVM version: 7

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

##### b

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### assetAmount()

> **assetAmount**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

value in Asset's units
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### assetCloseTo()

> **assetCloseTo**(`a`): [`Account`](../../index/type-aliases/Account.md)

32 byte address
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Account`](../../index/type-aliases/Account.md)

### assetReceiver()

> **assetReceiver**(`a`): [`Account`](../../index/type-aliases/Account.md)

32 byte address
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Account`](../../index/type-aliases/Account.md)

### assets()

> **assets**(`a`, `b`): [`Asset`](../../index/type-aliases/Asset.md)

Foreign Assets listed in the ApplicationCall transaction
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

##### b

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Asset`](../../index/type-aliases/Asset.md)

### assetSender()

> **assetSender**(`a`): [`Account`](../../index/type-aliases/Account.md)

32 byte address. Source of assets if Sender is the Asset's Clawback address.
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Account`](../../index/type-aliases/Account.md)

### clearStateProgram()

> **clearStateProgram**(`a`): [`bytes`](../../index/type-aliases/bytes.md)

Clear state program
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### clearStateProgramPages()

> **clearStateProgramPages**(`a`, `b`): [`bytes`](../../index/type-aliases/bytes.md)

ClearState Program as an array of pages
Min AVM version: 7

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

##### b

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### closeRemainderTo()

> **closeRemainderTo**(`a`): [`Account`](../../index/type-aliases/Account.md)

32 byte address
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Account`](../../index/type-aliases/Account.md)

### configAsset()

> **configAsset**(`a`): [`Asset`](../../index/type-aliases/Asset.md)

Asset ID in asset config transaction
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Asset`](../../index/type-aliases/Asset.md)

### configAssetClawback()

> **configAssetClawback**(`a`): [`Account`](../../index/type-aliases/Account.md)

32 byte address
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Account`](../../index/type-aliases/Account.md)

### configAssetDecimals()

> **configAssetDecimals**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

Number of digits to display after the decimal place when displaying the asset
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### configAssetDefaultFrozen()

> **configAssetDefaultFrozen**(`a`): `boolean`

Whether the asset's slots are frozen by default or not, 0 or 1
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

`boolean`

### configAssetFreeze()

> **configAssetFreeze**(`a`): [`Account`](../../index/type-aliases/Account.md)

32 byte address
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Account`](../../index/type-aliases/Account.md)

### configAssetManager()

> **configAssetManager**(`a`): [`Account`](../../index/type-aliases/Account.md)

32 byte address
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Account`](../../index/type-aliases/Account.md)

### configAssetMetadataHash()

> **configAssetMetadataHash**(`a`): [`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

32 byte commitment to unspecified asset metadata
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

### configAssetName()

> **configAssetName**(`a`): [`bytes`](../../index/type-aliases/bytes.md)

The asset name
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### configAssetReserve()

> **configAssetReserve**(`a`): [`Account`](../../index/type-aliases/Account.md)

32 byte address
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Account`](../../index/type-aliases/Account.md)

### configAssetTotal()

> **configAssetTotal**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

Total number of units of this asset created
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### configAssetUnitName()

> **configAssetUnitName**(`a`): [`bytes`](../../index/type-aliases/bytes.md)

Unit name of the asset
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### configAssetUrl()

> **configAssetUrl**(`a`): [`bytes`](../../index/type-aliases/bytes.md)

URL
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### createdApplicationId()

> **createdApplicationId**(`a`): [`Application`](../../index/type-aliases/Application.md)

ApplicationID allocated by the creation of an application (only with `itxn` in v5). Application mode only
Min AVM version: 5

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Application`](../../index/type-aliases/Application.md)

### createdAssetId()

> **createdAssetId**(`a`): [`Asset`](../../index/type-aliases/Asset.md)

Asset ID allocated by the creation of an ASA (only with `itxn` in v5). Application mode only
Min AVM version: 5

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Asset`](../../index/type-aliases/Asset.md)

### extraProgramPages()

> **extraProgramPages**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

Number of additional pages for each of the application's approval and clear state programs. An ExtraProgramPages of 1 means 2048 more total bytes, or 1024 for each program.
Min AVM version: 4

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### fee()

> **fee**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

microalgos
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### firstValid()

> **firstValid**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

round number
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### firstValidTime()

> **firstValidTime**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

UNIX timestamp of block before txn.FirstValid. Fails if negative
Min AVM version: 7

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### freezeAsset()

> **freezeAsset**(`a`): [`Asset`](../../index/type-aliases/Asset.md)

Asset ID being frozen or un-frozen
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Asset`](../../index/type-aliases/Asset.md)

### freezeAssetAccount()

> **freezeAssetAccount**(`a`): [`Account`](../../index/type-aliases/Account.md)

32 byte address of the account whose asset slot is being frozen or un-frozen
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Account`](../../index/type-aliases/Account.md)

### freezeAssetFrozen()

> **freezeAssetFrozen**(`a`): `boolean`

The new frozen value, 0 or 1
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

`boolean`

### globalNumByteSlice()

> **globalNumByteSlice**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

Number of global state byteslices in ApplicationCall
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### globalNumUint()

> **globalNumUint**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

Number of global state integers in ApplicationCall
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### groupIndex()

> **groupIndex**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

Position of this transaction within an atomic transaction group. A stand-alone transaction is implicitly element 0 in a group of 1
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### lastLog()

> **lastLog**(`a`): [`bytes`](../../index/type-aliases/bytes.md)

The last message emitted. Empty bytes if none were emitted. Application mode only
Min AVM version: 6

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### lastValid()

> **lastValid**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

round number
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### lease()

> **lease**(`a`): [`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

32 byte lease value
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

### localNumByteSlice()

> **localNumByteSlice**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

Number of local state byteslices in ApplicationCall
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### localNumUint()

> **localNumUint**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

Number of local state integers in ApplicationCall
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### logs()

> **logs**(`a`, `b`): [`bytes`](../../index/type-aliases/bytes.md)

Log messages emitted by an application call (only with `itxn` in v5). Application mode only
Min AVM version: 5

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

##### b

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### nonparticipation()

> **nonparticipation**(`a`): `boolean`

Marks an account nonparticipating for rewards
Min AVM version: 5

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

`boolean`

### note()

> **note**(`a`): [`bytes`](../../index/type-aliases/bytes.md)

Any data up to 1024 bytes
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### numAccounts()

> **numAccounts**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

Number of Accounts
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### numAppArgs()

> **numAppArgs**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

Number of ApplicationArgs
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### numApplications()

> **numApplications**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

Number of Applications
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### numApprovalProgramPages()

> **numApprovalProgramPages**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

Number of Approval Program pages
Min AVM version: 7

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### numAssets()

> **numAssets**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

Number of Assets
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### numClearStateProgramPages()

> **numClearStateProgramPages**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

Number of ClearState Program pages
Min AVM version: 7

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### numLogs()

> **numLogs**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

Number of Logs (only with `itxn` in v5). Application mode only
Min AVM version: 5

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### onCompletion()

> **onCompletion**(`a`): [`OnCompleteAction`](../../index/enumerations/OnCompleteAction.md)

ApplicationCall transaction on completion action
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`OnCompleteAction`](../../index/enumerations/OnCompleteAction.md)

### receiver()

> **receiver**(`a`): [`Account`](../../index/type-aliases/Account.md)

32 byte address
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Account`](../../index/type-aliases/Account.md)

### rejectVersion()

> **rejectVersion**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

Application version for which the txn must reject
Min AVM version: 12

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### rekeyTo()

> **rekeyTo**(`a`): [`Account`](../../index/type-aliases/Account.md)

32 byte Sender's new AuthAddr
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Account`](../../index/type-aliases/Account.md)

### selectionPk()

> **selectionPk**(`a`): [`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

32 byte address
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

### sender()

> **sender**(`a`): [`Account`](../../index/type-aliases/Account.md)

32 byte address
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Account`](../../index/type-aliases/Account.md)

### stateProofPk()

> **stateProofPk**(`a`): [`bytes`](../../index/type-aliases/bytes.md)\<`64`\>

State proof public key
Min AVM version: 6

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)\<`64`\>

### txId()

> **txId**(`a`): [`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

The computed ID for this transaction. 32 bytes.
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

### type()

> **type**(`a`): [`bytes`](../../index/type-aliases/bytes.md)

Transaction type as bytes
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### typeEnum()

> **typeEnum**(`a`): [`TransactionType`](../../index/enumerations/TransactionType.md)

Transaction type as integer
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`TransactionType`](../../index/enumerations/TransactionType.md)

### voteFirst()

> **voteFirst**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

The first round that the participation key is valid.
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### voteKeyDilution()

> **voteKeyDilution**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

Dilution for the 2-level participation key
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### voteLast()

> **voteLast**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

The last round that the participation key is valid.
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### votePk()

> **votePk**(`a`): [`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

32 byte address
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

### xferAsset()

> **xferAsset**(`a`): [`Asset`](../../index/type-aliases/Asset.md)

Asset ID
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Asset`](../../index/type-aliases/Asset.md)
