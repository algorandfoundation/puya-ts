---
title: AbiCallOptions
type: interface
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / AbiCallOptions

# Interface: AbiCallOptions\<TMethod\>

Defined in: [arc4/c2c.ts:112](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/c2c.ts#L112)

## Extends

- `Omit`\<[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md), `"appArgs"`\>

## Type Parameters

### TMethod

`TMethod`

## Properties

### accounts?

> `optional` **accounts**: readonly ([`Account`](../../index/type-aliases/Account.md) \| [`bytes`](../../index/type-aliases/bytes.md))[]

Defined in: [itxn.ts:951](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L951)

Accounts listed in the ApplicationCall transaction

#### Param

Index of the account to get

#### Inherited from

`Omit.accounts`

***

### appId?

> `optional` **appId**: [`uint64`](../../index/type-aliases/uint64.md) \| [`Application`](../../index/type-aliases/Application.md)

Defined in: [itxn.ts:907](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L907)

ApplicationID from ApplicationCall transaction

#### Inherited from

`Omit.appId`

***

### approvalProgram?

> `optional` **approvalProgram**: [`bytes`](../../index/type-aliases/bytes.md) \| readonly [`bytes`](../../index/type-aliases/bytes.md)[]

Defined in: [itxn.ts:936](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L936)

All approval program pages

#### Param

Index of the page to get

#### Inherited from

`Omit.approvalProgram`

***

### apps?

> `optional` **apps**: readonly ([`uint64`](../../index/type-aliases/uint64.md) \| [`Application`](../../index/type-aliases/Application.md))[]

Defined in: [itxn.ts:961](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L961)

Foreign Apps listed in the ApplicationCall transaction

#### Param

Index of the application to get

#### Inherited from

`Omit.apps`

***

### args?

> `readonly` `optional` **args**: `TMethod` *extends* [`InstanceMethod`](../-internal-/type-aliases/InstanceMethod.md)\<[`Contract`](../classes/Contract.md), `TParams`\> ? [`TypedApplicationArgs`](../type-aliases/TypedApplicationArgs.md)\<`TParams`\> : `unknown`[]

Defined in: [arc4/c2c.ts:114](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/c2c.ts#L114)

***

### assets?

> `optional` **assets**: readonly ([`uint64`](../../index/type-aliases/uint64.md) \| [`Asset`](../../index/type-aliases/Asset.md))[]

Defined in: [itxn.ts:956](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L956)

Foreign Assets listed in the ApplicationCall transaction

#### Param

Index of the asset to get

#### Inherited from

`Omit.assets`

***

### clearStateProgram?

> `optional` **clearStateProgram**: [`bytes`](../../index/type-aliases/bytes.md) \| readonly [`bytes`](../../index/type-aliases/bytes.md)[]

Defined in: [itxn.ts:941](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L941)

All clear state program pages

#### Param

Index of the page to get

#### Inherited from

`Omit.clearStateProgram`

***

### extraProgramPages?

> `optional` **extraProgramPages**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:931](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L931)

Number of additional pages for each of the application's approval and clear state program

#### Inherited from

`Omit.extraProgramPages`

***

### fee?

> `optional` **fee**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:879](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L879)

microalgos

#### Inherited from

`Omit.fee`

***

### firstValid?

> `optional` **firstValid**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:883](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L883)

round number

#### Inherited from

`Omit.firstValid`

***

### firstValidTime?

> `optional` **firstValidTime**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:887](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L887)

UNIX timestamp of block before txn.FirstValid. Fails if negative

#### Inherited from

`Omit.firstValidTime`

***

### globalNumBytes?

> `optional` **globalNumBytes**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:919](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L919)

Number of global state byteslices this application makes use of.

#### Inherited from

`Omit.globalNumBytes`

***

### globalNumUint?

> `optional` **globalNumUint**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:915](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L915)

Number of global state integers this application makes use of.

#### Inherited from

`Omit.globalNumUint`

***

### lastValid?

> `optional` **lastValid**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:891](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L891)

round number

#### Inherited from

`Omit.lastValid`

***

### lease?

> `optional` **lease**: [`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

Defined in: [itxn.ts:899](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L899)

32 byte lease value

#### Inherited from

`Omit.lease`

***

### localNumBytes?

> `optional` **localNumBytes**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:927](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L927)

Number of local state byteslices this application makes use of.

#### Inherited from

`Omit.localNumBytes`

***

### localNumUint?

> `optional` **localNumUint**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:923](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L923)

Number of local state integers this application makes use of.

#### Inherited from

`Omit.localNumUint`

***

### method?

> `readonly` `optional` **method**: `TMethod`

Defined in: [arc4/c2c.ts:113](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/c2c.ts#L113)

***

### note?

> `optional` **note**: `string` \| [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:895](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L895)

Any data up to 1024 bytes

#### Inherited from

`Omit.note`

***

### onCompletion?

> `optional` **onCompletion**: [`OnCompleteAction`](../../index/enumerations/OnCompleteAction.md)

Defined in: [itxn.ts:911](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L911)

ApplicationCall transaction on completion action

#### Inherited from

`Omit.onCompletion`

***

### rejectVersion?

> `optional` **rejectVersion**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:965](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L965)

Application version for which the txn must reject

#### Inherited from

`Omit.rejectVersion`

***

### rekeyTo?

> `optional` **rekeyTo**: [`Account`](../../index/type-aliases/Account.md) \| [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:903](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L903)

32 byte Sender's new AuthAddr

#### Inherited from

`Omit.rekeyTo`

***

### sender?

> `optional` **sender**: [`Account`](../../index/type-aliases/Account.md) \| [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:875](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L875)

32 byte address

#### Inherited from

`Omit.sender`
