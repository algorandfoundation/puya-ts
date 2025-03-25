[**@algorandfoundation/algorand-typescript**](../../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../../README.md) / [index](../../../README.md) / [itxn](../README.md) / AssetFreezeFields

# Interface: AssetFreezeFields

Defined in: [packages/algo-ts/src/itxn.ts:824](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L824)

## Properties

### fee?

> `optional` **fee**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:832](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L832)

microalgos

***

### firstValid?

> `optional` **firstValid**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:836](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L836)

round number

***

### firstValidTime?

> `optional` **firstValidTime**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:840](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L840)

UNIX timestamp of block before txn.FirstValid. Fails if negative

***

### freezeAccount?

> `optional` **freezeAccount**: [`bytes`](../../../type-aliases/bytes.md) \| [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:864](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L864)

32 byte address of the account whose asset slot is being frozen or un-frozen

***

### freezeAsset?

> `optional` **freezeAsset**: [`uint64`](../../../type-aliases/uint64.md) \| [`Asset`](../../../type-aliases/Asset.md)

Defined in: [packages/algo-ts/src/itxn.ts:860](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L860)

Asset ID being frozen or un-frozen

***

### frozen?

> `optional` **frozen**: `boolean`

Defined in: [packages/algo-ts/src/itxn.ts:868](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L868)

The new frozen value

***

### lastValid?

> `optional` **lastValid**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:844](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L844)

round number

***

### lease?

> `optional` **lease**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:852](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L852)

32 byte lease value

***

### note?

> `optional` **note**: `string` \| [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:848](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L848)

Any data up to 1024 bytes

***

### rekeyTo?

> `optional` **rekeyTo**: [`bytes`](../../../type-aliases/bytes.md) \| [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:856](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L856)

32 byte Sender's new AuthAddr

***

### sender?

> `optional` **sender**: [`bytes`](../../../type-aliases/bytes.md) \| [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:828](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L828)

32 byte address
