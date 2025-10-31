---
title: AssetConfigInnerTxn
type: interface
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../../../README.md)

***

[Algorand TypeScript](../../../../modules.md) / [itxn](../../../README.md) / [itxn](../README.md) / AssetConfigInnerTxn

# Interface: AssetConfigInnerTxn

Defined in: [itxn.ts:165](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L165)

An inner transaction of type 'acfg'

## Properties

### assetName

> `readonly` **assetName**: [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:244](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L244)

The asset name

***

### clawback

> `readonly` **clawback**: [`Account`](../../../../index/type-aliases/Account.md)

Defined in: [itxn.ts:268](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L268)

32 byte address

***

### configAsset

> `readonly` **configAsset**: [`Asset`](../../../../index/type-aliases/Asset.md)

Defined in: [itxn.ts:220](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L220)

Asset ID in asset config transaction

***

### createdAsset

> `readonly` **createdAsset**: [`Asset`](../../../../index/type-aliases/Asset.md)

Defined in: [itxn.ts:224](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L224)

The asset created by this transaction

***

### decimals

> `readonly` **decimals**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:232](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L232)

Number of digits to display after the decimal place when displaying the asset

***

### defaultFrozen

> `readonly` **defaultFrozen**: `boolean`

Defined in: [itxn.ts:236](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L236)

Whether the asset's slots are frozen by default or not, 0 or 1

***

### fee

> `readonly` **fee**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:175](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L175)

microalgos

***

### firstValid

> `readonly` **firstValid**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:179](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L179)

round number

***

### firstValidTime

> `readonly` **firstValidTime**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:183](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L183)

UNIX timestamp of block before txn.FirstValid. Fails if negative

***

### freeze

> `readonly` **freeze**: [`Account`](../../../../index/type-aliases/Account.md)

Defined in: [itxn.ts:264](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L264)

32 byte address

***

### groupIndex

> `readonly` **groupIndex**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:208](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L208)

Position of this transaction within an atomic group
A stand-alone transaction is implicitly element 0 in a group of 1

***

### lastValid

> `readonly` **lastValid**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:187](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L187)

round number

***

### lease

> `readonly` **lease**: [`bytes`](../../../../index/type-aliases/bytes.md)\<`32`\>

Defined in: [itxn.ts:195](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L195)

32 byte lease value

***

### manager

> `readonly` **manager**: [`Account`](../../../../index/type-aliases/Account.md)

Defined in: [itxn.ts:256](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L256)

32 byte address

***

### metadataHash

> `readonly` **metadataHash**: [`bytes`](../../../../index/type-aliases/bytes.md)\<`32`\>

Defined in: [itxn.ts:252](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L252)

32 byte commitment to unspecified asset metadata

***

### note

> `readonly` **note**: [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:191](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L191)

Any data up to 1024 bytes

***

### rekeyTo

> `readonly` **rekeyTo**: [`Account`](../../../../index/type-aliases/Account.md)

Defined in: [itxn.ts:216](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L216)

32 byte Sender's new AuthAddr

***

### reserve

> `readonly` **reserve**: [`Account`](../../../../index/type-aliases/Account.md)

Defined in: [itxn.ts:260](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L260)

32 byte address

***

### sender

> `readonly` **sender**: [`Account`](../../../../index/type-aliases/Account.md)

Defined in: [itxn.ts:171](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L171)

32 byte address

***

### total

> `readonly` **total**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:228](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L228)

Total number of units of this asset created

***

### txnId

> `readonly` **txnId**: [`bytes`](../../../../index/type-aliases/bytes.md)\<`32`\>

Defined in: [itxn.ts:212](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L212)

The computed ID for this transaction. 32 bytes.

***

### type

> `readonly` **type**: [`AssetConfig`](../../../../index/enumerations/TransactionType.md#assetconfig)

Defined in: [itxn.ts:203](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L203)

Transaction type

***

### typeBytes

> `readonly` **typeBytes**: [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:199](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L199)

Transaction type as bytes

***

### unitName

> `readonly` **unitName**: [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:240](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L240)

Unit name of the asset

***

### url

> `readonly` **url**: [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:248](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L248)

URL
