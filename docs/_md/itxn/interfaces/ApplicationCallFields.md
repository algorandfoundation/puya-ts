[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [itxn](../README.md) / ApplicationCallFields

# Interface: ApplicationCallFields

Defined in: [packages/algo-ts/src/itxn.ts:866](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L866)

## Properties

### accounts?

> `optional` **accounts**: readonly ([`bytes`](../../index/type-aliases/bytes.md) \| [`Account`](../../index/type-aliases/Account.md))[]

Defined in: [packages/algo-ts/src/itxn.ts:946](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L946)

Accounts listed in the ApplicationCall transaction

#### Param

Index of the account to get

***

### appArgs?

> `optional` **appArgs**: readonly `unknown`[]

Defined in: [packages/algo-ts/src/itxn.ts:941](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L941)

Arguments passed to the application in the ApplicationCall transaction

#### Param

Index of the arg to get

***

### appId?

> `optional` **appId**: [`uint64`](../../index/type-aliases/uint64.md) \| [`Application`](../../index/type-aliases/Application.md)

Defined in: [packages/algo-ts/src/itxn.ts:902](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L902)

ApplicationID from ApplicationCall transaction

***

### approvalProgram?

> `optional` **approvalProgram**: [`bytes`](../../index/type-aliases/bytes.md) \| readonly [`bytes`](../../index/type-aliases/bytes.md)[]

Defined in: [packages/algo-ts/src/itxn.ts:931](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L931)

All approval program pages

#### Param

Index of the page to get

***

### apps?

> `optional` **apps**: readonly ([`uint64`](../../index/type-aliases/uint64.md) \| [`Application`](../../index/type-aliases/Application.md))[]

Defined in: [packages/algo-ts/src/itxn.ts:956](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L956)

Foreign Apps listed in the ApplicationCall transaction

#### Param

Index of the application to get

***

### assets?

> `optional` **assets**: readonly ([`uint64`](../../index/type-aliases/uint64.md) \| [`Asset`](../../index/type-aliases/Asset.md))[]

Defined in: [packages/algo-ts/src/itxn.ts:951](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L951)

Foreign Assets listed in the ApplicationCall transaction

#### Param

Index of the asset to get

***

### clearStateProgram?

> `optional` **clearStateProgram**: [`bytes`](../../index/type-aliases/bytes.md) \| readonly [`bytes`](../../index/type-aliases/bytes.md)[]

Defined in: [packages/algo-ts/src/itxn.ts:936](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L936)

All clear state program pages

#### Param

Index of the page to get

***

### extraProgramPages?

> `optional` **extraProgramPages**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:926](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L926)

Number of additional pages for each of the application's approval and clear state program

***

### fee?

> `optional` **fee**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:874](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L874)

microalgos

***

### firstValid?

> `optional` **firstValid**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:878](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L878)

round number

***

### firstValidTime?

> `optional` **firstValidTime**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:882](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L882)

UNIX timestamp of block before txn.FirstValid. Fails if negative

***

### globalNumBytes?

> `optional` **globalNumBytes**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:914](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L914)

Number of global state byteslices this application makes use of.

***

### globalNumUint?

> `optional` **globalNumUint**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:910](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L910)

Number of global state integers this application makes use of.

***

### lastValid?

> `optional` **lastValid**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:886](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L886)

round number

***

### lease?

> `optional` **lease**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:894](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L894)

32 byte lease value

***

### localNumBytes?

> `optional` **localNumBytes**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:922](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L922)

Number of local state byteslices this application makes use of.

***

### localNumUint?

> `optional` **localNumUint**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:918](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L918)

Number of local state integers this application makes use of.

***

### note?

> `optional` **note**: `string` \| [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:890](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L890)

Any data up to 1024 bytes

***

### onCompletion?

> `optional` **onCompletion**: [`OnCompleteAction`](../../index/enumerations/OnCompleteAction.md)

Defined in: [packages/algo-ts/src/itxn.ts:906](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L906)

ApplicationCall transaction on completion action

***

### rekeyTo?

> `optional` **rekeyTo**: [`bytes`](../../index/type-aliases/bytes.md) \| [`Account`](../../index/type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:898](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L898)

32 byte Sender's new AuthAddr

***

### sender?

> `optional` **sender**: [`bytes`](../../index/type-aliases/bytes.md) \| [`Account`](../../index/type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:870](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L870)

32 byte address
