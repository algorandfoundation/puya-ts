---
title: PaymentComposeFields
type: interface
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / PaymentComposeFields

# Interface: PaymentComposeFields

Defined in: [itxn-compose.ts:7](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn-compose.ts#L7)

## Extends

- [`PaymentFields`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md)

## Properties

### amount?

> `optional` **amount**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:621](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L621)

microalgos

#### Inherited from

[`PaymentFields`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md).[`amount`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md#amount)

***

### closeRemainderTo?

> `optional` **closeRemainderTo**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:625](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L625)

32 byte address

#### Inherited from

[`PaymentFields`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md).[`closeRemainderTo`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md#closeremainderto)

***

### fee?

> `optional` **fee**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:589](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L589)

microalgos

#### Inherited from

[`PaymentFields`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md).[`fee`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md#fee)

***

### firstValid?

> `optional` **firstValid**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:593](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L593)

round number

#### Inherited from

[`PaymentFields`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md).[`firstValid`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md#firstvalid)

***

### firstValidTime?

> `optional` **firstValidTime**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:597](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L597)

UNIX timestamp of block before txn.FirstValid. Fails if negative

#### Inherited from

[`PaymentFields`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md).[`firstValidTime`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md#firstvalidtime)

***

### lastValid?

> `optional` **lastValid**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:601](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L601)

round number

#### Inherited from

[`PaymentFields`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md).[`lastValid`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md#lastvalid)

***

### lease?

> `optional` **lease**: [`bytes`](../type-aliases/bytes.md)\<`32`\>

Defined in: [itxn.ts:609](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L609)

32 byte lease value

#### Inherited from

[`PaymentFields`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md).[`lease`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md#lease)

***

### note?

> `optional` **note**: `string` \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:605](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L605)

Any data up to 1024 bytes

#### Inherited from

[`PaymentFields`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md).[`note`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md#note)

***

### receiver?

> `optional` **receiver**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:617](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L617)

32 byte address

#### Inherited from

[`PaymentFields`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md).[`receiver`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md#receiver)

***

### rekeyTo?

> `optional` **rekeyTo**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:613](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L613)

32 byte Sender's new AuthAddr

#### Inherited from

[`PaymentFields`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md).[`rekeyTo`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md#rekeyto)

***

### sender?

> `optional` **sender**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:585](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L585)

32 byte address

#### Inherited from

[`PaymentFields`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md).[`sender`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md#sender)

***

### type

> **type**: [`Payment`](../enumerations/TransactionType.md#payment)

Defined in: [itxn-compose.ts:8](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn-compose.ts#L8)
