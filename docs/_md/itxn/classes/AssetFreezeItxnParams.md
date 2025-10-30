[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [itxn](../README.md) / AssetFreezeItxnParams

# Class: `abstract` AssetFreezeItxnParams

Defined in: [packages/algo-ts/src/itxn.ts:1099](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1099)

Holds AssetFreeze fields which can be updated, cloned, or submitted.

## Constructors

### Constructor

> **new AssetFreezeItxnParams**(): `AssetFreezeItxnParams`

#### Returns

`AssetFreezeItxnParams`

## Methods

### copy()

> **copy**(): `AssetFreezeItxnParams`

Defined in: [packages/algo-ts/src/itxn.ts:1115](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1115)

Return a copy of this AssetFreezeItxnParams object

#### Returns

`AssetFreezeItxnParams`

***

### set()

> **set**(`fields`): `void`

Defined in: [packages/algo-ts/src/itxn.ts:1109](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1109)

Update one or more fields in this AssetFreezeItxnParams object

#### Parameters

##### fields

[`AssetFreezeFields`](../interfaces/AssetFreezeFields.md)

#### Returns

`void`

***

### submit()

> **submit**(): [`AssetFreezeInnerTxn`](../interfaces/AssetFreezeInnerTxn.md)

Defined in: [packages/algo-ts/src/itxn.ts:1103](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1103)

Submit an itxn with these fields and return the AssetFreezeInnerTxn result

#### Returns

[`AssetFreezeInnerTxn`](../interfaces/AssetFreezeInnerTxn.md)
