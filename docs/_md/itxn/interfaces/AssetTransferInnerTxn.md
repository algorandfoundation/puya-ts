[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [itxn](../README.md) / AssetTransferInnerTxn

# Interface: AssetTransferInnerTxn

Defined in: [packages/algo-ts/src/itxn.ts:272](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L272)

An inner transaction of type 'axfer'

## Properties

### assetAmount

> `readonly` **assetAmount**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:331](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L331)

value in Asset's units

***

### assetCloseTo

> `readonly` **assetCloseTo**: [`Account`](../../index/type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:343](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L343)

32 byte address

***

### assetReceiver

> `readonly` **assetReceiver**: [`Account`](../../index/type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:339](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L339)

32 byte address

***

### assetSender

> `readonly` **assetSender**: [`Account`](../../index/type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:335](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L335)

32 byte address. Source of assets if Sender is the Asset's Clawback address.

***

### fee

> `readonly` **fee**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:282](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L282)

microalgos

***

### firstValid

> `readonly` **firstValid**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:286](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L286)

round number

***

### firstValidTime

> `readonly` **firstValidTime**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:290](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L290)

UNIX timestamp of block before txn.FirstValid. Fails if negative

***

### groupIndex

> `readonly` **groupIndex**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:315](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L315)

Position of this transaction within an atomic group
A stand-alone transaction is implicitly element 0 in a group of 1

***

### lastValid

> `readonly` **lastValid**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:294](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L294)

round number

***

### lease

> `readonly` **lease**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:302](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L302)

32 byte lease value

***

### note

> `readonly` **note**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:298](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L298)

Any data up to 1024 bytes

***

### rekeyTo

> `readonly` **rekeyTo**: [`Account`](../../index/type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:323](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L323)

32 byte Sender's new AuthAddr

***

### sender

> `readonly` **sender**: [`Account`](../../index/type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:278](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L278)

32 byte address

***

### txnId

> `readonly` **txnId**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:319](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L319)

The computed ID for this transaction. 32 bytes.

***

### type

> `readonly` **type**: [`AssetTransfer`](../../index/enumerations/TransactionType.md#assettransfer)

Defined in: [packages/algo-ts/src/itxn.ts:310](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L310)

Transaction type

***

### typeBytes

> `readonly` **typeBytes**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:306](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L306)

Transaction type as bytes

***

### xferAsset

> `readonly` **xferAsset**: [`Asset`](../../index/type-aliases/Asset.md)

Defined in: [packages/algo-ts/src/itxn.ts:327](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L327)

Asset ID
