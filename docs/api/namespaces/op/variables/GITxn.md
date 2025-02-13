[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / GITxn

# Variable: GITxn

> `const` **GITxn**: `object`

Defined in: [packages/algo-ts/src/op.ts:958](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/op.ts#L958)

Get values for inner transaction in the last group submitted

## Type declaration

### accounts()

Accounts listed in the ApplicationCall transaction
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

##### a

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`Account`](../../../type-aliases/Account.md)

### amount()

microalgos
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

### applicationArgs()

Arguments passed to the application in the ApplicationCall transaction
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

##### a

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

### applicationId()

ApplicationID from ApplicationCall transaction
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`Application`](../../../type-aliases/Application.md)

### applications()

Foreign Apps listed in the ApplicationCall transaction
Min AVM version: 3

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

##### a

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`Application`](../../../type-aliases/Application.md)

### approvalProgram()

Approval program
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

### approvalProgramPages()

Approval Program as an array of pages
Min AVM version: 7

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

##### a

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

### assetAmount()

value in Asset's units
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

### assetCloseTo()

32 byte address
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`Account`](../../../type-aliases/Account.md)

### assetReceiver()

32 byte address
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`Account`](../../../type-aliases/Account.md)

### assets()

Foreign Assets listed in the ApplicationCall transaction
Min AVM version: 3

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

##### a

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`Asset`](../../../type-aliases/Asset.md)

### assetSender()

32 byte address. Source of assets if Sender is the Asset's Clawback address.
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`Account`](../../../type-aliases/Account.md)

### clearStateProgram()

Clear state program
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

### clearStateProgramPages()

ClearState Program as an array of pages
Min AVM version: 7

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

##### a

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

### closeRemainderTo()

32 byte address
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`Account`](../../../type-aliases/Account.md)

### configAsset()

Asset ID in asset config transaction
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`Asset`](../../../type-aliases/Asset.md)

### configAssetClawback()

32 byte address
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`Account`](../../../type-aliases/Account.md)

### configAssetDecimals()

Number of digits to display after the decimal place when displaying the asset
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

### configAssetDefaultFrozen()

Whether the asset's slots are frozen by default or not, 0 or 1
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

`boolean`

### configAssetFreeze()

32 byte address
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`Account`](../../../type-aliases/Account.md)

### configAssetManager()

32 byte address
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`Account`](../../../type-aliases/Account.md)

### configAssetMetadataHash()

32 byte commitment to unspecified asset metadata
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

### configAssetName()

The asset name
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

### configAssetReserve()

32 byte address
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`Account`](../../../type-aliases/Account.md)

### configAssetTotal()

Total number of units of this asset created
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

### configAssetUnitName()

Unit name of the asset
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

### configAssetUrl()

URL
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

### createdApplicationId()

ApplicationID allocated by the creation of an application (only with `itxn` in v5). Application mode only
Min AVM version: 5

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`Application`](../../../type-aliases/Application.md)

### createdAssetId()

Asset ID allocated by the creation of an ASA (only with `itxn` in v5). Application mode only
Min AVM version: 5

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`Asset`](../../../type-aliases/Asset.md)

### extraProgramPages()

Number of additional pages for each of the application's approval and clear state programs. An ExtraProgramPages of 1 means 2048 more total bytes, or 1024 for each program.
Min AVM version: 4

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

### fee()

microalgos
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

### firstValid()

round number
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

### firstValidTime()

UNIX timestamp of block before txn.FirstValid. Fails if negative
Min AVM version: 7

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

### freezeAsset()

Asset ID being frozen or un-frozen
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`Asset`](../../../type-aliases/Asset.md)

### freezeAssetAccount()

32 byte address of the account whose asset slot is being frozen or un-frozen
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`Account`](../../../type-aliases/Account.md)

### freezeAssetFrozen()

The new frozen value, 0 or 1
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

`boolean`

### globalNumByteSlice()

Number of global state byteslices in ApplicationCall
Min AVM version: 3

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

### globalNumUint()

Number of global state integers in ApplicationCall
Min AVM version: 3

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

### groupIndex()

Position of this transaction within an atomic transaction group. A stand-alone transaction is implicitly element 0 in a group of 1
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

### lastLog()

The last message emitted. Empty bytes if none were emitted. Application mode only
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

### lastValid()

round number
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

### lease()

32 byte lease value
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

### localNumByteSlice()

Number of local state byteslices in ApplicationCall
Min AVM version: 3

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

### localNumUint()

Number of local state integers in ApplicationCall
Min AVM version: 3

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

### logs()

Log messages emitted by an application call (only with `itxn` in v5). Application mode only
Min AVM version: 5

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

##### a

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

### nonparticipation()

Marks an account nonparticipating for rewards
Min AVM version: 5

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

`boolean`

### note()

Any data up to 1024 bytes
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

### numAccounts()

Number of Accounts
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

### numAppArgs()

Number of ApplicationArgs
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

### numApplications()

Number of Applications
Min AVM version: 3

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

### numApprovalProgramPages()

Number of Approval Program pages
Min AVM version: 7

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

### numAssets()

Number of Assets
Min AVM version: 3

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

### numClearStateProgramPages()

Number of ClearState Program pages
Min AVM version: 7

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

### numLogs()

Number of Logs (only with `itxn` in v5). Application mode only
Min AVM version: 5

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

### onCompletion()

ApplicationCall transaction on completion action
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

### receiver()

32 byte address
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`Account`](../../../type-aliases/Account.md)

### rekeyTo()

32 byte Sender's new AuthAddr
Min AVM version: 2

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`Account`](../../../type-aliases/Account.md)

### selectionPk()

32 byte address
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

### sender()

32 byte address
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`Account`](../../../type-aliases/Account.md)

### stateProofPk()

64 byte state proof public key
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

### txId()

The computed ID for this transaction. 32 bytes.
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

### type()

Transaction type as bytes
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

### typeEnum()

Transaction type as integer
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

### voteFirst()

The first round that the participation key is valid.
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

### voteKeyDilution()

Dilution for the 2-level participation key
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

### voteLast()

The last round that the participation key is valid.
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

### votePk()

32 byte address
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

### xferAsset()

Asset ID
Min AVM version: 6

#### Parameters

##### t

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`Asset`](../../../type-aliases/Asset.md)
