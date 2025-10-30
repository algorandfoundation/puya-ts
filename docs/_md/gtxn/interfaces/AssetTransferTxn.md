[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [gtxn](../README.md) / AssetTransferTxn

# Interface: AssetTransferTxn

Defined in: [packages/algo-ts/src/gtxn.ts:615](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L615)

A group transaction of type 'axfer'

## Constructors

## Properties

### assetAmount

> `readonly` **assetAmount**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:330](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L330)

value in Asset's units

***

### assetCloseTo

> `readonly` **assetCloseTo**: [`Account`](../../index/type-aliases/Account.md)

Defined in: [packages/algo-ts/src/gtxn.ts:342](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L342)

32 byte address

***

### assetReceiver

> `readonly` **assetReceiver**: [`Account`](../../index/type-aliases/Account.md)

Defined in: [packages/algo-ts/src/gtxn.ts:338](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L338)

32 byte address

***

### assetSender

> `readonly` **assetSender**: [`Account`](../../index/type-aliases/Account.md)

Defined in: [packages/algo-ts/src/gtxn.ts:334](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L334)

32 byte address. Source of assets if Sender is the Asset's Clawback address.

***

### fee

> `readonly` **fee**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:281](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L281)

microalgos

***

### firstValid

> `readonly` **firstValid**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:285](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L285)

round number

***

### firstValidTime

> `readonly` **firstValidTime**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:289](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L289)

UNIX timestamp of block before txn.FirstValid. Fails if negative

***

### groupIndex

> `readonly` **groupIndex**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:314](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L314)

Position of this transaction within an atomic group
A stand-alone transaction is implicitly element 0 in a group of 1

***

### lastValid

> `readonly` **lastValid**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:293](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L293)

round number

***

### lease

> `readonly` **lease**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:301](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L301)

32 byte lease value

***

### note

> `readonly` **note**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:297](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L297)

Any data up to 1024 bytes

***

### rekeyTo

> `readonly` **rekeyTo**: [`Account`](../../index/type-aliases/Account.md)

Defined in: [packages/algo-ts/src/gtxn.ts:322](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L322)

32 byte Sender's new AuthAddr

***

### sender

> `readonly` **sender**: [`Account`](../../index/type-aliases/Account.md)

Defined in: [packages/algo-ts/src/gtxn.ts:277](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L277)

32 byte address

***

### txnId

> `readonly` **txnId**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:318](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L318)

The computed ID for this transaction. 32 bytes.

***

### type

> `readonly` **type**: [`AssetTransfer`](../../index/enumerations/TransactionType.md#assettransfer)

Defined in: [packages/algo-ts/src/gtxn.ts:309](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L309)

Transaction type

***

### typeBytes

> `readonly` **typeBytes**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:305](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L305)

Transaction type as bytes

***

### xferAsset

> `readonly` **xferAsset**: [`Asset`](../../index/type-aliases/Asset.md)

Defined in: [packages/algo-ts/src/gtxn.ts:326](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L326)

Asset ID
