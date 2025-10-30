[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [itxn](../README.md) / AssetConfigItxnParams

# Class: `abstract` AssetConfigItxnParams

Defined in: [packages/algo-ts/src/itxn.ts:1041](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1041)

Holds AssetConfig fields which can be updated, cloned, or submitted.

## Constructors

### Constructor

> **new AssetConfigItxnParams**(): `AssetConfigItxnParams`

#### Returns

`AssetConfigItxnParams`

## Methods

### copy()

> **copy**(): `AssetConfigItxnParams`

Defined in: [packages/algo-ts/src/itxn.ts:1057](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1057)

Return a copy of this AssetConfigItxnParams object

#### Returns

`AssetConfigItxnParams`

***

### set()

> **set**(`fields`): `void`

Defined in: [packages/algo-ts/src/itxn.ts:1051](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1051)

Update one or more fields in this AssetConfigItxnParams object

#### Parameters

##### fields

[`AssetConfigFields`](../interfaces/AssetConfigFields.md)

#### Returns

`void`

***

### submit()

> **submit**(): [`AssetConfigInnerTxn`](../interfaces/AssetConfigInnerTxn.md)

Defined in: [packages/algo-ts/src/itxn.ts:1045](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1045)

Submit an itxn with these fields and return the AssetConfigInnerTxn result

#### Returns

[`AssetConfigInnerTxn`](../interfaces/AssetConfigInnerTxn.md)
