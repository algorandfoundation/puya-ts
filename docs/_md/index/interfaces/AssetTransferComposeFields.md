---
title: AssetTransferComposeFields
type: interface
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / AssetTransferComposeFields

# Interface: AssetTransferComposeFields

Defined in: [itxn-compose.ts:16](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn-compose.ts#L16)

## Extends

- [`AssetTransferFields`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md)

## Properties

### assetAmount?

> `optional` **assetAmount**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:811](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L811)

value in Asset's units

#### Inherited from

[`AssetTransferFields`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md).[`assetAmount`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md#assetamount)

***

### assetCloseTo?

> `optional` **assetCloseTo**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:823](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L823)

32 byte address

#### Inherited from

[`AssetTransferFields`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md).[`assetCloseTo`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md#assetcloseto)

***

### assetReceiver?

> `optional` **assetReceiver**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:819](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L819)

32 byte address

#### Inherited from

[`AssetTransferFields`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md).[`assetReceiver`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md#assetreceiver)

***

### assetSender?

> `optional` **assetSender**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:815](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L815)

32 byte address. Source of assets if Sender is the Asset's Clawback address.

#### Inherited from

[`AssetTransferFields`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md).[`assetSender`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md#assetsender)

***

### fee?

> `optional` **fee**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:779](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L779)

microalgos

#### Inherited from

[`AssetTransferFields`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md).[`fee`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md#fee)

***

### firstValid?

> `optional` **firstValid**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:783](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L783)

round number

#### Inherited from

[`AssetTransferFields`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md).[`firstValid`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md#firstvalid)

***

### firstValidTime?

> `optional` **firstValidTime**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:787](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L787)

UNIX timestamp of block before txn.FirstValid. Fails if negative

#### Inherited from

[`AssetTransferFields`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md).[`firstValidTime`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md#firstvalidtime)

***

### lastValid?

> `optional` **lastValid**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:791](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L791)

round number

#### Inherited from

[`AssetTransferFields`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md).[`lastValid`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md#lastvalid)

***

### lease?

> `optional` **lease**: [`bytes`](../type-aliases/bytes.md)\<`32`\>

Defined in: [itxn.ts:799](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L799)

32 byte lease value

#### Inherited from

[`AssetTransferFields`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md).[`lease`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md#lease)

***

### note?

> `optional` **note**: `string` \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:795](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L795)

Any data up to 1024 bytes

#### Inherited from

[`AssetTransferFields`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md).[`note`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md#note)

***

### rekeyTo?

> `optional` **rekeyTo**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:803](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L803)

32 byte Sender's new AuthAddr

#### Inherited from

[`AssetTransferFields`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md).[`rekeyTo`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md#rekeyto)

***

### sender?

> `optional` **sender**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:775](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L775)

32 byte address

#### Inherited from

[`AssetTransferFields`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md).[`sender`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md#sender)

***

### type

> **type**: [`AssetTransfer`](../enumerations/TransactionType.md#assettransfer)

Defined in: [itxn-compose.ts:17](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn-compose.ts#L17)

***

### xferAsset?

> `optional` **xferAsset**: [`uint64`](../type-aliases/uint64.md) \| [`Asset`](../type-aliases/Asset.md)

Defined in: [itxn.ts:807](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L807)

Asset ID

#### Inherited from

[`AssetTransferFields`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md).[`xferAsset`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md#xferasset)
