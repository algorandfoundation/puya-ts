---
title: AssetConfigComposeFields
type: interface
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / AssetConfigComposeFields

# Interface: AssetConfigComposeFields

Defined in: [itxn-compose.ts:13](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn-compose.ts#L13)

## Extends

- [`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md)

## Properties

### assetName?

> `optional` **assetName**: `string` \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:745](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L745)

The asset name

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`assetName`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#assetname)

***

### clawback?

> `optional` **clawback**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:769](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L769)

32 byte address

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`clawback`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#clawback)

***

### configAsset?

> `optional` **configAsset**: [`uint64`](../type-aliases/uint64.md) \| [`Asset`](../type-aliases/Asset.md)

Defined in: [itxn.ts:725](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L725)

Asset ID in asset config transaction

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`configAsset`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#configasset)

***

### decimals?

> `optional` **decimals**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:733](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L733)

Number of digits to display after the decimal place when displaying the asset

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`decimals`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#decimals)

***

### defaultFrozen?

> `optional` **defaultFrozen**: `boolean`

Defined in: [itxn.ts:737](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L737)

Whether the asset's slots are frozen by default or not, 0 or 1

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`defaultFrozen`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#defaultfrozen)

***

### fee?

> `optional` **fee**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:697](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L697)

microalgos

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`fee`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#fee)

***

### firstValid?

> `optional` **firstValid**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:701](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L701)

round number

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`firstValid`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#firstvalid)

***

### firstValidTime?

> `optional` **firstValidTime**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:705](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L705)

UNIX timestamp of block before txn.FirstValid. Fails if negative

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`firstValidTime`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#firstvalidtime)

***

### freeze?

> `optional` **freeze**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:765](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L765)

32 byte address

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`freeze`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#freeze)

***

### lastValid?

> `optional` **lastValid**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:709](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L709)

round number

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`lastValid`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#lastvalid)

***

### lease?

> `optional` **lease**: [`bytes`](../type-aliases/bytes.md)\<`32`\>

Defined in: [itxn.ts:717](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L717)

32 byte lease value

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`lease`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#lease)

***

### manager?

> `optional` **manager**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:757](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L757)

32 byte address

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`manager`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#manager)

***

### metadataHash?

> `optional` **metadataHash**: [`bytes`](../type-aliases/bytes.md)\<`32`\>

Defined in: [itxn.ts:753](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L753)

32 byte commitment to unspecified asset metadata

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`metadataHash`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#metadatahash)

***

### note?

> `optional` **note**: `string` \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:713](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L713)

Any data up to 1024 bytes

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`note`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#note)

***

### rekeyTo?

> `optional` **rekeyTo**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:721](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L721)

32 byte Sender's new AuthAddr

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`rekeyTo`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#rekeyto)

***

### reserve?

> `optional` **reserve**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:761](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L761)

32 byte address

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`reserve`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#reserve)

***

### sender?

> `optional` **sender**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:693](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L693)

32 byte address

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`sender`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#sender)

***

### total?

> `optional` **total**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:729](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L729)

Total number of units of this asset created

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`total`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#total)

***

### type

> **type**: [`AssetConfig`](../enumerations/TransactionType.md#assetconfig)

Defined in: [itxn-compose.ts:14](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn-compose.ts#L14)

***

### unitName?

> `optional` **unitName**: `string` \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:741](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L741)

Unit name of the asset

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`unitName`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#unitname)

***

### url?

> `optional` **url**: `string` \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:749](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L749)

URL

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`url`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#url)
