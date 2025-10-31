---
title: ApplicationCallComposeFields
type: interface
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / ApplicationCallComposeFields

# Interface: ApplicationCallComposeFields

Defined in: [itxn-compose.ts:22](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn-compose.ts#L22)

## Extends

- [`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md)

## Properties

### accounts?

> `optional` **accounts**: readonly ([`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md))[]

Defined in: [itxn.ts:951](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L951)

Accounts listed in the ApplicationCall transaction

#### Param

Index of the account to get

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`accounts`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#accounts)

***

### appArgs?

> `optional` **appArgs**: readonly `unknown`[]

Defined in: [itxn.ts:946](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L946)

Arguments passed to the application in the ApplicationCall transaction

#### Param

Index of the arg to get

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`appArgs`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#appargs)

***

### appId?

> `optional` **appId**: [`uint64`](../type-aliases/uint64.md) \| [`Application`](../type-aliases/Application.md)

Defined in: [itxn.ts:907](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L907)

ApplicationID from ApplicationCall transaction

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`appId`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#appid)

***

### approvalProgram?

> `optional` **approvalProgram**: [`bytes`](../type-aliases/bytes.md) \| readonly [`bytes`](../type-aliases/bytes.md)[]

Defined in: [itxn.ts:936](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L936)

All approval program pages

#### Param

Index of the page to get

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`approvalProgram`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#approvalprogram)

***

### apps?

> `optional` **apps**: readonly ([`uint64`](../type-aliases/uint64.md) \| [`Application`](../type-aliases/Application.md))[]

Defined in: [itxn.ts:961](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L961)

Foreign Apps listed in the ApplicationCall transaction

#### Param

Index of the application to get

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`apps`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#apps)

***

### assets?

> `optional` **assets**: readonly ([`uint64`](../type-aliases/uint64.md) \| [`Asset`](../type-aliases/Asset.md))[]

Defined in: [itxn.ts:956](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L956)

Foreign Assets listed in the ApplicationCall transaction

#### Param

Index of the asset to get

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`assets`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#assets)

***

### clearStateProgram?

> `optional` **clearStateProgram**: [`bytes`](../type-aliases/bytes.md) \| readonly [`bytes`](../type-aliases/bytes.md)[]

Defined in: [itxn.ts:941](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L941)

All clear state program pages

#### Param

Index of the page to get

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`clearStateProgram`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#clearstateprogram)

***

### extraProgramPages?

> `optional` **extraProgramPages**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:931](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L931)

Number of additional pages for each of the application's approval and clear state program

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`extraProgramPages`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#extraprogrampages)

***

### fee?

> `optional` **fee**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:879](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L879)

microalgos

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`fee`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#fee)

***

### firstValid?

> `optional` **firstValid**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:883](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L883)

round number

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`firstValid`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#firstvalid)

***

### firstValidTime?

> `optional` **firstValidTime**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:887](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L887)

UNIX timestamp of block before txn.FirstValid. Fails if negative

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`firstValidTime`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#firstvalidtime)

***

### globalNumBytes?

> `optional` **globalNumBytes**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:919](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L919)

Number of global state byteslices this application makes use of.

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`globalNumBytes`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#globalnumbytes)

***

### globalNumUint?

> `optional` **globalNumUint**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:915](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L915)

Number of global state integers this application makes use of.

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`globalNumUint`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#globalnumuint)

***

### lastValid?

> `optional` **lastValid**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:891](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L891)

round number

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`lastValid`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#lastvalid)

***

### lease?

> `optional` **lease**: [`bytes`](../type-aliases/bytes.md)\<`32`\>

Defined in: [itxn.ts:899](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L899)

32 byte lease value

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`lease`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#lease)

***

### localNumBytes?

> `optional` **localNumBytes**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:927](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L927)

Number of local state byteslices this application makes use of.

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`localNumBytes`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#localnumbytes)

***

### localNumUint?

> `optional` **localNumUint**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:923](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L923)

Number of local state integers this application makes use of.

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`localNumUint`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#localnumuint)

***

### note?

> `optional` **note**: `string` \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:895](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L895)

Any data up to 1024 bytes

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`note`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#note)

***

### onCompletion?

> `optional` **onCompletion**: [`OnCompleteAction`](../enumerations/OnCompleteAction.md)

Defined in: [itxn.ts:911](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L911)

ApplicationCall transaction on completion action

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`onCompletion`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#oncompletion)

***

### rejectVersion?

> `optional` **rejectVersion**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:965](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L965)

Application version for which the txn must reject

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`rejectVersion`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#rejectversion)

***

### rekeyTo?

> `optional` **rekeyTo**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:903](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L903)

32 byte Sender's new AuthAddr

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`rekeyTo`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#rekeyto)

***

### sender?

> `optional` **sender**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:875](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L875)

32 byte address

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`sender`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#sender)

***

### type

> **type**: [`ApplicationCall`](../enumerations/TransactionType.md#applicationcall)

Defined in: [itxn-compose.ts:23](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn-compose.ts#L23)
