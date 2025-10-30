[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [itxn](../README.md) / AssetFreezeInnerTxn

# Interface: AssetFreezeInnerTxn

Defined in: [packages/algo-ts/src/itxn.ts:348](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L348)

An inner transaction of type 'afrz'

## Properties

### fee

> `readonly` **fee**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:358](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L358)

microalgos

***

### firstValid

> `readonly` **firstValid**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:362](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L362)

round number

***

### firstValidTime

> `readonly` **firstValidTime**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:366](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L366)

UNIX timestamp of block before txn.FirstValid. Fails if negative

***

### freezeAccount

> `readonly` **freezeAccount**: [`Account`](../../index/type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:407](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L407)

32 byte address of the account whose asset slot is being frozen or un-frozen

***

### freezeAsset

> `readonly` **freezeAsset**: [`Asset`](../../index/type-aliases/Asset.md)

Defined in: [packages/algo-ts/src/itxn.ts:403](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L403)

Asset ID being frozen or un-frozen

***

### frozen

> `readonly` **frozen**: `boolean`

Defined in: [packages/algo-ts/src/itxn.ts:411](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L411)

The new frozen value

***

### groupIndex

> `readonly` **groupIndex**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:391](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L391)

Position of this transaction within an atomic group
A stand-alone transaction is implicitly element 0 in a group of 1

***

### lastValid

> `readonly` **lastValid**: [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:370](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L370)

round number

***

### lease

> `readonly` **lease**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:378](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L378)

32 byte lease value

***

### note

> `readonly` **note**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:374](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L374)

Any data up to 1024 bytes

***

### rekeyTo

> `readonly` **rekeyTo**: [`Account`](../../index/type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:399](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L399)

32 byte Sender's new AuthAddr

***

### sender

> `readonly` **sender**: [`Account`](../../index/type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:354](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L354)

32 byte address

***

### txnId

> `readonly` **txnId**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:395](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L395)

The computed ID for this transaction. 32 bytes.

***

### type

> `readonly` **type**: [`AssetFreeze`](../../index/enumerations/TransactionType.md#assetfreeze)

Defined in: [packages/algo-ts/src/itxn.ts:386](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L386)

Transaction type

***

### typeBytes

> `readonly` **typeBytes**: [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:382](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L382)

Transaction type as bytes
