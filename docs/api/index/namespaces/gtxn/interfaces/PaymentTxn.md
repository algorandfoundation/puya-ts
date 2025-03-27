[**@algorandfoundation/algorand-typescript**](../../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../../README.md) / [index](../../../README.md) / [gtxn](../README.md) / PaymentTxn

# Interface: PaymentTxn

Defined in: [packages/algo-ts/src/gtxn.ts:593](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L593)

A group transaction of type 'pay'

## Constructors

## Properties

### amount

> `readonly` **amount**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:70](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L70)

microalgos

***

### closeRemainderTo

> `readonly` **closeRemainderTo**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/gtxn.ts:74](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L74)

32 byte address

***

### fee

> `readonly` **fee**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:21](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L21)

microalgos

***

### firstValid

> `readonly` **firstValid**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:25](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L25)

round number

***

### firstValidTime

> `readonly` **firstValidTime**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:29](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L29)

UNIX timestamp of block before txn.FirstValid. Fails if negative

***

### groupIndex

> `readonly` **groupIndex**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:54](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L54)

Position of this transaction within an atomic group
A stand-alone transaction is implicitly element 0 in a group of 1

***

### lastValid

> `readonly` **lastValid**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/gtxn.ts:33](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L33)

round number

***

### lease

> `readonly` **lease**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:41](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L41)

32 byte lease value

***

### note

> `readonly` **note**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:37](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L37)

Any data up to 1024 bytes

***

### receiver

> `readonly` **receiver**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/gtxn.ts:66](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L66)

32 byte address

***

### rekeyTo

> `readonly` **rekeyTo**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/gtxn.ts:62](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L62)

32 byte Sender's new AuthAddr

***

### sender

> `readonly` **sender**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/gtxn.ts:17](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L17)

32 byte address

***

### txnId

> `readonly` **txnId**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:58](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L58)

The computed ID for this transaction. 32 bytes.

***

### type

> `readonly` **type**: [`Payment`](../../../enumerations/TransactionType.md#payment)

Defined in: [packages/algo-ts/src/gtxn.ts:49](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L49)

Transaction type

***

### typeBytes

> `readonly` **typeBytes**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/gtxn.ts:45](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/gtxn.ts#L45)

Transaction type as bytes
