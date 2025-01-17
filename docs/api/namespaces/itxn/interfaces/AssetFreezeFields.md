[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [itxn](../README.md) / AssetFreezeFields

# Interface: AssetFreezeFields

Defined in: [packages/algo-ts/src/itxn.ts:139](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L139)

## Extends

- [`CommonTransactionFields`](CommonTransactionFields.md)

## Properties

### fee?

> `optional` **fee**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:44](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L44)

microalgos

#### Inherited from

[`CommonTransactionFields`](CommonTransactionFields.md).[`fee`](CommonTransactionFields.md#fee)

***

### freezeAccount?

> `optional` **freezeAccount**: `string` \| [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:141](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L141)

***

### freezeAsset

> **freezeAsset**: [`uint64`](../../../type-aliases/uint64.md) \| [`Asset`](../../../type-aliases/Asset.md)

Defined in: [packages/algo-ts/src/itxn.ts:140](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L140)

***

### frozen?

> `optional` **frozen**: `boolean`

Defined in: [packages/algo-ts/src/itxn.ts:142](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L142)

***

### lease?

> `optional` **lease**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:54](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L54)

32 byte lease value

#### Inherited from

[`CommonTransactionFields`](CommonTransactionFields.md).[`lease`](CommonTransactionFields.md#lease)

***

### note?

> `optional` **note**: `string` \| [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:49](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L49)

Any data up to 1024 bytes

#### Inherited from

[`CommonTransactionFields`](CommonTransactionFields.md).[`note`](CommonTransactionFields.md#note)

***

### rekeyTo?

> `optional` **rekeyTo**: `string` \| [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:59](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L59)

32 byte Sender's new AuthAddr

#### Inherited from

[`CommonTransactionFields`](CommonTransactionFields.md).[`rekeyTo`](CommonTransactionFields.md#rekeyto)

***

### sender?

> `optional` **sender**: `string` \| [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:39](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L39)

32 byte address

#### Inherited from

[`CommonTransactionFields`](CommonTransactionFields.md).[`sender`](CommonTransactionFields.md#sender)
