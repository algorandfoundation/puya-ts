[**@algorandfoundation/algorand-typescript**](../../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../../README.md) / [index](../../../README.md) / [itxn](../README.md) / PaymentInnerTxn

# Interface: PaymentInnerTxn

Defined in: [packages/algo-ts/src/itxn.ts:12](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L12)

An inner transaction of type 'pay'

## Properties

### amount

> `readonly` **amount**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:71](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L71)

microalgos

***

### closeRemainderTo

> `readonly` **closeRemainderTo**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:75](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L75)

32 byte address

***

### fee

> `readonly` **fee**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:22](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L22)

microalgos

***

### firstValid

> `readonly` **firstValid**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:26](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L26)

round number

***

### firstValidTime

> `readonly` **firstValidTime**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:30](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L30)

UNIX timestamp of block before txn.FirstValid. Fails if negative

***

### groupIndex

> `readonly` **groupIndex**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:55](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L55)

Position of this transaction within an atomic group
A stand-alone transaction is implicitly element 0 in a group of 1

***

### lastValid

> `readonly` **lastValid**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:34](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L34)

round number

***

### lease

> `readonly` **lease**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:42](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L42)

32 byte lease value

***

### note

> `readonly` **note**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:38](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L38)

Any data up to 1024 bytes

***

### receiver

> `readonly` **receiver**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:67](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L67)

32 byte address

***

### rekeyTo

> `readonly` **rekeyTo**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:63](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L63)

32 byte Sender's new AuthAddr

***

### sender

> `readonly` **sender**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:18](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L18)

32 byte address

***

### txnId

> `readonly` **txnId**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:59](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L59)

The computed ID for this transaction. 32 bytes.

***

### type

> `readonly` **type**: [`Payment`](../../../enumerations/TransactionType.md#payment)

Defined in: [packages/algo-ts/src/itxn.ts:50](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L50)

Transaction type

***

### typeBytes

> `readonly` **typeBytes**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:46](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L46)

Transaction type as bytes
