---
title: Txn
type: doc
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / Txn

# Variable: Txn

> `const` **Txn**: `object`

Defined in: [op.ts:3509](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L3509)

Get values for the current executing transaction

## Type declaration

### amount

#### Get Signature

> **get** **amount**(): [`uint64`](../../index/type-aliases/uint64.md)

microalgos
Min AVM version: 1

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### applicationId

#### Get Signature

> **get** **applicationId**(): [`Application`](../../index/type-aliases/Application.md)

ApplicationID from ApplicationCall transaction
Min AVM version: 2

##### Returns

[`Application`](../../index/type-aliases/Application.md)

### approvalProgram

#### Get Signature

> **get** **approvalProgram**(): [`bytes`](../../index/type-aliases/bytes.md)

Approval program
Min AVM version: 2

##### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### assetAmount

#### Get Signature

> **get** **assetAmount**(): [`uint64`](../../index/type-aliases/uint64.md)

value in Asset's units
Min AVM version: 1

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### assetCloseTo

#### Get Signature

> **get** **assetCloseTo**(): [`Account`](../../index/type-aliases/Account.md)

32 byte address
Min AVM version: 1

##### Returns

[`Account`](../../index/type-aliases/Account.md)

### assetReceiver

#### Get Signature

> **get** **assetReceiver**(): [`Account`](../../index/type-aliases/Account.md)

32 byte address
Min AVM version: 1

##### Returns

[`Account`](../../index/type-aliases/Account.md)

### assetSender

#### Get Signature

> **get** **assetSender**(): [`Account`](../../index/type-aliases/Account.md)

32 byte address. Source of assets if Sender is the Asset's Clawback address.
Min AVM version: 1

##### Returns

[`Account`](../../index/type-aliases/Account.md)

### clearStateProgram

#### Get Signature

> **get** **clearStateProgram**(): [`bytes`](../../index/type-aliases/bytes.md)

Clear state program
Min AVM version: 2

##### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### closeRemainderTo

#### Get Signature

> **get** **closeRemainderTo**(): [`Account`](../../index/type-aliases/Account.md)

32 byte address
Min AVM version: 1

##### Returns

[`Account`](../../index/type-aliases/Account.md)

### configAsset

#### Get Signature

> **get** **configAsset**(): [`Asset`](../../index/type-aliases/Asset.md)

Asset ID in asset config transaction
Min AVM version: 2

##### Returns

[`Asset`](../../index/type-aliases/Asset.md)

### configAssetClawback

#### Get Signature

> **get** **configAssetClawback**(): [`Account`](../../index/type-aliases/Account.md)

32 byte address
Min AVM version: 2

##### Returns

[`Account`](../../index/type-aliases/Account.md)

### configAssetDecimals

#### Get Signature

> **get** **configAssetDecimals**(): [`uint64`](../../index/type-aliases/uint64.md)

Number of digits to display after the decimal place when displaying the asset
Min AVM version: 2

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### configAssetDefaultFrozen

#### Get Signature

> **get** **configAssetDefaultFrozen**(): `boolean`

Whether the asset's slots are frozen by default or not, 0 or 1
Min AVM version: 2

##### Returns

`boolean`

### configAssetFreeze

#### Get Signature

> **get** **configAssetFreeze**(): [`Account`](../../index/type-aliases/Account.md)

32 byte address
Min AVM version: 2

##### Returns

[`Account`](../../index/type-aliases/Account.md)

### configAssetManager

#### Get Signature

> **get** **configAssetManager**(): [`Account`](../../index/type-aliases/Account.md)

32 byte address
Min AVM version: 2

##### Returns

[`Account`](../../index/type-aliases/Account.md)

### configAssetMetadataHash

#### Get Signature

> **get** **configAssetMetadataHash**(): [`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

32 byte commitment to unspecified asset metadata
Min AVM version: 2

##### Returns

[`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

### configAssetName

#### Get Signature

> **get** **configAssetName**(): [`bytes`](../../index/type-aliases/bytes.md)

The asset name
Min AVM version: 2

##### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### configAssetReserve

#### Get Signature

> **get** **configAssetReserve**(): [`Account`](../../index/type-aliases/Account.md)

32 byte address
Min AVM version: 2

##### Returns

[`Account`](../../index/type-aliases/Account.md)

### configAssetTotal

#### Get Signature

> **get** **configAssetTotal**(): [`uint64`](../../index/type-aliases/uint64.md)

Total number of units of this asset created
Min AVM version: 2

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### configAssetUnitName

#### Get Signature

> **get** **configAssetUnitName**(): [`bytes`](../../index/type-aliases/bytes.md)

Unit name of the asset
Min AVM version: 2

##### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### configAssetUrl

#### Get Signature

> **get** **configAssetUrl**(): [`bytes`](../../index/type-aliases/bytes.md)

URL
Min AVM version: 2

##### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### createdApplicationId

#### Get Signature

> **get** **createdApplicationId**(): [`Application`](../../index/type-aliases/Application.md)

ApplicationID allocated by the creation of an application (only with `itxn` in v5). Application mode only
Min AVM version: 5

##### Returns

[`Application`](../../index/type-aliases/Application.md)

### createdAssetId

#### Get Signature

> **get** **createdAssetId**(): [`Asset`](../../index/type-aliases/Asset.md)

Asset ID allocated by the creation of an ASA (only with `itxn` in v5). Application mode only
Min AVM version: 5

##### Returns

[`Asset`](../../index/type-aliases/Asset.md)

### extraProgramPages

#### Get Signature

> **get** **extraProgramPages**(): [`uint64`](../../index/type-aliases/uint64.md)

Number of additional pages for each of the application's approval and clear state programs. An ExtraProgramPages of 1 means 2048 more total bytes, or 1024 for each program.
Min AVM version: 4

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### fee

#### Get Signature

> **get** **fee**(): [`uint64`](../../index/type-aliases/uint64.md)

microalgos
Min AVM version: 1

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### firstValid

#### Get Signature

> **get** **firstValid**(): [`uint64`](../../index/type-aliases/uint64.md)

round number
Min AVM version: 1

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### firstValidTime

#### Get Signature

> **get** **firstValidTime**(): [`uint64`](../../index/type-aliases/uint64.md)

UNIX timestamp of block before txn.FirstValid. Fails if negative
Min AVM version: 7

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### freezeAsset

#### Get Signature

> **get** **freezeAsset**(): [`Asset`](../../index/type-aliases/Asset.md)

Asset ID being frozen or un-frozen
Min AVM version: 2

##### Returns

[`Asset`](../../index/type-aliases/Asset.md)

### freezeAssetAccount

#### Get Signature

> **get** **freezeAssetAccount**(): [`Account`](../../index/type-aliases/Account.md)

32 byte address of the account whose asset slot is being frozen or un-frozen
Min AVM version: 2

##### Returns

[`Account`](../../index/type-aliases/Account.md)

### freezeAssetFrozen

#### Get Signature

> **get** **freezeAssetFrozen**(): `boolean`

The new frozen value, 0 or 1
Min AVM version: 2

##### Returns

`boolean`

### globalNumByteSlice

#### Get Signature

> **get** **globalNumByteSlice**(): [`uint64`](../../index/type-aliases/uint64.md)

Number of global state byteslices in ApplicationCall
Min AVM version: 3

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### globalNumUint

#### Get Signature

> **get** **globalNumUint**(): [`uint64`](../../index/type-aliases/uint64.md)

Number of global state integers in ApplicationCall
Min AVM version: 3

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### groupIndex

#### Get Signature

> **get** **groupIndex**(): [`uint64`](../../index/type-aliases/uint64.md)

Position of this transaction within an atomic transaction group. A stand-alone transaction is implicitly element 0 in a group of 1
Min AVM version: 1

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### lastLog

#### Get Signature

> **get** **lastLog**(): [`bytes`](../../index/type-aliases/bytes.md)

The last message emitted. Empty bytes if none were emitted. Application mode only
Min AVM version: 6

##### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### lastValid

#### Get Signature

> **get** **lastValid**(): [`uint64`](../../index/type-aliases/uint64.md)

round number
Min AVM version: 1

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### lease

#### Get Signature

> **get** **lease**(): [`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

32 byte lease value
Min AVM version: 1

##### Returns

[`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

### localNumByteSlice

#### Get Signature

> **get** **localNumByteSlice**(): [`uint64`](../../index/type-aliases/uint64.md)

Number of local state byteslices in ApplicationCall
Min AVM version: 3

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### localNumUint

#### Get Signature

> **get** **localNumUint**(): [`uint64`](../../index/type-aliases/uint64.md)

Number of local state integers in ApplicationCall
Min AVM version: 3

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### nonparticipation

#### Get Signature

> **get** **nonparticipation**(): `boolean`

Marks an account nonparticipating for rewards
Min AVM version: 5

##### Returns

`boolean`

### note

#### Get Signature

> **get** **note**(): [`bytes`](../../index/type-aliases/bytes.md)

Any data up to 1024 bytes
Min AVM version: 1

##### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### numAccounts

#### Get Signature

> **get** **numAccounts**(): [`uint64`](../../index/type-aliases/uint64.md)

Number of Accounts
Min AVM version: 2

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### numAppArgs

#### Get Signature

> **get** **numAppArgs**(): [`uint64`](../../index/type-aliases/uint64.md)

Number of ApplicationArgs
Min AVM version: 2

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### numApplications

#### Get Signature

> **get** **numApplications**(): [`uint64`](../../index/type-aliases/uint64.md)

Number of Applications
Min AVM version: 3

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### numApprovalProgramPages

#### Get Signature

> **get** **numApprovalProgramPages**(): [`uint64`](../../index/type-aliases/uint64.md)

Number of Approval Program pages
Min AVM version: 7

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### numAssets

#### Get Signature

> **get** **numAssets**(): [`uint64`](../../index/type-aliases/uint64.md)

Number of Assets
Min AVM version: 3

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### numClearStateProgramPages

#### Get Signature

> **get** **numClearStateProgramPages**(): [`uint64`](../../index/type-aliases/uint64.md)

Number of ClearState Program pages
Min AVM version: 7

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### numLogs

#### Get Signature

> **get** **numLogs**(): [`uint64`](../../index/type-aliases/uint64.md)

Number of Logs (only with `itxn` in v5). Application mode only
Min AVM version: 5

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### onCompletion

#### Get Signature

> **get** **onCompletion**(): [`OnCompleteAction`](../../index/enumerations/OnCompleteAction.md)

ApplicationCall transaction on completion action
Min AVM version: 2

##### Returns

[`OnCompleteAction`](../../index/enumerations/OnCompleteAction.md)

### receiver

#### Get Signature

> **get** **receiver**(): [`Account`](../../index/type-aliases/Account.md)

32 byte address
Min AVM version: 1

##### Returns

[`Account`](../../index/type-aliases/Account.md)

### rejectVersion

#### Get Signature

> **get** **rejectVersion**(): [`uint64`](../../index/type-aliases/uint64.md)

Application version for which the txn must reject
Min AVM version: 12

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### rekeyTo

#### Get Signature

> **get** **rekeyTo**(): [`Account`](../../index/type-aliases/Account.md)

32 byte Sender's new AuthAddr
Min AVM version: 2

##### Returns

[`Account`](../../index/type-aliases/Account.md)

### selectionPk

#### Get Signature

> **get** **selectionPk**(): [`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

32 byte address
Min AVM version: 1

##### Returns

[`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

### sender

#### Get Signature

> **get** **sender**(): [`Account`](../../index/type-aliases/Account.md)

32 byte address
Min AVM version: 1

##### Returns

[`Account`](../../index/type-aliases/Account.md)

### stateProofPk

#### Get Signature

> **get** **stateProofPk**(): [`bytes`](../../index/type-aliases/bytes.md)\<`64`\>

State proof public key
Min AVM version: 6

##### Returns

[`bytes`](../../index/type-aliases/bytes.md)\<`64`\>

### txId

#### Get Signature

> **get** **txId**(): [`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

The computed ID for this transaction. 32 bytes.
Min AVM version: 1

##### Returns

[`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

### type

#### Get Signature

> **get** **type**(): [`bytes`](../../index/type-aliases/bytes.md)

Transaction type as bytes
Min AVM version: 1

##### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### typeEnum

#### Get Signature

> **get** **typeEnum**(): [`TransactionType`](../../index/enumerations/TransactionType.md)

Transaction type as integer
Min AVM version: 1

##### Returns

[`TransactionType`](../../index/enumerations/TransactionType.md)

### voteFirst

#### Get Signature

> **get** **voteFirst**(): [`uint64`](../../index/type-aliases/uint64.md)

The first round that the participation key is valid.
Min AVM version: 1

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### voteKeyDilution

#### Get Signature

> **get** **voteKeyDilution**(): [`uint64`](../../index/type-aliases/uint64.md)

Dilution for the 2-level participation key
Min AVM version: 1

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### voteLast

#### Get Signature

> **get** **voteLast**(): [`uint64`](../../index/type-aliases/uint64.md)

The last round that the participation key is valid.
Min AVM version: 1

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### votePk

#### Get Signature

> **get** **votePk**(): [`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

32 byte address
Min AVM version: 1

##### Returns

[`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

### xferAsset

#### Get Signature

> **get** **xferAsset**(): [`Asset`](../../index/type-aliases/Asset.md)

Asset ID
Min AVM version: 1

##### Returns

[`Asset`](../../index/type-aliases/Asset.md)

### accounts()

> **accounts**(`a`): [`Account`](../../index/type-aliases/Account.md)

Accounts listed in the ApplicationCall transaction
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Account`](../../index/type-aliases/Account.md)

### applicationArgs()

> **applicationArgs**(`a`): [`bytes`](../../index/type-aliases/bytes.md)

Arguments passed to the application in the ApplicationCall transaction
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### applications()

> **applications**(`a`): [`Application`](../../index/type-aliases/Application.md)

Foreign Apps listed in the ApplicationCall transaction
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Application`](../../index/type-aliases/Application.md)

### approvalProgramPages()

> **approvalProgramPages**(`a`): [`bytes`](../../index/type-aliases/bytes.md)

Approval Program as an array of pages
Min AVM version: 7

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### assets()

> **assets**(`a`): [`Asset`](../../index/type-aliases/Asset.md)

Foreign Assets listed in the ApplicationCall transaction
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`Asset`](../../index/type-aliases/Asset.md)

### clearStateProgramPages()

> **clearStateProgramPages**(`a`): [`bytes`](../../index/type-aliases/bytes.md)

ClearState Program as an array of pages
Min AVM version: 7

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### logs()

> **logs**(`a`): [`bytes`](../../index/type-aliases/bytes.md)

Log messages emitted by an application call (only with `itxn` in v5). Application mode only
Min AVM version: 5

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)
