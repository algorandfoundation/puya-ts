---
title: AssetFreezeFields
type: interface
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../../../README.md)

***

[Algorand TypeScript](../../../../modules.md) / [itxn](../../../README.md) / [itxn](../README.md) / AssetFreezeFields

# Interface: AssetFreezeFields

Defined in: [itxn.ts:825](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L825)

## Extended by

- [`AssetFreezeComposeFields`](../../../../index/interfaces/AssetFreezeComposeFields.md)
- [`AnyTransactionComposeFields`](../../../../index/interfaces/AnyTransactionComposeFields.md)

## Properties

### fee?

> `optional` **fee**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:833](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L833)

microalgos

***

### firstValid?

> `optional` **firstValid**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:837](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L837)

round number

***

### firstValidTime?

> `optional` **firstValidTime**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:841](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L841)

UNIX timestamp of block before txn.FirstValid. Fails if negative

***

### freezeAccount?

> `optional` **freezeAccount**: [`Account`](../../../../index/type-aliases/Account.md) \| [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:865](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L865)

32 byte address of the account whose asset slot is being frozen or un-frozen

***

### freezeAsset?

> `optional` **freezeAsset**: [`uint64`](../../../../index/type-aliases/uint64.md) \| [`Asset`](../../../../index/type-aliases/Asset.md)

Defined in: [itxn.ts:861](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L861)

Asset ID being frozen or un-frozen

***

### frozen?

> `optional` **frozen**: `boolean`

Defined in: [itxn.ts:869](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L869)

The new frozen value

***

### lastValid?

> `optional` **lastValid**: [`uint64`](../../../../index/type-aliases/uint64.md)

Defined in: [itxn.ts:845](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L845)

round number

***

### lease?

> `optional` **lease**: [`bytes`](../../../../index/type-aliases/bytes.md)\<`32`\>

Defined in: [itxn.ts:853](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L853)

32 byte lease value

***

### note?

> `optional` **note**: `string` \| [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:849](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L849)

Any data up to 1024 bytes

***

### rekeyTo?

> `optional` **rekeyTo**: [`Account`](../../../../index/type-aliases/Account.md) \| [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:857](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L857)

32 byte Sender's new AuthAddr

***

### sender?

> `optional` **sender**: [`Account`](../../../../index/type-aliases/Account.md) \| [`bytes`](../../../../index/type-aliases/bytes.md)

Defined in: [itxn.ts:829](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L829)

32 byte address
