[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / Txn

# Variable: Txn

> `const` **Txn**: `object`

Defined in: [packages/algo-ts/src/op.ts:3455](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L3455)

Get values for the current executing transaction

## Type declaration

### amount

#### Get Signature

> **get** **amount**(): [`uint64`](../../../type-aliases/uint64.md)

microalgos
Min AVM version: 1

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

### applicationId

#### Get Signature

> **get** **applicationId**(): [`Application`](../../../type-aliases/Application.md)

ApplicationID from ApplicationCall transaction
Min AVM version: 2

##### Returns

[`Application`](../../../type-aliases/Application.md)

### approvalProgram

#### Get Signature

> **get** **approvalProgram**(): [`bytes`](../../../type-aliases/bytes.md)

Approval program
Min AVM version: 2

##### Returns

[`bytes`](../../../type-aliases/bytes.md)

### assetAmount

#### Get Signature

> **get** **assetAmount**(): [`uint64`](../../../type-aliases/uint64.md)

value in Asset's units
Min AVM version: 1

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

### assetCloseTo

#### Get Signature

> **get** **assetCloseTo**(): [`Account`](../../../type-aliases/Account.md)

32 byte address
Min AVM version: 1

##### Returns

[`Account`](../../../type-aliases/Account.md)

### assetReceiver

#### Get Signature

> **get** **assetReceiver**(): [`Account`](../../../type-aliases/Account.md)

32 byte address
Min AVM version: 1

##### Returns

[`Account`](../../../type-aliases/Account.md)

### assetSender

#### Get Signature

> **get** **assetSender**(): [`Account`](../../../type-aliases/Account.md)

32 byte address. Source of assets if Sender is the Asset's Clawback address.
Min AVM version: 1

##### Returns

[`Account`](../../../type-aliases/Account.md)

### clearStateProgram

#### Get Signature

> **get** **clearStateProgram**(): [`bytes`](../../../type-aliases/bytes.md)

Clear state program
Min AVM version: 2

##### Returns

[`bytes`](../../../type-aliases/bytes.md)

### closeRemainderTo

#### Get Signature

> **get** **closeRemainderTo**(): [`Account`](../../../type-aliases/Account.md)

32 byte address
Min AVM version: 1

##### Returns

[`Account`](../../../type-aliases/Account.md)

### configAsset

#### Get Signature

> **get** **configAsset**(): [`Asset`](../../../type-aliases/Asset.md)

Asset ID in asset config transaction
Min AVM version: 2

##### Returns

[`Asset`](../../../type-aliases/Asset.md)

### configAssetClawback

#### Get Signature

> **get** **configAssetClawback**(): [`Account`](../../../type-aliases/Account.md)

32 byte address
Min AVM version: 2

##### Returns

[`Account`](../../../type-aliases/Account.md)

### configAssetDecimals

#### Get Signature

> **get** **configAssetDecimals**(): [`uint64`](../../../type-aliases/uint64.md)

Number of digits to display after the decimal place when displaying the asset
Min AVM version: 2

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

### configAssetDefaultFrozen

#### Get Signature

> **get** **configAssetDefaultFrozen**(): `boolean`

Whether the asset's slots are frozen by default or not, 0 or 1
Min AVM version: 2

##### Returns

`boolean`

### configAssetFreeze

#### Get Signature

> **get** **configAssetFreeze**(): [`Account`](../../../type-aliases/Account.md)

32 byte address
Min AVM version: 2

##### Returns

[`Account`](../../../type-aliases/Account.md)

### configAssetManager

#### Get Signature

> **get** **configAssetManager**(): [`Account`](../../../type-aliases/Account.md)

32 byte address
Min AVM version: 2

##### Returns

[`Account`](../../../type-aliases/Account.md)

### configAssetMetadataHash

#### Get Signature

> **get** **configAssetMetadataHash**(): [`bytes`](../../../type-aliases/bytes.md)

32 byte commitment to unspecified asset metadata
Min AVM version: 2

##### Returns

[`bytes`](../../../type-aliases/bytes.md)

### configAssetName

#### Get Signature

> **get** **configAssetName**(): [`bytes`](../../../type-aliases/bytes.md)

The asset name
Min AVM version: 2

##### Returns

[`bytes`](../../../type-aliases/bytes.md)

### configAssetReserve

#### Get Signature

> **get** **configAssetReserve**(): [`Account`](../../../type-aliases/Account.md)

32 byte address
Min AVM version: 2

##### Returns

[`Account`](../../../type-aliases/Account.md)

### configAssetTotal

#### Get Signature

> **get** **configAssetTotal**(): [`uint64`](../../../type-aliases/uint64.md)

Total number of units of this asset created
Min AVM version: 2

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

### configAssetUnitName

#### Get Signature

> **get** **configAssetUnitName**(): [`bytes`](../../../type-aliases/bytes.md)

Unit name of the asset
Min AVM version: 2

##### Returns

[`bytes`](../../../type-aliases/bytes.md)

### configAssetUrl

#### Get Signature

> **get** **configAssetUrl**(): [`bytes`](../../../type-aliases/bytes.md)

URL
Min AVM version: 2

##### Returns

[`bytes`](../../../type-aliases/bytes.md)

### createdApplicationId

#### Get Signature

> **get** **createdApplicationId**(): [`Application`](../../../type-aliases/Application.md)

ApplicationID allocated by the creation of an application (only with `itxn` in v5). Application mode only
Min AVM version: 5

##### Returns

[`Application`](../../../type-aliases/Application.md)

### createdAssetId

#### Get Signature

> **get** **createdAssetId**(): [`Asset`](../../../type-aliases/Asset.md)

Asset ID allocated by the creation of an ASA (only with `itxn` in v5). Application mode only
Min AVM version: 5

##### Returns

[`Asset`](../../../type-aliases/Asset.md)

### extraProgramPages

#### Get Signature

> **get** **extraProgramPages**(): [`uint64`](../../../type-aliases/uint64.md)

Number of additional pages for each of the application's approval and clear state programs. An ExtraProgramPages of 1 means 2048 more total bytes, or 1024 for each program.
Min AVM version: 4

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

### fee

#### Get Signature

> **get** **fee**(): [`uint64`](../../../type-aliases/uint64.md)

microalgos
Min AVM version: 1

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

### firstValid

#### Get Signature

> **get** **firstValid**(): [`uint64`](../../../type-aliases/uint64.md)

round number
Min AVM version: 1

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

### firstValidTime

#### Get Signature

> **get** **firstValidTime**(): [`uint64`](../../../type-aliases/uint64.md)

UNIX timestamp of block before txn.FirstValid. Fails if negative
Min AVM version: 7

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

### freezeAsset

#### Get Signature

> **get** **freezeAsset**(): [`Asset`](../../../type-aliases/Asset.md)

Asset ID being frozen or un-frozen
Min AVM version: 2

##### Returns

[`Asset`](../../../type-aliases/Asset.md)

### freezeAssetAccount

#### Get Signature

> **get** **freezeAssetAccount**(): [`Account`](../../../type-aliases/Account.md)

32 byte address of the account whose asset slot is being frozen or un-frozen
Min AVM version: 2

##### Returns

[`Account`](../../../type-aliases/Account.md)

### freezeAssetFrozen

#### Get Signature

> **get** **freezeAssetFrozen**(): `boolean`

The new frozen value, 0 or 1
Min AVM version: 2

##### Returns

`boolean`

### globalNumByteSlice

#### Get Signature

> **get** **globalNumByteSlice**(): [`uint64`](../../../type-aliases/uint64.md)

Number of global state byteslices in ApplicationCall
Min AVM version: 3

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

### globalNumUint

#### Get Signature

> **get** **globalNumUint**(): [`uint64`](../../../type-aliases/uint64.md)

Number of global state integers in ApplicationCall
Min AVM version: 3

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

### groupIndex

#### Get Signature

> **get** **groupIndex**(): [`uint64`](../../../type-aliases/uint64.md)

Position of this transaction within an atomic transaction group. A stand-alone transaction is implicitly element 0 in a group of 1
Min AVM version: 1

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

### lastLog

#### Get Signature

> **get** **lastLog**(): [`bytes`](../../../type-aliases/bytes.md)

The last message emitted. Empty bytes if none were emitted. Application mode only
Min AVM version: 6

##### Returns

[`bytes`](../../../type-aliases/bytes.md)

### lastValid

#### Get Signature

> **get** **lastValid**(): [`uint64`](../../../type-aliases/uint64.md)

round number
Min AVM version: 1

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

### lease

#### Get Signature

> **get** **lease**(): [`bytes`](../../../type-aliases/bytes.md)

32 byte lease value
Min AVM version: 1

##### Returns

[`bytes`](../../../type-aliases/bytes.md)

### localNumByteSlice

#### Get Signature

> **get** **localNumByteSlice**(): [`uint64`](../../../type-aliases/uint64.md)

Number of local state byteslices in ApplicationCall
Min AVM version: 3

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

### localNumUint

#### Get Signature

> **get** **localNumUint**(): [`uint64`](../../../type-aliases/uint64.md)

Number of local state integers in ApplicationCall
Min AVM version: 3

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

### nonparticipation

#### Get Signature

> **get** **nonparticipation**(): `boolean`

Marks an account nonparticipating for rewards
Min AVM version: 5

##### Returns

`boolean`

### note

#### Get Signature

> **get** **note**(): [`bytes`](../../../type-aliases/bytes.md)

Any data up to 1024 bytes
Min AVM version: 1

##### Returns

[`bytes`](../../../type-aliases/bytes.md)

### numAccounts

#### Get Signature

> **get** **numAccounts**(): [`uint64`](../../../type-aliases/uint64.md)

Number of Accounts
Min AVM version: 2

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

### numAppArgs

#### Get Signature

> **get** **numAppArgs**(): [`uint64`](../../../type-aliases/uint64.md)

Number of ApplicationArgs
Min AVM version: 2

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

### numApplications

#### Get Signature

> **get** **numApplications**(): [`uint64`](../../../type-aliases/uint64.md)

Number of Applications
Min AVM version: 3

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

### numApprovalProgramPages

#### Get Signature

> **get** **numApprovalProgramPages**(): [`uint64`](../../../type-aliases/uint64.md)

Number of Approval Program pages
Min AVM version: 7

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

### numAssets

#### Get Signature

> **get** **numAssets**(): [`uint64`](../../../type-aliases/uint64.md)

Number of Assets
Min AVM version: 3

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

### numClearStateProgramPages

#### Get Signature

> **get** **numClearStateProgramPages**(): [`uint64`](../../../type-aliases/uint64.md)

Number of ClearState Program pages
Min AVM version: 7

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

### numLogs

#### Get Signature

> **get** **numLogs**(): [`uint64`](../../../type-aliases/uint64.md)

Number of Logs (only with `itxn` in v5). Application mode only
Min AVM version: 5

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

### onCompletion

#### Get Signature

> **get** **onCompletion**(): [`uint64`](../../../type-aliases/uint64.md)

ApplicationCall transaction on completion action
Min AVM version: 2

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

### receiver

#### Get Signature

> **get** **receiver**(): [`Account`](../../../type-aliases/Account.md)

32 byte address
Min AVM version: 1

##### Returns

[`Account`](../../../type-aliases/Account.md)

### rekeyTo

#### Get Signature

> **get** **rekeyTo**(): [`Account`](../../../type-aliases/Account.md)

32 byte Sender's new AuthAddr
Min AVM version: 2

##### Returns

[`Account`](../../../type-aliases/Account.md)

### selectionPk

#### Get Signature

> **get** **selectionPk**(): [`bytes`](../../../type-aliases/bytes.md)

32 byte address
Min AVM version: 1

##### Returns

[`bytes`](../../../type-aliases/bytes.md)

### sender

#### Get Signature

> **get** **sender**(): [`Account`](../../../type-aliases/Account.md)

32 byte address
Min AVM version: 1

##### Returns

[`Account`](../../../type-aliases/Account.md)

### stateProofPk

#### Get Signature

> **get** **stateProofPk**(): [`bytes`](../../../type-aliases/bytes.md)

64 byte state proof public key
Min AVM version: 6

##### Returns

[`bytes`](../../../type-aliases/bytes.md)

### txId

#### Get Signature

> **get** **txId**(): [`bytes`](../../../type-aliases/bytes.md)

The computed ID for this transaction. 32 bytes.
Min AVM version: 1

##### Returns

[`bytes`](../../../type-aliases/bytes.md)

### type

#### Get Signature

> **get** **type**(): [`bytes`](../../../type-aliases/bytes.md)

Transaction type as bytes
Min AVM version: 1

##### Returns

[`bytes`](../../../type-aliases/bytes.md)

### typeEnum

#### Get Signature

> **get** **typeEnum**(): [`uint64`](../../../type-aliases/uint64.md)

Transaction type as integer
Min AVM version: 1

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

### voteFirst

#### Get Signature

> **get** **voteFirst**(): [`uint64`](../../../type-aliases/uint64.md)

The first round that the participation key is valid.
Min AVM version: 1

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

### voteKeyDilution

#### Get Signature

> **get** **voteKeyDilution**(): [`uint64`](../../../type-aliases/uint64.md)

Dilution for the 2-level participation key
Min AVM version: 1

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

### voteLast

#### Get Signature

> **get** **voteLast**(): [`uint64`](../../../type-aliases/uint64.md)

The last round that the participation key is valid.
Min AVM version: 1

##### Returns

[`uint64`](../../../type-aliases/uint64.md)

### votePk

#### Get Signature

> **get** **votePk**(): [`bytes`](../../../type-aliases/bytes.md)

32 byte address
Min AVM version: 1

##### Returns

[`bytes`](../../../type-aliases/bytes.md)

### xferAsset

#### Get Signature

> **get** **xferAsset**(): [`Asset`](../../../type-aliases/Asset.md)

Asset ID
Min AVM version: 1

##### Returns

[`Asset`](../../../type-aliases/Asset.md)

### accounts()

Accounts listed in the ApplicationCall transaction
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`Account`](../../../type-aliases/Account.md)

### applicationArgs()

Arguments passed to the application in the ApplicationCall transaction
Min AVM version: 2

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

### applications()

Foreign Apps listed in the ApplicationCall transaction
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`Application`](../../../type-aliases/Application.md)

### approvalProgramPages()

Approval Program as an array of pages
Min AVM version: 7

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

### assets()

Foreign Assets listed in the ApplicationCall transaction
Min AVM version: 3

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`Asset`](../../../type-aliases/Asset.md)

### clearStateProgramPages()

ClearState Program as an array of pages
Min AVM version: 7

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

### logs()

Log messages emitted by an application call (only with `itxn` in v5). Application mode only
Min AVM version: 5

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)
