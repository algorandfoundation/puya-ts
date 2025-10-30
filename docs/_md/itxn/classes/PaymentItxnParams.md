[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [itxn](../README.md) / PaymentItxnParams

# Class: `abstract` PaymentItxnParams

Defined in: [packages/algo-ts/src/itxn.ts:983](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L983)

Holds Payment fields which can be updated, cloned, or submitted.

## Constructors

### Constructor

> **new PaymentItxnParams**(): `PaymentItxnParams`

#### Returns

`PaymentItxnParams`

## Methods

### copy()

> **copy**(): `PaymentItxnParams`

Defined in: [packages/algo-ts/src/itxn.ts:999](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L999)

Return a copy of this PaymentItxnParams object

#### Returns

`PaymentItxnParams`

***

### set()

> **set**(`fields`): `void`

Defined in: [packages/algo-ts/src/itxn.ts:993](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L993)

Update one or more fields in this PaymentItxnParams object

#### Parameters

##### fields

[`PaymentFields`](../interfaces/PaymentFields.md)

#### Returns

`void`

***

### submit()

> **submit**(): [`PaymentInnerTxn`](../interfaces/PaymentInnerTxn.md)

Defined in: [packages/algo-ts/src/itxn.ts:987](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L987)

Submit an itxn with these fields and return the PaymentInnerTxn result

#### Returns

[`PaymentInnerTxn`](../interfaces/PaymentInnerTxn.md)
