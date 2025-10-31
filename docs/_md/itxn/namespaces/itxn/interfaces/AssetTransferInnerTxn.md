---
title: AssetTransferInnerTxn
type: interface
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../../../README.md)

***

[Algorand TypeScript](../../../../modules.md) / [itxn](../../../README.md) / [itxn](../README.md) / AssetTransferInnerTxn

# Interface: AssetTransferInnerTxn

Defined in: [itxn.ts:273](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L273)

An inner transaction of type 'axfer'

## Properties

### assetAmount

> `readonly` **assetAmount**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:332](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L332)

value in Asset's units

***

### assetCloseTo

> `readonly` **assetCloseTo**: [`Account`](../../../../index/type-aliases/Account.md)

Defined in: [itxn.ts:344](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L344)

32 byte address

***

### assetReceiver

> `readonly` **assetReceiver**: [`Account`](../../../../index/type-aliases/Account.md)

Defined in: [itxn.ts:340](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L340)

32 byte address

***

### assetSender

> `readonly` **assetSender**: [`Account`](../../../../index/type-aliases/Account.md)

Defined in: [itxn.ts:336](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L336)

32 byte address. Source of assets if Sender is the Asset's Clawback address.

***

### fee

> `readonly` **fee**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:283](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L283)

microalgos

***

### firstValid

> `readonly` **firstValid**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:287](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L287)

round number

***

### firstValidTime

> `readonly` **firstValidTime**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:291](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L291)

UNIX timestamp of block before txn.FirstValid. Fails if negative

***

### groupIndex

> `readonly` **groupIndex**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:316](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L316)

Position of this transaction within an atomic group
A stand-alone transaction is implicitly element 0 in a group of 1

***

### lastValid

> `readonly` **lastValid**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:295](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L295)

round number

***

### lease

> `readonly` **lease**: [`bytes`](../../../../index/type-aliases/bytes.md)\<`32`\>

Defined in: [itxn.ts:303](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L303)

32 byte lease value

***

### note

> `readonly` **note**: [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:299](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L299)

Any data up to 1024 bytes

***

### rekeyTo

> `readonly` **rekeyTo**: [`Account`](../../../../index/type-aliases/Account.md)

Defined in: [itxn.ts:324](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L324)

32 byte Sender's new AuthAddr

***

### sender

> `readonly` **sender**: [`Account`](../../../../index/type-aliases/Account.md)

Defined in: [itxn.ts:279](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L279)

32 byte address

***

### txnId

> `readonly` **txnId**: [`bytes`](../../../../index/type-aliases/bytes.md)\<`32`\>

Defined in: [itxn.ts:320](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L320)

The computed ID for this transaction. 32 bytes.

***

### type

> `readonly` **type**: [`AssetTransfer`](../../../../index/enumerations/TransactionType.md#assettransfer)

Defined in: [itxn.ts:311](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L311)

Transaction type

***

### typeBytes

> `readonly` **typeBytes**: [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:307](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L307)

Transaction type as bytes

***

### xferAsset

> `readonly` **xferAsset**: [`Asset`](../../../../index/type-aliases/Asset.md)

Defined in: [itxn.ts:328](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L328)

Asset ID
