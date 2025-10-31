---
title: AssetFreezeComposeFields
type: interface
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / AssetFreezeComposeFields

# Interface: AssetFreezeComposeFields

Defined in: [itxn-compose.ts:19](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn-compose.ts#L19)

## Extends

- [`AssetFreezeFields`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md)

## Properties

### fee?

> `optional` **fee**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:833](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L833)

microalgos

#### Inherited from

[`AssetFreezeFields`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md).[`fee`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md#fee)

***

### firstValid?

> `optional` **firstValid**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:837](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L837)

round number

#### Inherited from

[`AssetFreezeFields`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md).[`firstValid`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md#firstvalid)

***

### firstValidTime?

> `optional` **firstValidTime**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:841](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L841)

UNIX timestamp of block before txn.FirstValid. Fails if negative

#### Inherited from

[`AssetFreezeFields`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md).[`firstValidTime`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md#firstvalidtime)

***

### freezeAccount?

> `optional` **freezeAccount**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:865](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L865)

32 byte address of the account whose asset slot is being frozen or un-frozen

#### Inherited from

[`AssetFreezeFields`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md).[`freezeAccount`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md#freezeaccount)

***

### freezeAsset?

> `optional` **freezeAsset**: [`uint64`](../type-aliases/uint64.md) \| [`Asset`](../type-aliases/Asset.md)

Defined in: [itxn.ts:861](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L861)

Asset ID being frozen or un-frozen

#### Inherited from

[`AssetFreezeFields`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md).[`freezeAsset`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md#freezeasset)

***

### frozen?

> `optional` **frozen**: `boolean`

Defined in: [itxn.ts:869](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L869)

The new frozen value

#### Inherited from

[`AssetFreezeFields`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md).[`frozen`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md#frozen)

***

### lastValid?

> `optional` **lastValid**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:845](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L845)

round number

#### Inherited from

[`AssetFreezeFields`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md).[`lastValid`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md#lastvalid)

***

### lease?

> `optional` **lease**: [`bytes`](../type-aliases/bytes.md)\<`32`\>

Defined in: [itxn.ts:853](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L853)

32 byte lease value

#### Inherited from

[`AssetFreezeFields`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md).[`lease`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md#lease)

***

### note?

> `optional` **note**: `string` \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:849](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L849)

Any data up to 1024 bytes

#### Inherited from

[`AssetFreezeFields`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md).[`note`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md#note)

***

### rekeyTo?

> `optional` **rekeyTo**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:857](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L857)

32 byte Sender's new AuthAddr

#### Inherited from

[`AssetFreezeFields`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md).[`rekeyTo`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md#rekeyto)

***

### sender?

> `optional` **sender**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:829](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L829)

32 byte address

#### Inherited from

[`AssetFreezeFields`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md).[`sender`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md#sender)

***

### type

> **type**: [`AssetFreeze`](../enumerations/TransactionType.md#assetfreeze)

Defined in: [itxn-compose.ts:20](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn-compose.ts#L20)
