---
title: PaymentTxn
type: interface
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../../../README.md)

***

[Algorand TypeScript](../../../../modules.md) / [gtxn](../../../README.md) / [gtxn](../README.md) / PaymentTxn

# Interface: PaymentTxn

Defined in: [gtxn.ts:597](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L597)

A group transaction of type 'pay'

## Properties

### amount

> `readonly` **amount**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [gtxn.ts:72](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L72)

microalgos

***

### closeRemainderTo

> `readonly` **closeRemainderTo**: [`Account`](../../../../index/type-aliases/Account.md)

Defined in: [gtxn.ts:76](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L76)

32 byte address

***

### fee

> `readonly` **fee**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [gtxn.ts:23](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L23)

microalgos

***

### firstValid

> `readonly` **firstValid**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [gtxn.ts:27](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L27)

round number

***

### firstValidTime

> `readonly` **firstValidTime**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [gtxn.ts:31](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L31)

UNIX timestamp of block before txn.FirstValid. Fails if negative

***

### groupIndex

> `readonly` **groupIndex**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [gtxn.ts:56](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L56)

Position of this transaction within an atomic group
A stand-alone transaction is implicitly element 0 in a group of 1

***

### lastValid

> `readonly` **lastValid**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [gtxn.ts:35](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L35)

round number

***

### lease

> `readonly` **lease**: [`bytes`](../../../../index/type-aliases/bytes.md)\<`32`\>

Defined in: [gtxn.ts:43](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L43)

32 byte lease value

***

### note

> `readonly` **note**: [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [gtxn.ts:39](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L39)

Any data up to 1024 bytes

***

### receiver

> `readonly` **receiver**: [`Account`](../../../../index/type-aliases/Account.md)

Defined in: [gtxn.ts:68](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L68)

32 byte address

***

### rekeyTo

> `readonly` **rekeyTo**: [`Account`](../../../../index/type-aliases/Account.md)

Defined in: [gtxn.ts:64](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L64)

32 byte Sender's new AuthAddr

***

### sender

> `readonly` **sender**: [`Account`](../../../../index/type-aliases/Account.md)

Defined in: [gtxn.ts:19](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L19)

32 byte address

***

### txnId

> `readonly` **txnId**: [`bytes`](../../../../index/type-aliases/bytes.md)\<`32`\>

Defined in: [gtxn.ts:60](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L60)

The computed ID for this transaction. 32 bytes.

***

### type

> `readonly` **type**: [`Payment`](../../../../index/enumerations/TransactionType.md#payment)

Defined in: [gtxn.ts:51](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L51)

Transaction type

***

### typeBytes

> `readonly` **typeBytes**: [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [gtxn.ts:47](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L47)

Transaction type as bytes
