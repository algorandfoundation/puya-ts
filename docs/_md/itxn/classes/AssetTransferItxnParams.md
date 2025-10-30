[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [itxn](../README.md) / AssetTransferItxnParams

# Class: `abstract` AssetTransferItxnParams

Defined in: [packages/algo-ts/src/itxn.ts:1070](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1070)

Holds AssetTransfer fields which can be updated, cloned, or submitted.

## Constructors

### Constructor

> **new AssetTransferItxnParams**(): `AssetTransferItxnParams`

#### Returns

`AssetTransferItxnParams`

## Methods

### copy()

> **copy**(): `AssetTransferItxnParams`

Defined in: [packages/algo-ts/src/itxn.ts:1086](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1086)

Return a copy of this AssetTransferItxnParams object

#### Returns

`AssetTransferItxnParams`

***

### set()

> **set**(`fields`): `void`

Defined in: [packages/algo-ts/src/itxn.ts:1080](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1080)

Update one or more fields in this AssetTransferItxnParams object

#### Parameters

##### fields

[`AssetTransferFields`](../interfaces/AssetTransferFields.md)

#### Returns

`void`

***

### submit()

> **submit**(): [`AssetTransferInnerTxn`](../interfaces/AssetTransferInnerTxn.md)

Defined in: [packages/algo-ts/src/itxn.ts:1074](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1074)

Submit an itxn with these fields and return the AssetTransferInnerTxn result

#### Returns

[`AssetTransferInnerTxn`](../interfaces/AssetTransferInnerTxn.md)
