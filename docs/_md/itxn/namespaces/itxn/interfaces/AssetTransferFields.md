---
title: AssetTransferFields
type: interface
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../../../README.md)

***

[Algorand TypeScript](../../../../modules.md) / [itxn](../../../README.md) / [itxn](../README.md) / AssetTransferFields

# Interface: AssetTransferFields

Defined in: [itxn.ts:771](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L771)

## Extended by

- [`AssetTransferComposeFields`](../../../../index/interfaces/AssetTransferComposeFields.md)
- [`AnyTransactionComposeFields`](../../../../index/interfaces/AnyTransactionComposeFields.md)

## Properties

### assetAmount?

> `optional` **assetAmount**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:811](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L811)

value in Asset's units

***

### assetCloseTo?

> `optional` **assetCloseTo**: [`Account`](../../../../index/type-aliases/Account.md) \| [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:823](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L823)

32 byte address

***

### assetReceiver?

> `optional` **assetReceiver**: [`Account`](../../../../index/type-aliases/Account.md) \| [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:819](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L819)

32 byte address

***

### assetSender?

> `optional` **assetSender**: [`Account`](../../../../index/type-aliases/Account.md) \| [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:815](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L815)

32 byte address. Source of assets if Sender is the Asset's Clawback address.

***

### fee?

> `optional` **fee**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:779](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L779)

microalgos

***

### firstValid?

> `optional` **firstValid**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:783](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L783)

round number

***

### firstValidTime?

> `optional` **firstValidTime**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:787](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L787)

UNIX timestamp of block before txn.FirstValid. Fails if negative

***

### lastValid?

> `optional` **lastValid**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:791](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L791)

round number

***

### lease?

> `optional` **lease**: [`bytes`](../../../../index/type-aliases/bytes.md)\<`32`\>

Defined in: [itxn.ts:799](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L799)

32 byte lease value

***

### note?

> `optional` **note**: `string` \| [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:795](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L795)

Any data up to 1024 bytes

***

### rekeyTo?

> `optional` **rekeyTo**: [`Account`](../../../../index/type-aliases/Account.md) \| [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:803](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L803)

32 byte Sender's new AuthAddr

***

### sender?

> `optional` **sender**: [`Account`](../../../../index/type-aliases/Account.md) \| [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:775](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L775)

32 byte address

***

### xferAsset?

> `optional` **xferAsset**: [`uint64`](../../../../index/type-aliases/uint64.md) \| [`Asset`](../../../../index/type-aliases/Asset.md)

Defined in: [itxn.ts:807](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L807)

Asset ID
