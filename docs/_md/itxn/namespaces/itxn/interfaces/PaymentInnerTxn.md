---
title: PaymentInnerTxn
type: interface
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../../../README.md)

***

[Algorand TypeScript](../../../../modules.md) / [itxn](../../../README.md) / [itxn](../README.md) / PaymentInnerTxn

# Interface: PaymentInnerTxn

Defined in: [itxn.ts:13](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L13)

An inner transaction of type 'pay'

## Properties

### amount

> `readonly` **amount**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:72](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L72)

microalgos

***

### closeRemainderTo

> `readonly` **closeRemainderTo**: [`Account`](../../../../index/type-aliases/Account.md)

Defined in: [itxn.ts:76](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L76)

32 byte address

***

### fee

> `readonly` **fee**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:23](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L23)

microalgos

***

### firstValid

> `readonly` **firstValid**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:27](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L27)

round number

***

### firstValidTime

> `readonly` **firstValidTime**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:31](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L31)

UNIX timestamp of block before txn.FirstValid. Fails if negative

***

### groupIndex

> `readonly` **groupIndex**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:56](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L56)

Position of this transaction within an atomic group
A stand-alone transaction is implicitly element 0 in a group of 1

***

### lastValid

> `readonly` **lastValid**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:35](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L35)

round number

***

### lease

> `readonly` **lease**: [`bytes`](../../../../index/type-aliases/bytes.md)\<`32`\>

Defined in: [itxn.ts:43](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L43)

32 byte lease value

***

### note

> `readonly` **note**: [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:39](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L39)

Any data up to 1024 bytes

***

### receiver

> `readonly` **receiver**: [`Account`](../../../../index/type-aliases/Account.md)

Defined in: [itxn.ts:68](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L68)

32 byte address

***

### rekeyTo

> `readonly` **rekeyTo**: [`Account`](../../../../index/type-aliases/Account.md)

Defined in: [itxn.ts:64](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L64)

32 byte Sender's new AuthAddr

***

### sender

> `readonly` **sender**: [`Account`](../../../../index/type-aliases/Account.md)

Defined in: [itxn.ts:19](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L19)

32 byte address

***

### txnId

> `readonly` **txnId**: [`bytes`](../../../../index/type-aliases/bytes.md)\<`32`\>

Defined in: [itxn.ts:60](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L60)

The computed ID for this transaction. 32 bytes.

***

### type

> `readonly` **type**: [`Payment`](../../../../index/enumerations/TransactionType.md#payment)

Defined in: [itxn.ts:51](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L51)

Transaction type

***

### typeBytes

> `readonly` **typeBytes**: [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:47](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L47)

Transaction type as bytes
