[**@algorandfoundation/algorand-typescript**](../../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../../README.md) / [index](../../../README.md) / [itxn](../README.md) / KeyRegistrationFields

# Interface: KeyRegistrationFields

Defined in: [packages/algo-ts/src/itxn.ts:626](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L626)

## Properties

### fee?

> `optional` **fee**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:634](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L634)

microalgos

***

### firstValid?

> `optional` **firstValid**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:638](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L638)

round number

***

### firstValidTime?

> `optional` **firstValidTime**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:642](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L642)

UNIX timestamp of block before txn.FirstValid. Fails if negative

***

### lastValid?

> `optional` **lastValid**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:646](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L646)

round number

***

### lease?

> `optional` **lease**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:654](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L654)

32 byte lease value

***

### nonparticipation?

> `optional` **nonparticipation**: `boolean`

Defined in: [packages/algo-ts/src/itxn.ts:682](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L682)

Marks an account nonparticipating for rewards

***

### note?

> `optional` **note**: `string` \| [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:650](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L650)

Any data up to 1024 bytes

***

### rekeyTo?

> `optional` **rekeyTo**: [`bytes`](../../../type-aliases/bytes.md) \| [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:658](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L658)

32 byte Sender's new AuthAddr

***

### selectionKey?

> `optional` **selectionKey**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:666](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L666)

32 byte address

***

### sender?

> `optional` **sender**: [`bytes`](../../../type-aliases/bytes.md) \| [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:630](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L630)

32 byte address

***

### stateProofKey?

> `optional` **stateProofKey**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:686](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L686)

64 byte state proof public key

***

### voteFirst?

> `optional` **voteFirst**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:670](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L670)

The first round that the participation key is valid.

***

### voteKey?

> `optional` **voteKey**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:662](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L662)

32 byte address

***

### voteKeyDilution?

> `optional` **voteKeyDilution**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:678](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L678)

Dilution for the 2-level participation key

***

### voteLast?

> `optional` **voteLast**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:674](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L674)

The last round that the participation key is valid.
