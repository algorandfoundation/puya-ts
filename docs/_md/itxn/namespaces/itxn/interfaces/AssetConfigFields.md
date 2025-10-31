---
title: AssetConfigFields
type: interface
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../../../README.md)

***

[Algorand TypeScript](../../../../modules.md) / [itxn](../../../README.md) / [itxn](../README.md) / AssetConfigFields

# Interface: AssetConfigFields

Defined in: [itxn.ts:689](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L689)

## Extended by

- [`AssetConfigComposeFields`](../../../../index/interfaces/AssetConfigComposeFields.md)
- [`AnyTransactionComposeFields`](../../../../index/interfaces/AnyTransactionComposeFields.md)

## Properties

### assetName?

> `optional` **assetName**: `string` \| [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:745](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L745)

The asset name

***

### clawback?

> `optional` **clawback**: [`Account`](../../../../index/type-aliases/Account.md) \| [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:769](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L769)

32 byte address

***

### configAsset?

> `optional` **configAsset**: [`uint64`](../../../../index/type-aliases/uint64.md) \| [`Asset`](../../../../index/type-aliases/Asset.md)

Defined in: [itxn.ts:725](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L725)

Asset ID in asset config transaction

***

### decimals?

> `optional` **decimals**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:733](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L733)

Number of digits to display after the decimal place when displaying the asset

***

### defaultFrozen?

> `optional` **defaultFrozen**: `boolean`

Defined in: [itxn.ts:737](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L737)

Whether the asset's slots are frozen by default or not, 0 or 1

***

### fee?

> `optional` **fee**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:697](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L697)

microalgos

***

### firstValid?

> `optional` **firstValid**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:701](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L701)

round number

***

### firstValidTime?

> `optional` **firstValidTime**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:705](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L705)

UNIX timestamp of block before txn.FirstValid. Fails if negative

***

### freeze?

> `optional` **freeze**: [`Account`](../../../../index/type-aliases/Account.md) \| [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:765](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L765)

32 byte address

***

### lastValid?

> `optional` **lastValid**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:709](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L709)

round number

***

### lease?

> `optional` **lease**: [`bytes`](../../../../index/type-aliases/bytes.md)\<`32`\>

Defined in: [itxn.ts:717](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L717)

32 byte lease value

***

### manager?

> `optional` **manager**: [`Account`](../../../../index/type-aliases/Account.md) \| [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:757](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L757)

32 byte address

***

### metadataHash?

> `optional` **metadataHash**: [`bytes`](../../../../index/type-aliases/bytes.md)\<`32`\>

Defined in: [itxn.ts:753](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L753)

32 byte commitment to unspecified asset metadata

***

### note?

> `optional` **note**: `string` \| [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:713](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L713)

Any data up to 1024 bytes

***

### rekeyTo?

> `optional` **rekeyTo**: [`Account`](../../../../index/type-aliases/Account.md) \| [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:721](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L721)

32 byte Sender's new AuthAddr

***

### reserve?

> `optional` **reserve**: [`Account`](../../../../index/type-aliases/Account.md) \| [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:761](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L761)

32 byte address

***

### sender?

> `optional` **sender**: [`Account`](../../../../index/type-aliases/Account.md) \| [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:693](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L693)

32 byte address

***

### total?

> `optional` **total**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:729](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L729)

Total number of units of this asset created

***

### unitName?

> `optional` **unitName**: `string` \| [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:741](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L741)

Unit name of the asset

***

### url?

> `optional` **url**: `string` \| [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:749](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L749)

URL
