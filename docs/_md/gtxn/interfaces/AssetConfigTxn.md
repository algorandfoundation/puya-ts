[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [gtxn](../README.md) / AssetConfigTxn

# Interface: AssetConfigTxn

Defined in: [packages/algo-ts/src/gtxn.ts:607](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L607)

A group transaction of type 'acfg'

## Constructors

## Properties

### assetName

> `readonly` **assetName**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:242](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L242)

The asset name

***

### clawback

> `readonly` **clawback**: [`Account`](../../index/type-aliases/Account.md)

Defined in: [packages/algo-ts/src/gtxn.ts:266](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L266)

32 byte address

***

### configAsset

> `readonly` **configAsset**: [`Asset`](../../index/type-aliases/Asset.md)

Defined in: [packages/algo-ts/src/gtxn.ts:218](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L218)

Asset ID in asset config transaction

***

### createdAsset

> `readonly` **createdAsset**: [`Asset`](../../index/type-aliases/Asset.md)

Defined in: [packages/algo-ts/src/gtxn.ts:222](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L222)

The asset created by this transaction

***

### decimals

> `readonly` **decimals**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:230](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L230)

Number of digits to display after the decimal place when displaying the asset

***

### defaultFrozen

> `readonly` **defaultFrozen**: `boolean`

Defined in: [packages/algo-ts/src/gtxn.ts:234](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L234)

Whether the asset's slots are frozen by default or not, 0 or 1

***

### fee

> `readonly` **fee**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:173](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L173)

microalgos

***

### firstValid

> `readonly` **firstValid**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:177](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L177)

round number

***

### firstValidTime

> `readonly` **firstValidTime**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:181](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L181)

UNIX timestamp of block before txn.FirstValid. Fails if negative

***

### freeze

> `readonly` **freeze**: [`Account`](../../index/type-aliases/Account.md)

Defined in: [packages/algo-ts/src/gtxn.ts:262](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L262)

32 byte address

***

### groupIndex

> `readonly` **groupIndex**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:206](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L206)

Position of this transaction within an atomic group
A stand-alone transaction is implicitly element 0 in a group of 1

***

### lastValid

> `readonly` **lastValid**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:185](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L185)

round number

***

### lease

> `readonly` **lease**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:193](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L193)

32 byte lease value

***

### manager

> `readonly` **manager**: [`Account`](../../index/type-aliases/Account.md)

Defined in: [packages/algo-ts/src/gtxn.ts:254](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L254)

32 byte address

***

### metadataHash

> `readonly` **metadataHash**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:250](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L250)

32 byte commitment to unspecified asset metadata

***

### note

> `readonly` **note**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:189](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L189)

Any data up to 1024 bytes

***

### rekeyTo

> `readonly` **rekeyTo**: [`Account`](../../index/type-aliases/Account.md)

Defined in: [packages/algo-ts/src/gtxn.ts:214](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L214)

32 byte Sender's new AuthAddr

***

### reserve

> `readonly` **reserve**: [`Account`](../../index/type-aliases/Account.md)

Defined in: [packages/algo-ts/src/gtxn.ts:258](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L258)

32 byte address

***

### sender

> `readonly` **sender**: [`Account`](../../index/type-aliases/Account.md)

Defined in: [packages/algo-ts/src/gtxn.ts:169](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L169)

32 byte address

***

### total

> `readonly` **total**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:226](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L226)

Total number of units of this asset created

***

### txnId

> `readonly` **txnId**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:210](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L210)

The computed ID for this transaction. 32 bytes.

***

### type

> `readonly` **type**: [`AssetConfig`](../../index/enumerations/TransactionType.md#assetconfig)

Defined in: [packages/algo-ts/src/gtxn.ts:201](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L201)

Transaction type

***

### typeBytes

> `readonly` **typeBytes**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:197](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L197)

Transaction type as bytes

***

### unitName

> `readonly` **unitName**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:238](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L238)

Unit name of the asset

***

### url

> `readonly` **url**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:246](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L246)

URL
