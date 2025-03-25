[**@algorandfoundation/algorand-typescript**](../../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../../README.md) / [index](../../../README.md) / [gtxn](../README.md) / ApplicationCallTxn

# Interface: ApplicationCallTxn

Defined in: [packages/algo-ts/src/gtxn.ts:628](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L628)

A group transaction of type 'appl'

## Constructors

## Properties

### appId

> `readonly` **appId**: [`Application`](../../../type-aliases/Application.md)

Defined in: [packages/algo-ts/src/gtxn.ts:470](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L470)

ApplicationID from ApplicationCall transaction

***

### approvalProgram

> `readonly` **approvalProgram**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:490](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L490)

The first page of the Approval program

***

### clearStateProgram

> `readonly` **clearStateProgram**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:494](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L494)

The first page of the Clear State program

***

### createdApp

> `readonly` **createdApp**: [`Application`](../../../type-aliases/Application.md)

Defined in: [packages/algo-ts/src/gtxn.ts:573](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L573)

The id of the created application

***

### createdApplication

> `readonly` **createdApplication**: [`Application`](../../../type-aliases/Application.md)

Defined in: [packages/algo-ts/src/gtxn.ts:474](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L474)

The application created by this transaction

***

### extraProgramPages

> `readonly` **extraProgramPages**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:522](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L522)

Number of additional pages for each of the application's approval and clear state program

***

### fee

> `readonly` **fee**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:425](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L425)

microalgos

***

### firstValid

> `readonly` **firstValid**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:429](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L429)

round number

***

### firstValidTime

> `readonly` **firstValidTime**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:433](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L433)

UNIX timestamp of block before txn.FirstValid. Fails if negative

***

### globalNumBytes

> `readonly` **globalNumBytes**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:510](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L510)

Number of global state byteslices this application makes use of.

***

### globalNumUint

> `readonly` **globalNumUint**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:506](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L506)

Number of global state integers this application makes use of.

***

### groupIndex

> `readonly` **groupIndex**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:458](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L458)

Position of this transaction within an atomic group
A stand-alone transaction is implicitly element 0 in a group of 1

***

### lastLog

> `readonly` **lastLog**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:526](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L526)

The last message emitted. Empty bytes if none were emitted. App mode only

***

### lastValid

> `readonly` **lastValid**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:437](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L437)

round number

***

### lease

> `readonly` **lease**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:445](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L445)

32 byte lease value

***

### localNumBytes

> `readonly` **localNumBytes**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:518](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L518)

Number of local state byteslices this application makes use of.

***

### localNumUint

> `readonly` **localNumUint**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:514](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L514)

Number of local state integers this application makes use of.

***

### note

> `readonly` **note**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:441](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L441)

Any data up to 1024 bytes

***

### numAccounts

> `readonly` **numAccounts**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:486](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L486)

Number of ApplicationArgs

***

### numAppArgs

> `readonly` **numAppArgs**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:482](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L482)

Number of ApplicationArgs

***

### numApprovalProgramPages

> `readonly` **numApprovalProgramPages**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:535](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L535)

Number of Approval Program pages

***

### numApps

> `readonly` **numApps**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:502](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L502)

Number of Applications

***

### numAssets

> `readonly` **numAssets**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:498](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L498)

Number of Assets

***

### numClearStateProgramPages

> `readonly` **numClearStateProgramPages**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:544](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L544)

Number of Clear State Program pages

***

### numLogs

> `readonly` **numLogs**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:577](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L577)

Number of logs

***

### onCompletion

> `readonly` **onCompletion**: [`OnCompleteAction`](../../../enumerations/OnCompleteAction.md)

Defined in: [packages/algo-ts/src/gtxn.ts:478](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L478)

ApplicationCall transaction on completion action

***

### rekeyTo

> `readonly` **rekeyTo**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/gtxn.ts:466](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L466)

32 byte Sender's new AuthAddr

***

### sender

> `readonly` **sender**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/gtxn.ts:421](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L421)

32 byte address

***

### txnId

> `readonly` **txnId**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:462](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L462)

The computed ID for this transaction. 32 bytes.

***

### type

> `readonly` **type**: [`ApplicationCall`](../../../enumerations/TransactionType.md#applicationcall)

Defined in: [packages/algo-ts/src/gtxn.ts:453](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L453)

Transaction type

***

### typeBytes

> `readonly` **typeBytes**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:449](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L449)

Transaction type as bytes

## Methods

### accounts()

> **accounts**(`index`): [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/gtxn.ts:559](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L559)

Accounts listed in the ApplicationCall transaction

#### Parameters

##### index

[`uint64`](../../../type-aliases/uint64.md)

Index of the account to get

#### Returns

[`Account`](../../../type-aliases/Account.md)

***

### appArgs()

> **appArgs**(`index`): [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:554](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L554)

Arguments passed to the application in the ApplicationCall transaction

#### Parameters

##### index

[`uint64`](../../../type-aliases/uint64.md)

Index of the arg to get

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

***

### approvalProgramPages()

> **approvalProgramPages**(`index`): [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:540](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L540)

All approval program pages

#### Parameters

##### index

[`uint64`](../../../type-aliases/uint64.md)

Index of the page to get

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

***

### apps()

> **apps**(`index`): [`Application`](../../../type-aliases/Application.md)

Defined in: [packages/algo-ts/src/gtxn.ts:569](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L569)

Foreign Apps listed in the ApplicationCall transaction

#### Parameters

##### index

[`uint64`](../../../type-aliases/uint64.md)

Index of the application to get

#### Returns

[`Application`](../../../type-aliases/Application.md)

***

### assets()

> **assets**(`index`): [`Asset`](../../../type-aliases/Asset.md)

Defined in: [packages/algo-ts/src/gtxn.ts:564](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L564)

Foreign Assets listed in the ApplicationCall transaction

#### Parameters

##### index

[`uint64`](../../../type-aliases/uint64.md)

Index of the asset to get

#### Returns

[`Asset`](../../../type-aliases/Asset.md)

***

### clearStateProgramPages()

> **clearStateProgramPages**(`index`): [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:549](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L549)

All clear state program pages

#### Parameters

##### index

[`uint64`](../../../type-aliases/uint64.md)

Index of the page to get

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

***

### logs()

> **logs**(`index`): [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:531](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L531)

Read application logs

#### Parameters

##### index

[`uint64`](../../../type-aliases/uint64.md)

Index of the log to get

#### Returns

[`bytes`](../../../type-aliases/bytes.md)
