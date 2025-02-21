[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [index](../../README.md) / [\<internal\>](../README.md) / AssetConfigTxn

# Interface: AssetConfigTxn

Defined in: [packages/algo-ts/src/transactions.ts:159](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L159)

## Extends

- [`TransactionBase`](TransactionBase.md)

## Extended by

- [`AssetConfigInnerTxn`](../../namespaces/itxn/interfaces/AssetConfigInnerTxn.md)
- [`AssetConfigTxn`](../../namespaces/gtxn/interfaces/AssetConfigTxn.md)

## Properties

### assetName

> `readonly` **assetName**: [`bytes`](../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:188](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L188)

The asset name

***

### clawback

> `readonly` **clawback**: [`Account`](../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/transactions.ts:218](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L218)

32 byte address

***

### configAsset

> `readonly` **configAsset**: [`Asset`](../../type-aliases/Asset.md)

Defined in: [packages/algo-ts/src/transactions.ts:163](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L163)

Asset ID in asset config transaction

***

### createdAsset

> **createdAsset**: [`Asset`](../../type-aliases/Asset.md)

Defined in: [packages/algo-ts/src/transactions.ts:222](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L222)

Asset ID allocated by the creation of an ASA

***

### decimals

> `readonly` **decimals**: [`uint64`](../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:173](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L173)

Number of digits to display after the decimal place when displaying the asset

***

### defaultFrozen

> `readonly` **defaultFrozen**: `boolean`

Defined in: [packages/algo-ts/src/transactions.ts:178](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L178)

Whether the asset's slots are frozen by default or not, 0 or 1

***

### fee

> `readonly` **fee**: [`uint64`](../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:44](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L44)

microalgos

#### Inherited from

[`TransactionBase`](TransactionBase.md).[`fee`](TransactionBase.md#fee)

***

### firstValid

> `readonly` **firstValid**: [`uint64`](../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:49](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L49)

round number

#### Inherited from

[`TransactionBase`](TransactionBase.md).[`firstValid`](TransactionBase.md#firstvalid)

***

### firstValidTime

> `readonly` **firstValidTime**: [`uint64`](../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:54](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L54)

UNIX timestamp of block before txn.FirstValid. Fails if negative

#### Inherited from

[`TransactionBase`](TransactionBase.md).[`firstValidTime`](TransactionBase.md#firstvalidtime)

***

### freeze

> `readonly` **freeze**: [`Account`](../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/transactions.ts:213](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L213)

32 byte address

***

### groupIndex

> `readonly` **groupIndex**: [`uint64`](../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:80](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L80)

Position of this transaction within an atomic group
A stand-alone transaction is implicitly element 0 in a group of 1

#### Inherited from

[`TransactionBase`](TransactionBase.md).[`groupIndex`](TransactionBase.md#groupindex)

***

### lastValid

> `readonly` **lastValid**: [`uint64`](../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:59](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L59)

round number

#### Inherited from

[`TransactionBase`](TransactionBase.md).[`lastValid`](TransactionBase.md#lastvalid)

***

### lease

> `readonly` **lease**: [`bytes`](../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:69](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L69)

32 byte lease value

#### Inherited from

[`TransactionBase`](TransactionBase.md).[`lease`](TransactionBase.md#lease)

***

### manager

> `readonly` **manager**: [`Account`](../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/transactions.ts:203](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L203)

32 byte address

***

### metadataHash

> `readonly` **metadataHash**: [`bytes`](../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:198](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L198)

32 byte commitment to unspecified asset metadata

***

### note

> `readonly` **note**: [`bytes`](../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:64](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L64)

Any data up to 1024 bytes

#### Inherited from

[`TransactionBase`](TransactionBase.md).[`note`](TransactionBase.md#note)

***

### rekeyTo

> `readonly` **rekeyTo**: [`Account`](../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/transactions.ts:90](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L90)

32 byte Sender's new AuthAddr

#### Inherited from

[`TransactionBase`](TransactionBase.md).[`rekeyTo`](TransactionBase.md#rekeyto)

***

### reserve

> `readonly` **reserve**: [`Account`](../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/transactions.ts:208](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L208)

32 byte address

***

### sender

> `readonly` **sender**: [`Account`](../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/transactions.ts:39](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L39)

32 byte address

#### Inherited from

[`TransactionBase`](TransactionBase.md).[`sender`](TransactionBase.md#sender)

***

### total

> `readonly` **total**: [`uint64`](../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:168](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L168)

Total number of units of this asset created

***

### txnId

> `readonly` **txnId**: [`bytes`](../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:85](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L85)

The computed ID for this transaction. 32 bytes.

#### Inherited from

[`TransactionBase`](TransactionBase.md).[`txnId`](TransactionBase.md#txnid)

***

### type

> `readonly` **type**: [`AssetConfig`](../../enumerations/TransactionType.md#assetconfig)

Defined in: [packages/algo-ts/src/transactions.ts:227](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L227)

Transaction type as integer

***

### typeBytes

> `readonly` **typeBytes**: [`bytes`](../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:74](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L74)

Transaction type as bytes

#### Inherited from

[`TransactionBase`](TransactionBase.md).[`typeBytes`](TransactionBase.md#typebytes)

***

### unitName

> `readonly` **unitName**: [`bytes`](../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:183](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L183)

Unit name of the asset

***

### url

> `readonly` **url**: [`bytes`](../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:193](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L193)

URL
