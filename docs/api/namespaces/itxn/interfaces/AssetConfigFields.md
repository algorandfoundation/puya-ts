[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [itxn](../README.md) / AssetConfigFields

# Interface: AssetConfigFields

Defined in: [packages/algo-ts/src/itxn.ts:125](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L125)

## Extends

- [`CommonTransactionFields`](CommonTransactionFields.md)

## Properties

### assetName?

> `optional` **assetName**: `string` \| [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:131](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L131)

***

### clawback?

> `optional` **clawback**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:130](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L130)

***

### configAsset?

> `optional` **configAsset**: [`Asset`](../../../type-aliases/Asset.md)

Defined in: [packages/algo-ts/src/itxn.ts:126](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L126)

***

### decimals?

> `optional` **decimals**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:134](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L134)

***

### defaultFrozen?

> `optional` **defaultFrozen**: `boolean`

Defined in: [packages/algo-ts/src/itxn.ts:135](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L135)

***

### fee?

> `optional` **fee**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:44](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L44)

microalgos

#### Inherited from

[`CommonTransactionFields`](CommonTransactionFields.md).[`fee`](CommonTransactionFields.md#fee)

***

### freeze?

> `optional` **freeze**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:129](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L129)

***

### lease?

> `optional` **lease**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:54](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L54)

32 byte lease value

#### Inherited from

[`CommonTransactionFields`](CommonTransactionFields.md).[`lease`](CommonTransactionFields.md#lease)

***

### manager?

> `optional` **manager**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:127](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L127)

***

### metadataHash?

> `optional` **metadataHash**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:137](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L137)

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

### reserve?

> `optional` **reserve**: [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:128](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L128)

***

### sender?

> `optional` **sender**: `string` \| [`Account`](../../../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/itxn.ts:39](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L39)

32 byte address

#### Inherited from

[`CommonTransactionFields`](CommonTransactionFields.md).[`sender`](CommonTransactionFields.md#sender)

***

### total?

> `optional` **total**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:133](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L133)

***

### unitName?

> `optional` **unitName**: `string` \| [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:132](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L132)

***

### url?

> `optional` **url**: `string` \| [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:136](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L136)
