[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [itxn](../README.md) / KeyRegistrationInnerTxn

# Interface: KeyRegistrationInnerTxn

Defined in: [packages/algo-ts/src/itxn.ts:14](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L14)

## Extends

- `KeyRegistrationTxn`

## Properties

### fee

> `readonly` **fee**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:44](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/transactions.ts#L44)

microalgos

#### Inherited from

`txnTypes.KeyRegistrationTxn.fee`

***

### firstValid

> `readonly` **firstValid**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:49](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/transactions.ts#L49)

round number

#### Inherited from

`txnTypes.KeyRegistrationTxn.firstValid`

***

### firstValidTime

> `readonly` **firstValidTime**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:54](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/transactions.ts#L54)

UNIX timestamp of block before txn.FirstValid. Fails if negative

#### Inherited from

`txnTypes.KeyRegistrationTxn.firstValidTime`

***

### groupIndex

> `readonly` **groupIndex**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:80](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/transactions.ts#L80)

Position of this transaction within an atomic group
A stand-alone transaction is implicitly element 0 in a group of 1

#### Inherited from

`txnTypes.KeyRegistrationTxn.groupIndex`

***

### lastValid

> `readonly` **lastValid**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:59](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/transactions.ts#L59)

round number

#### Inherited from

`txnTypes.KeyRegistrationTxn.lastValid`

***

### lease

> `readonly` **lease**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:69](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/transactions.ts#L69)

32 byte lease value

#### Inherited from

`txnTypes.KeyRegistrationTxn.lease`

***

### nonparticipation

> `readonly` **nonparticipation**: `boolean`

Defined in: [packages/algo-ts/src/transactions.ts:147](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/transactions.ts#L147)

Marks an account nonparticipating for rewards

#### Inherited from

`txnTypes.KeyRegistrationTxn.nonparticipation`

***

### note

> `readonly` **note**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:64](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/transactions.ts#L64)

Any data up to 1024 bytes

#### Inherited from

`txnTypes.KeyRegistrationTxn.note`

***

### rekeyTo

> `readonly` **rekeyTo**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/transactions.ts:90](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/transactions.ts#L90)

32 byte Sender's new AuthAddr

#### Inherited from

`txnTypes.KeyRegistrationTxn.rekeyTo`

***

### selectionKey

> `readonly` **selectionKey**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:127](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/transactions.ts#L127)

32 byte address

#### Inherited from

`txnTypes.KeyRegistrationTxn.selectionKey`

***

### sender

> `readonly` **sender**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/transactions.ts:39](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/transactions.ts#L39)

32 byte address

#### Inherited from

`txnTypes.KeyRegistrationTxn.sender`

***

### stateProofKey

> `readonly` **stateProofKey**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:152](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/transactions.ts#L152)

64 byte state proof public key

#### Inherited from

`txnTypes.KeyRegistrationTxn.stateProofKey`

***

### txnId

> `readonly` **txnId**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:85](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/transactions.ts#L85)

The computed ID for this transaction. 32 bytes.

#### Inherited from

`txnTypes.KeyRegistrationTxn.txnId`

***

### type

> `readonly` **type**: [`KeyRegistration`](../../../enumerations/TransactionType.md#keyregistration)

Defined in: [packages/algo-ts/src/transactions.ts:156](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/transactions.ts#L156)

Transaction type as integer

#### Inherited from

`txnTypes.KeyRegistrationTxn.type`

***

### typeBytes

> `readonly` **typeBytes**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:74](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/transactions.ts#L74)

Transaction type as bytes

#### Inherited from

`txnTypes.KeyRegistrationTxn.typeBytes`

***

### voteFirst

> `readonly` **voteFirst**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:132](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/transactions.ts#L132)

The first round that the participation key is valid.

#### Inherited from

`txnTypes.KeyRegistrationTxn.voteFirst`

***

### voteKey

> `readonly` **voteKey**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:122](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/transactions.ts#L122)

32 byte address

#### Inherited from

`txnTypes.KeyRegistrationTxn.voteKey`

***

### voteKeyDilution

> `readonly` **voteKeyDilution**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:142](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/transactions.ts#L142)

Dilution for the 2-level participation key

#### Inherited from

`txnTypes.KeyRegistrationTxn.voteKeyDilution`

***

### voteLast

> `readonly` **voteLast**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:137](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/transactions.ts#L137)

The last round that the participation key is valid.

#### Inherited from

`txnTypes.KeyRegistrationTxn.voteLast`
