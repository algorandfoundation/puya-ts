[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [gtxn](../README.md) / AssetTransferTxn

# Interface: AssetTransferTxn

Defined in: [packages/algo-ts/src/gtxn.ts:45](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L45)

## Extends

- `AssetTransferTxn`

## Constructors

## Properties

### assetAmount

> `readonly` **assetAmount**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:239](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L239)

value in Asset's units

#### Inherited from

`txnTypes.AssetTransferTxn.assetAmount`

***

### assetCloseTo

> `readonly` **assetCloseTo**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/transactions.ts:254](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L254)

32 byte address

#### Inherited from

`txnTypes.AssetTransferTxn.assetCloseTo`

***

### assetReceiver

> `readonly` **assetReceiver**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/transactions.ts:249](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L249)

32 byte address

#### Inherited from

`txnTypes.AssetTransferTxn.assetReceiver`

***

### assetSender

> `readonly` **assetSender**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/transactions.ts:244](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L244)

32 byte address. Source of assets if Sender is the Asset's Clawback address.

#### Inherited from

`txnTypes.AssetTransferTxn.assetSender`

***

### fee

> `readonly` **fee**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:44](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L44)

microalgos

#### Inherited from

`txnTypes.AssetTransferTxn.fee`

***

### firstValid

> `readonly` **firstValid**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:49](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L49)

round number

#### Inherited from

`txnTypes.AssetTransferTxn.firstValid`

***

### firstValidTime

> `readonly` **firstValidTime**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:54](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L54)

UNIX timestamp of block before txn.FirstValid. Fails if negative

#### Inherited from

`txnTypes.AssetTransferTxn.firstValidTime`

***

### groupIndex

> `readonly` **groupIndex**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:80](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L80)

Position of this transaction within an atomic group
A stand-alone transaction is implicitly element 0 in a group of 1

#### Inherited from

`txnTypes.AssetTransferTxn.groupIndex`

***

### lastValid

> `readonly` **lastValid**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:59](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L59)

round number

#### Inherited from

`txnTypes.AssetTransferTxn.lastValid`

***

### lease

> `readonly` **lease**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:69](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L69)

32 byte lease value

#### Inherited from

`txnTypes.AssetTransferTxn.lease`

***

### note

> `readonly` **note**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:64](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L64)

Any data up to 1024 bytes

#### Inherited from

`txnTypes.AssetTransferTxn.note`

***

### rekeyTo

> `readonly` **rekeyTo**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/transactions.ts:90](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L90)

32 byte Sender's new AuthAddr

#### Inherited from

`txnTypes.AssetTransferTxn.rekeyTo`

***

### sender

> `readonly` **sender**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/transactions.ts:39](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L39)

32 byte address

#### Inherited from

`txnTypes.AssetTransferTxn.sender`

***

### txnId

> `readonly` **txnId**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:85](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L85)

The computed ID for this transaction. 32 bytes.

#### Inherited from

`txnTypes.AssetTransferTxn.txnId`

***

### type

> `readonly` **type**: [`AssetTransfer`](../../../enumerations/TransactionType.md#assettransfer)

Defined in: [packages/algo-ts/src/transactions.ts:258](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L258)

Transaction type as integer

#### Inherited from

`txnTypes.AssetTransferTxn.type`

***

### typeBytes

> `readonly` **typeBytes**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:74](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L74)

Transaction type as bytes

#### Inherited from

`txnTypes.AssetTransferTxn.typeBytes`

***

### xferAsset

> `readonly` **xferAsset**: [`Asset`](../../../type-aliases/Asset.md)

Defined in: [packages/algo-ts/src/transactions.ts:234](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L234)

Asset ID

#### Inherited from

`txnTypes.AssetTransferTxn.xferAsset`
