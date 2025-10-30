[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [itxn](../README.md) / ApplicationCallInnerTxn

# Interface: ApplicationCallInnerTxn

Defined in: [packages/algo-ts/src/itxn.ts:416](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L416)

An inner transaction of type 'appl'

## Properties

### appId

> `readonly` **appId**: [`Application`](../../index/type-aliases/Application.md)

Defined in: [packages/algo-ts/src/itxn.ts:471](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L471)

ApplicationID from ApplicationCall transaction

***

### approvalProgram

> `readonly` **approvalProgram**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:487](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L487)

The first page of the Approval program

***

### clearStateProgram

> `readonly` **clearStateProgram**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:491](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L491)

The first page of the Clear State program

***

### createdApp

> `readonly` **createdApp**: [`Application`](../../index/type-aliases/Application.md)

Defined in: [packages/algo-ts/src/itxn.ts:570](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L570)

The id of the created application

***

### extraProgramPages

> `readonly` **extraProgramPages**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:519](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L519)

Number of additional pages for each of the application's approval and clear state program

***

### fee

> `readonly` **fee**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:426](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L426)

microalgos

***

### firstValid

> `readonly` **firstValid**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:430](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L430)

round number

***

### firstValidTime

> `readonly` **firstValidTime**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:434](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L434)

UNIX timestamp of block before txn.FirstValid. Fails if negative

***

### globalNumBytes

> `readonly` **globalNumBytes**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:507](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L507)

Number of global state byteslices this application makes use of.

***

### globalNumUint

> `readonly` **globalNumUint**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:503](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L503)

Number of global state integers this application makes use of.

***

### groupIndex

> `readonly` **groupIndex**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:459](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L459)

Position of this transaction within an atomic group
A stand-alone transaction is implicitly element 0 in a group of 1

***

### lastLog

> `readonly` **lastLog**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:523](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L523)

The last message emitted. Empty bytes if none were emitted. App mode only

***

### lastValid

> `readonly` **lastValid**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:438](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L438)

round number

***

### lease

> `readonly` **lease**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:446](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L446)

32 byte lease value

***

### localNumBytes

> `readonly` **localNumBytes**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:515](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L515)

Number of local state byteslices this application makes use of.

***

### localNumUint

> `readonly` **localNumUint**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:511](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L511)

Number of local state integers this application makes use of.

***

### note

> `readonly` **note**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:442](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L442)

Any data up to 1024 bytes

***

### numAccounts

> `readonly` **numAccounts**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:483](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L483)

Number of ApplicationArgs

***

### numAppArgs

> `readonly` **numAppArgs**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:479](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L479)

Number of ApplicationArgs

***

### numApprovalProgramPages

> `readonly` **numApprovalProgramPages**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:532](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L532)

Number of Approval Program pages

***

### numApps

> `readonly` **numApps**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:499](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L499)

Number of Applications

***

### numAssets

> `readonly` **numAssets**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:495](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L495)

Number of Assets

***

### numClearStateProgramPages

> `readonly` **numClearStateProgramPages**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:541](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L541)

Number of Clear State Program pages

***

### numLogs

> `readonly` **numLogs**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:574](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L574)

Number of logs

***

### onCompletion

> `readonly` **onCompletion**: [`OnCompleteAction`](../../index/enumerations/OnCompleteAction.md)

Defined in: [packages/algo-ts/src/itxn.ts:475](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L475)

ApplicationCall transaction on completion action

***

### rekeyTo

> `readonly` **rekeyTo**: [`Account`](../../index/type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:467](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L467)

32 byte Sender's new AuthAddr

***

### sender

> `readonly` **sender**: [`Account`](../../index/type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:422](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L422)

32 byte address

***

### txnId

> `readonly` **txnId**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:463](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L463)

The computed ID for this transaction. 32 bytes.

***

### type

> `readonly` **type**: [`ApplicationCall`](../../index/enumerations/TransactionType.md#applicationcall)

Defined in: [packages/algo-ts/src/itxn.ts:454](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L454)

Transaction type

***

### typeBytes

> `readonly` **typeBytes**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:450](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L450)

Transaction type as bytes

## Methods

### accounts()

> **accounts**(`index`): [`Account`](../../index/type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:556](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L556)

Accounts listed in the ApplicationCall transaction

#### Parameters

##### index

[`uint64`](../../index/type-aliases/uint64.md)

Index of the account to get

#### Returns

[`Account`](../../index/type-aliases/Account.md)

***

### appArgs()

> **appArgs**(`index`): [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:551](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L551)

Arguments passed to the application in the ApplicationCall transaction

#### Parameters

##### index

[`uint64`](../../index/type-aliases/uint64.md)

Index of the arg to get

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

***

### approvalProgramPages()

> **approvalProgramPages**(`index`): [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:537](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L537)

All approval program pages

#### Parameters

##### index

[`uint64`](../../index/type-aliases/uint64.md)

Index of the page to get

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

***

### apps()

> **apps**(`index`): [`Application`](../../index/type-aliases/Application.md)

Defined in: [packages/algo-ts/src/itxn.ts:566](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L566)

Foreign Apps listed in the ApplicationCall transaction

#### Parameters

##### index

[`uint64`](../../index/type-aliases/uint64.md)

Index of the application to get

#### Returns

[`Application`](../../index/type-aliases/Application.md)

***

### assets()

> **assets**(`index`): [`Asset`](../../index/type-aliases/Asset.md)

Defined in: [packages/algo-ts/src/itxn.ts:561](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L561)

Foreign Assets listed in the ApplicationCall transaction

#### Parameters

##### index

[`uint64`](../../index/type-aliases/uint64.md)

Index of the asset to get

#### Returns

[`Asset`](../../index/type-aliases/Asset.md)

***

### clearStateProgramPages()

> **clearStateProgramPages**(`index`): [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:546](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L546)

All clear state program pages

#### Parameters

##### index

[`uint64`](../../index/type-aliases/uint64.md)

Index of the page to get

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

***

### logs()

> **logs**(`index`): [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:528](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L528)

Read application logs

#### Parameters

##### index

[`uint64`](../../index/type-aliases/uint64.md)

Index of the log to get

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)
