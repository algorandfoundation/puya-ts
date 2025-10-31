---
title: AssetTransferItxnParams
type: class
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../../../README.md)

***

[Algorand TypeScript](../../../../modules.md) / [itxn](../../../README.md) / [itxn](../README.md) / AssetTransferItxnParams

# Class: `abstract` AssetTransferItxnParams

Defined in: [itxn.ts:1082](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1082)

Holds AssetTransfer fields which can be updated, cloned, or submitted.

## Constructors

### Constructor

> **new AssetTransferItxnParams**(): `AssetTransferItxnParams`

#### Returns

`AssetTransferItxnParams`

## Methods

### copy()

> **copy**(): `AssetTransferItxnParams`

Defined in: [itxn.ts:1098](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1098)

Return a copy of this AssetTransferItxnParams object

#### Returns

`AssetTransferItxnParams`

***

### set()

> **set**(`fields`): `void`

Defined in: [itxn.ts:1092](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1092)

Update one or more fields in this AssetTransferItxnParams object

#### Parameters

##### fields

[`AssetTransferFields`](../interfaces/AssetTransferFields.md)

#### Returns

`void`

***

### submit()

> **submit**(): [`AssetTransferInnerTxn`](../interfaces/AssetTransferInnerTxn.md)

Defined in: [itxn.ts:1086](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1086)

Submit an itxn with these fields and return the AssetTransferInnerTxn result

#### Returns

[`AssetTransferInnerTxn`](../interfaces/AssetTransferInnerTxn.md)
