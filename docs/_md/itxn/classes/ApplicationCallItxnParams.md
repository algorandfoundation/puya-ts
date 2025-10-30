[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [itxn](../README.md) / ApplicationCallItxnParams

# Class: `abstract` ApplicationCallItxnParams

Defined in: [packages/algo-ts/src/itxn.ts:1128](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1128)

Holds ApplicationCall fields which can be updated, cloned, or submitted.

## Constructors

### Constructor

> **new ApplicationCallItxnParams**(): `ApplicationCallItxnParams`

#### Returns

`ApplicationCallItxnParams`

## Methods

### copy()

> **copy**(): `ApplicationCallItxnParams`

Defined in: [packages/algo-ts/src/itxn.ts:1144](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1144)

Return a copy of this ApplicationCallItxnParams object

#### Returns

`ApplicationCallItxnParams`

***

### set()

> **set**(`fields`): `void`

Defined in: [packages/algo-ts/src/itxn.ts:1138](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1138)

Update one or more fields in this ApplicationCallItxnParams object

#### Parameters

##### fields

[`ApplicationCallFields`](../interfaces/ApplicationCallFields.md)

#### Returns

`void`

***

### submit()

> **submit**(): [`ApplicationCallInnerTxn`](../interfaces/ApplicationCallInnerTxn.md)

Defined in: [packages/algo-ts/src/itxn.ts:1132](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L1132)

Submit an itxn with these fields and return the ApplicationCallInnerTxn result

#### Returns

[`ApplicationCallInnerTxn`](../interfaces/ApplicationCallInnerTxn.md)
