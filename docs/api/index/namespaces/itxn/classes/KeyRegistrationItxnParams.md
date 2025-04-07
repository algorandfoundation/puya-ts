[**@algorandfoundation/algorand-typescript**](../../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../../README.md) / [index](../../../README.md) / [itxn](../README.md) / KeyRegistrationItxnParams

# Class: `abstract` KeyRegistrationItxnParams

Defined in: [packages/algo-ts/src/itxn.ts:1012](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1012)

Holds KeyRegistration fields which can be updated, cloned, or submitted.

## Constructors

### Constructor

> **new KeyRegistrationItxnParams**(): `KeyRegistrationItxnParams`

#### Returns

`KeyRegistrationItxnParams`

## Methods

### copy()

> **copy**(): `KeyRegistrationItxnParams`

Defined in: [packages/algo-ts/src/itxn.ts:1028](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1028)

Return a copy of this KeyRegistrationItxnParams object

#### Returns

`KeyRegistrationItxnParams`

***

### set()

> **set**(`fields`): `void`

Defined in: [packages/algo-ts/src/itxn.ts:1022](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1022)

Update one or more fields in this KeyRegistrationItxnParams object

#### Parameters

##### fields

[`KeyRegistrationFields`](../interfaces/KeyRegistrationFields.md)

#### Returns

`void`

***

### submit()

> **submit**(): [`KeyRegistrationInnerTxn`](../interfaces/KeyRegistrationInnerTxn.md)

Defined in: [packages/algo-ts/src/itxn.ts:1016](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1016)

Submit an itxn with these fields and return the KeyRegistrationInnerTxn result

#### Returns

[`KeyRegistrationInnerTxn`](../interfaces/KeyRegistrationInnerTxn.md)
