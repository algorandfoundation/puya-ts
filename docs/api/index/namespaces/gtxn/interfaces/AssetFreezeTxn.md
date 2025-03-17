[**@algorandfoundation/algorand-typescript**](../../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../../README.md) / [index](../../../README.md) / [gtxn](../README.md) / AssetFreezeTxn

# Interface: AssetFreezeTxn

Defined in: [packages/algo-ts/src/gtxn.ts:48](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L48)

## Extends

- [`AssetFreezeTxn`](../../../-internal-/interfaces/AssetFreezeTxn.md)

## Constructors

## Properties

### fee

> `readonly` **fee**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:44](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L44)

microalgos

#### Inherited from

[`AssetFreezeTxn`](../../../-internal-/interfaces/AssetFreezeTxn.md).[`fee`](../../../-internal-/interfaces/AssetFreezeTxn.md#fee)

***

### firstValid

> `readonly` **firstValid**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:49](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L49)

round number

#### Inherited from

[`AssetFreezeTxn`](../../../-internal-/interfaces/AssetFreezeTxn.md).[`firstValid`](../../../-internal-/interfaces/AssetFreezeTxn.md#firstvalid)

***

### firstValidTime

> `readonly` **firstValidTime**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:54](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L54)

UNIX timestamp of block before txn.FirstValid. Fails if negative

#### Inherited from

[`AssetFreezeTxn`](../../../-internal-/interfaces/AssetFreezeTxn.md).[`firstValidTime`](../../../-internal-/interfaces/AssetFreezeTxn.md#firstvalidtime)

***

### freezeAccount

> `readonly` **freezeAccount**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/transactions.ts:270](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L270)

32 byte address of the account whose asset slot is being frozen or un-frozen

#### Inherited from

[`AssetFreezeTxn`](../../../-internal-/interfaces/AssetFreezeTxn.md).[`freezeAccount`](../../../-internal-/interfaces/AssetFreezeTxn.md#freezeaccount)

***

### freezeAsset

> `readonly` **freezeAsset**: [`Asset`](../../../type-aliases/Asset.md)

Defined in: [packages/algo-ts/src/transactions.ts:265](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L265)

Asset ID being frozen or un-frozen

#### Inherited from

[`AssetFreezeTxn`](../../../-internal-/interfaces/AssetFreezeTxn.md).[`freezeAsset`](../../../-internal-/interfaces/AssetFreezeTxn.md#freezeasset)

***

### frozen

> `readonly` **frozen**: `boolean`

Defined in: [packages/algo-ts/src/transactions.ts:275](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L275)

The new frozen value

#### Inherited from

[`AssetFreezeTxn`](../../../-internal-/interfaces/AssetFreezeTxn.md).[`frozen`](../../../-internal-/interfaces/AssetFreezeTxn.md#frozen)

***

### groupIndex

> `readonly` **groupIndex**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:80](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L80)

Position of this transaction within an atomic group
A stand-alone transaction is implicitly element 0 in a group of 1

#### Inherited from

[`AssetFreezeTxn`](../../../-internal-/interfaces/AssetFreezeTxn.md).[`groupIndex`](../../../-internal-/interfaces/AssetFreezeTxn.md#groupindex)

***

### lastValid

> `readonly` **lastValid**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:59](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L59)

round number

#### Inherited from

[`AssetFreezeTxn`](../../../-internal-/interfaces/AssetFreezeTxn.md).[`lastValid`](../../../-internal-/interfaces/AssetFreezeTxn.md#lastvalid)

***

### lease

> `readonly` **lease**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:69](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L69)

32 byte lease value

#### Inherited from

[`AssetFreezeTxn`](../../../-internal-/interfaces/AssetFreezeTxn.md).[`lease`](../../../-internal-/interfaces/AssetFreezeTxn.md#lease)

***

### note

> `readonly` **note**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:64](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L64)

Any data up to 1024 bytes

#### Inherited from

[`AssetFreezeTxn`](../../../-internal-/interfaces/AssetFreezeTxn.md).[`note`](../../../-internal-/interfaces/AssetFreezeTxn.md#note)

***

### rekeyTo

> `readonly` **rekeyTo**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/transactions.ts:90](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L90)

32 byte Sender's new AuthAddr

#### Inherited from

[`AssetFreezeTxn`](../../../-internal-/interfaces/AssetFreezeTxn.md).[`rekeyTo`](../../../-internal-/interfaces/AssetFreezeTxn.md#rekeyto)

***

### sender

> `readonly` **sender**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/transactions.ts:39](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L39)

32 byte address

#### Inherited from

[`AssetFreezeTxn`](../../../-internal-/interfaces/AssetFreezeTxn.md).[`sender`](../../../-internal-/interfaces/AssetFreezeTxn.md#sender)

***

### txnId

> `readonly` **txnId**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:85](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L85)

The computed ID for this transaction. 32 bytes.

#### Inherited from

[`AssetFreezeTxn`](../../../-internal-/interfaces/AssetFreezeTxn.md).[`txnId`](../../../-internal-/interfaces/AssetFreezeTxn.md#txnid)

***

### type

> `readonly` **type**: [`AssetFreeze`](../../../enumerations/TransactionType.md#assetfreeze)

Defined in: [packages/algo-ts/src/transactions.ts:279](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L279)

Transaction type as integer

#### Inherited from

[`AssetFreezeTxn`](../../../-internal-/interfaces/AssetFreezeTxn.md).[`type`](../../../-internal-/interfaces/AssetFreezeTxn.md#type)

***

### typeBytes

> `readonly` **typeBytes**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:74](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L74)

Transaction type as bytes

#### Inherited from

[`AssetFreezeTxn`](../../../-internal-/interfaces/AssetFreezeTxn.md).[`typeBytes`](../../../-internal-/interfaces/AssetFreezeTxn.md#typebytes)
