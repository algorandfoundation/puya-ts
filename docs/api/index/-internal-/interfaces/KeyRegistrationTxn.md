[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [index](../../README.md) / [\<internal\>](../README.md) / KeyRegistrationTxn

# Interface: KeyRegistrationTxn

Defined in: [packages/algo-ts/src/transactions.ts:118](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L118)

## Extends

- [`TransactionBase`](TransactionBase.md)

## Extended by

- [`KeyRegistrationInnerTxn`](../../namespaces/itxn/interfaces/KeyRegistrationInnerTxn.md)
- [`KeyRegistrationTxn`](../../namespaces/gtxn/interfaces/KeyRegistrationTxn.md)

## Properties

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

### nonparticipation

> `readonly` **nonparticipation**: `boolean`

Defined in: [packages/algo-ts/src/transactions.ts:147](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L147)

Marks an account nonparticipating for rewards

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

### selectionKey

> `readonly` **selectionKey**: [`bytes`](../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:127](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L127)

32 byte address

***

### sender

> `readonly` **sender**: [`Account`](../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/transactions.ts:39](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L39)

32 byte address

#### Inherited from

[`TransactionBase`](TransactionBase.md).[`sender`](TransactionBase.md#sender)

***

### stateProofKey

> `readonly` **stateProofKey**: [`bytes`](../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:152](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L152)

64 byte state proof public key

***

### txnId

> `readonly` **txnId**: [`bytes`](../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:85](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L85)

The computed ID for this transaction. 32 bytes.

#### Inherited from

[`TransactionBase`](TransactionBase.md).[`txnId`](TransactionBase.md#txnid)

***

### type

> `readonly` **type**: [`KeyRegistration`](../../enumerations/TransactionType.md#keyregistration)

Defined in: [packages/algo-ts/src/transactions.ts:156](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L156)

Transaction type as integer

***

### typeBytes

> `readonly` **typeBytes**: [`bytes`](../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:74](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L74)

Transaction type as bytes

#### Inherited from

[`TransactionBase`](TransactionBase.md).[`typeBytes`](TransactionBase.md#typebytes)

***

### voteFirst

> `readonly` **voteFirst**: [`uint64`](../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:132](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L132)

The first round that the participation key is valid.

***

### voteKey

> `readonly` **voteKey**: [`bytes`](../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:122](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L122)

32 byte address

***

### voteKeyDilution

> `readonly` **voteKeyDilution**: [`uint64`](../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:142](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L142)

Dilution for the 2-level participation key

***

### voteLast

> `readonly` **voteLast**: [`uint64`](../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:137](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L137)

The last round that the participation key is valid.
