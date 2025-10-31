---
title: AssetFreezeItxnParams
type: class
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../../../README.md)

***

[Algorand TypeScript](../../../../modules.md) / [itxn](../../../README.md) / [itxn](../README.md) / AssetFreezeItxnParams

# Class: `abstract` AssetFreezeItxnParams

Defined in: [itxn.ts:1111](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1111)

Holds AssetFreeze fields which can be updated, cloned, or submitted.

## Constructors

### Constructor

> **new AssetFreezeItxnParams**(): `AssetFreezeItxnParams`

#### Returns

`AssetFreezeItxnParams`

## Methods

### copy()

> **copy**(): `AssetFreezeItxnParams`

Defined in: [itxn.ts:1127](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1127)

Return a copy of this AssetFreezeItxnParams object

#### Returns

`AssetFreezeItxnParams`

***

### set()

> **set**(`fields`): `void`

Defined in: [itxn.ts:1121](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1121)

Update one or more fields in this AssetFreezeItxnParams object

#### Parameters

##### fields

[`AssetFreezeFields`](../interfaces/AssetFreezeFields.md)

#### Returns

`void`

***

### submit()

> **submit**(): [`AssetFreezeInnerTxn`](../interfaces/AssetFreezeInnerTxn.md)

Defined in: [itxn.ts:1115](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1115)

Submit an itxn with these fields and return the AssetFreezeInnerTxn result

#### Returns

[`AssetFreezeInnerTxn`](../interfaces/AssetFreezeInnerTxn.md)
