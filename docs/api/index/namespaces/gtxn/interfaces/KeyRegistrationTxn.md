[**@algorandfoundation/algorand-typescript**](../../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../../README.md) / [index](../../../README.md) / [gtxn](../README.md) / KeyRegistrationTxn

# Interface: KeyRegistrationTxn

Defined in: [packages/algo-ts/src/gtxn.ts:39](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L39)

## Extends

- [`KeyRegistrationTxn`](../../../-internal-/interfaces/KeyRegistrationTxn.md)

## Constructors

## Properties

### fee

> `readonly` **fee**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:44](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L44)

microalgos

#### Inherited from

[`KeyRegistrationTxn`](../../../-internal-/interfaces/KeyRegistrationTxn.md).[`fee`](../../../-internal-/interfaces/KeyRegistrationTxn.md#fee)

***

### firstValid

> `readonly` **firstValid**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:49](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L49)

round number

#### Inherited from

[`KeyRegistrationTxn`](../../../-internal-/interfaces/KeyRegistrationTxn.md).[`firstValid`](../../../-internal-/interfaces/KeyRegistrationTxn.md#firstvalid)

***

### firstValidTime

> `readonly` **firstValidTime**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:54](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L54)

UNIX timestamp of block before txn.FirstValid. Fails if negative

#### Inherited from

[`KeyRegistrationTxn`](../../../-internal-/interfaces/KeyRegistrationTxn.md).[`firstValidTime`](../../../-internal-/interfaces/KeyRegistrationTxn.md#firstvalidtime)

***

### groupIndex

> `readonly` **groupIndex**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:80](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L80)

Position of this transaction within an atomic group
A stand-alone transaction is implicitly element 0 in a group of 1

#### Inherited from

[`KeyRegistrationTxn`](../../../-internal-/interfaces/KeyRegistrationTxn.md).[`groupIndex`](../../../-internal-/interfaces/KeyRegistrationTxn.md#groupindex)

***

### lastValid

> `readonly` **lastValid**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:59](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L59)

round number

#### Inherited from

[`KeyRegistrationTxn`](../../../-internal-/interfaces/KeyRegistrationTxn.md).[`lastValid`](../../../-internal-/interfaces/KeyRegistrationTxn.md#lastvalid)

***

### lease

> `readonly` **lease**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:69](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L69)

32 byte lease value

#### Inherited from

[`KeyRegistrationTxn`](../../../-internal-/interfaces/KeyRegistrationTxn.md).[`lease`](../../../-internal-/interfaces/KeyRegistrationTxn.md#lease)

***

### nonparticipation

> `readonly` **nonparticipation**: `boolean`

Defined in: [packages/algo-ts/src/transactions.ts:147](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L147)

Marks an account nonparticipating for rewards

#### Inherited from

[`KeyRegistrationTxn`](../../../-internal-/interfaces/KeyRegistrationTxn.md).[`nonparticipation`](../../../-internal-/interfaces/KeyRegistrationTxn.md#nonparticipation)

***

### note

> `readonly` **note**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:64](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L64)

Any data up to 1024 bytes

#### Inherited from

[`KeyRegistrationTxn`](../../../-internal-/interfaces/KeyRegistrationTxn.md).[`note`](../../../-internal-/interfaces/KeyRegistrationTxn.md#note)

***

### rekeyTo

> `readonly` **rekeyTo**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/transactions.ts:90](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L90)

32 byte Sender's new AuthAddr

#### Inherited from

[`KeyRegistrationTxn`](../../../-internal-/interfaces/KeyRegistrationTxn.md).[`rekeyTo`](../../../-internal-/interfaces/KeyRegistrationTxn.md#rekeyto)

***

### selectionKey

> `readonly` **selectionKey**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:127](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L127)

32 byte address

#### Inherited from

[`KeyRegistrationTxn`](../../../-internal-/interfaces/KeyRegistrationTxn.md).[`selectionKey`](../../../-internal-/interfaces/KeyRegistrationTxn.md#selectionkey)

***

### sender

> `readonly` **sender**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/transactions.ts:39](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L39)

32 byte address

#### Inherited from

[`KeyRegistrationTxn`](../../../-internal-/interfaces/KeyRegistrationTxn.md).[`sender`](../../../-internal-/interfaces/KeyRegistrationTxn.md#sender)

***

### stateProofKey

> `readonly` **stateProofKey**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:152](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L152)

64 byte state proof public key

#### Inherited from

[`KeyRegistrationTxn`](../../../-internal-/interfaces/KeyRegistrationTxn.md).[`stateProofKey`](../../../-internal-/interfaces/KeyRegistrationTxn.md#stateproofkey)

***

### txnId

> `readonly` **txnId**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:85](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L85)

The computed ID for this transaction. 32 bytes.

#### Inherited from

[`KeyRegistrationTxn`](../../../-internal-/interfaces/KeyRegistrationTxn.md).[`txnId`](../../../-internal-/interfaces/KeyRegistrationTxn.md#txnid)

***

### type

> `readonly` **type**: [`KeyRegistration`](../../../enumerations/TransactionType.md#keyregistration)

Defined in: [packages/algo-ts/src/transactions.ts:156](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L156)

Transaction type as integer

#### Inherited from

[`KeyRegistrationTxn`](../../../-internal-/interfaces/KeyRegistrationTxn.md).[`type`](../../../-internal-/interfaces/KeyRegistrationTxn.md#type)

***

### typeBytes

> `readonly` **typeBytes**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:74](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L74)

Transaction type as bytes

#### Inherited from

[`KeyRegistrationTxn`](../../../-internal-/interfaces/KeyRegistrationTxn.md).[`typeBytes`](../../../-internal-/interfaces/KeyRegistrationTxn.md#typebytes)

***

### voteFirst

> `readonly` **voteFirst**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:132](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L132)

The first round that the participation key is valid.

#### Inherited from

[`KeyRegistrationTxn`](../../../-internal-/interfaces/KeyRegistrationTxn.md).[`voteFirst`](../../../-internal-/interfaces/KeyRegistrationTxn.md#votefirst)

***

### voteKey

> `readonly` **voteKey**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/transactions.ts:122](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L122)

32 byte address

#### Inherited from

[`KeyRegistrationTxn`](../../../-internal-/interfaces/KeyRegistrationTxn.md).[`voteKey`](../../../-internal-/interfaces/KeyRegistrationTxn.md#votekey)

***

### voteKeyDilution

> `readonly` **voteKeyDilution**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:142](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L142)

Dilution for the 2-level participation key

#### Inherited from

[`KeyRegistrationTxn`](../../../-internal-/interfaces/KeyRegistrationTxn.md).[`voteKeyDilution`](../../../-internal-/interfaces/KeyRegistrationTxn.md#votekeydilution)

***

### voteLast

> `readonly` **voteLast**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/transactions.ts:137](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/transactions.ts#L137)

The last round that the participation key is valid.

#### Inherited from

[`KeyRegistrationTxn`](../../../-internal-/interfaces/KeyRegistrationTxn.md).[`voteLast`](../../../-internal-/interfaces/KeyRegistrationTxn.md#votelast)
