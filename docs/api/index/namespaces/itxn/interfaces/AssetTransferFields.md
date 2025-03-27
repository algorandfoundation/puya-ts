[**@algorandfoundation/algorand-typescript**](../../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../../README.md) / [index](../../../README.md) / [itxn](../README.md) / AssetTransferFields

# Interface: AssetTransferFields

Defined in: [packages/algo-ts/src/itxn.ts:770](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L770)

## Properties

### assetAmount?

> `optional` **assetAmount**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:810](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L810)

value in Asset's units

***

### assetCloseTo?

> `optional` **assetCloseTo**: [`bytes`](../../../type-aliases/bytes.md) \| [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:822](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L822)

32 byte address

***

### assetReceiver?

> `optional` **assetReceiver**: [`bytes`](../../../type-aliases/bytes.md) \| [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:818](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L818)

32 byte address

***

### assetSender?

> `optional` **assetSender**: [`bytes`](../../../type-aliases/bytes.md) \| [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:814](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L814)

32 byte address. Source of assets if Sender is the Asset's Clawback address.

***

### fee?

> `optional` **fee**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:778](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L778)

microalgos

***

### firstValid?

> `optional` **firstValid**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:782](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L782)

round number

***

### firstValidTime?

> `optional` **firstValidTime**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:786](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L786)

UNIX timestamp of block before txn.FirstValid. Fails if negative

***

### lastValid?

> `optional` **lastValid**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:790](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L790)

round number

***

### lease?

> `optional` **lease**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:798](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L798)

32 byte lease value

***

### note?

> `optional` **note**: `string` \| [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:794](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L794)

Any data up to 1024 bytes

***

### rekeyTo?

> `optional` **rekeyTo**: [`bytes`](../../../type-aliases/bytes.md) \| [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:802](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L802)

32 byte Sender's new AuthAddr

***

### sender?

> `optional` **sender**: [`bytes`](../../../type-aliases/bytes.md) \| [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:774](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L774)

32 byte address

***

### xferAsset?

> `optional` **xferAsset**: [`uint64`](../../../type-aliases/uint64.md) \| [`Asset`](../../../type-aliases/Asset.md)

Defined in: [packages/algo-ts/src/itxn.ts:806](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L806)

Asset ID
