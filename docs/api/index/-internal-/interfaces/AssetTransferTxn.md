[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [index](../../README.md) / [\<internal\>](../README.md) / AssetTransferTxn

# Interface: AssetTransferTxn

Defined in: [packages/algo-ts/src/transactions.ts:230](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L230)

## Extends

- [`TransactionBase`](TransactionBase.md)

## Extended by

- [`AssetTransferInnerTxn`](../../namespaces/itxn/interfaces/AssetTransferInnerTxn.md)
- [`AssetTransferTxn`](../../namespaces/gtxn/interfaces/AssetTransferTxn.md)

## Properties

### assetAmount

> `readonly` **assetAmount**: [`uint64`](../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:239](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L239)

value in Asset's units

***

### assetCloseTo

> `readonly` **assetCloseTo**: [`Account`](../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/transactions.ts:254](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L254)

32 byte address

***

### assetReceiver

> `readonly` **assetReceiver**: [`Account`](../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/transactions.ts:249](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L249)

32 byte address

***

### assetSender

> `readonly` **assetSender**: [`Account`](../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/transactions.ts:244](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L244)

32 byte address. Source of assets if Sender is the Asset's Clawback address.

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

### sender

> `readonly` **sender**: [`Account`](../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/transactions.ts:39](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L39)

32 byte address

#### Inherited from

[`TransactionBase`](TransactionBase.md).[`sender`](TransactionBase.md#sender)

***

### txnId

> `readonly` **txnId**: [`bytes`](../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:85](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L85)

The computed ID for this transaction. 32 bytes.

#### Inherited from

[`TransactionBase`](TransactionBase.md).[`txnId`](TransactionBase.md#txnid)

***

### type

> `readonly` **type**: [`AssetTransfer`](../../enumerations/TransactionType.md#assettransfer)

Defined in: [packages/algo-ts/src/transactions.ts:258](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L258)

Transaction type as integer

***

### typeBytes

> `readonly` **typeBytes**: [`bytes`](../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:74](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L74)

Transaction type as bytes

#### Inherited from

[`TransactionBase`](TransactionBase.md).[`typeBytes`](TransactionBase.md#typebytes)

***

### xferAsset

> `readonly` **xferAsset**: [`Asset`](../../type-aliases/Asset.md)

Defined in: [packages/algo-ts/src/transactions.ts:234](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L234)

Asset ID
