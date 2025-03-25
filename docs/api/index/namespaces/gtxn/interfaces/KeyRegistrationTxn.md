[**@algorandfoundation/algorand-typescript**](../../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../../README.md) / [index](../../../README.md) / [gtxn](../README.md) / KeyRegistrationTxn

# Interface: KeyRegistrationTxn

Defined in: [packages/algo-ts/src/gtxn.ts:600](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L600)

A group transaction of type 'keyreg'

## Constructors

## Properties

### fee

> `readonly` **fee**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:89](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L89)

microalgos

***

### firstValid

> `readonly` **firstValid**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:93](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L93)

round number

***

### firstValidTime

> `readonly` **firstValidTime**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:97](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L97)

UNIX timestamp of block before txn.FirstValid. Fails if negative

***

### groupIndex

> `readonly` **groupIndex**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:122](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L122)

Position of this transaction within an atomic group
A stand-alone transaction is implicitly element 0 in a group of 1

***

### lastValid

> `readonly` **lastValid**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:101](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L101)

round number

***

### lease

> `readonly` **lease**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:109](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L109)

32 byte lease value

***

### nonparticipation

> `readonly` **nonparticipation**: `boolean`

Defined in: [packages/algo-ts/src/gtxn.ts:154](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L154)

Marks an account nonparticipating for rewards

***

### note

> `readonly` **note**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:105](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L105)

Any data up to 1024 bytes

***

### rekeyTo

> `readonly` **rekeyTo**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/gtxn.ts:130](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L130)

32 byte Sender's new AuthAddr

***

### selectionKey

> `readonly` **selectionKey**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:138](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L138)

32 byte address

***

### sender

> `readonly` **sender**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/gtxn.ts:85](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L85)

32 byte address

***

### stateProofKey

> `readonly` **stateProofKey**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:158](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L158)

64 byte state proof public key

***

### txnId

> `readonly` **txnId**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:126](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L126)

The computed ID for this transaction. 32 bytes.

***

### type

> `readonly` **type**: [`KeyRegistration`](../../../enumerations/TransactionType.md#keyregistration)

Defined in: [packages/algo-ts/src/gtxn.ts:117](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L117)

Transaction type

***

### typeBytes

> `readonly` **typeBytes**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:113](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L113)

Transaction type as bytes

***

### voteFirst

> `readonly` **voteFirst**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:142](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L142)

The first round that the participation key is valid.

***

### voteKey

> `readonly` **voteKey**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:134](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L134)

32 byte address

***

### voteKeyDilution

> `readonly` **voteKeyDilution**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:150](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L150)

Dilution for the 2-level participation key

***

### voteLast

> `readonly` **voteLast**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:146](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L146)

The last round that the participation key is valid.
