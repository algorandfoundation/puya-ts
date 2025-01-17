[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [itxn](../README.md) / ApplicationCallFields

# Interface: ApplicationCallFields

Defined in: [packages/algo-ts/src/itxn.ts:144](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L144)

## Extends

- [`CommonTransactionFields`](CommonTransactionFields.md)

## Properties

### accounts?

> `optional` **accounts**: readonly [`Account`](../../../type-aliases/Account.md)[]

Defined in: [packages/algo-ts/src/itxn.ts:155](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L155)

***

### appArgs?

> `optional` **appArgs**: readonly `unknown`[]

Defined in: [packages/algo-ts/src/itxn.ts:154](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L154)

***

### appId?

> `optional` **appId**: [`uint64`](../../../type-aliases/uint64.md) \| [`Application`](../../../type-aliases/Application.md)

Defined in: [packages/algo-ts/src/itxn.ts:145](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L145)

***

### approvalProgram?

> `optional` **approvalProgram**: [`bytes`](../../../type-aliases/bytes.md) \| readonly [`bytes`](../../../type-aliases/bytes.md)[]

Defined in: [packages/algo-ts/src/itxn.ts:146](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L146)

***

### apps?

> `optional` **apps**: readonly [`Application`](../../../type-aliases/Application.md)[]

Defined in: [packages/algo-ts/src/itxn.ts:157](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L157)

***

### assets?

> `optional` **assets**: readonly [`Asset`](../../../type-aliases/Asset.md)[]

Defined in: [packages/algo-ts/src/itxn.ts:156](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L156)

***

### clearStateProgram?

> `optional` **clearStateProgram**: [`bytes`](../../../type-aliases/bytes.md) \| readonly [`bytes`](../../../type-aliases/bytes.md)[]

Defined in: [packages/algo-ts/src/itxn.ts:147](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L147)

***

### extraProgramPages?

> `optional` **extraProgramPages**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:153](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L153)

***

### fee?

> `optional` **fee**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:44](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L44)

microalgos

#### Inherited from

[`CommonTransactionFields`](CommonTransactionFields.md).[`fee`](CommonTransactionFields.md#fee)

***

### globalNumBytes?

> `optional` **globalNumBytes**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:150](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L150)

***

### globalNumUint?

> `optional` **globalNumUint**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:149](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L149)

***

### lease?

> `optional` **lease**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:54](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L54)

32 byte lease value

#### Inherited from

[`CommonTransactionFields`](CommonTransactionFields.md).[`lease`](CommonTransactionFields.md#lease)

***

### localNumBytes?

> `optional` **localNumBytes**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:152](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L152)

***

### localNumUint?

> `optional` **localNumUint**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:151](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L151)

***

### note?

> `optional` **note**: `string` \| [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:49](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L49)

Any data up to 1024 bytes

#### Inherited from

[`CommonTransactionFields`](CommonTransactionFields.md).[`note`](CommonTransactionFields.md#note)

***

### onCompletion?

> `optional` **onCompletion**: [`uint64`](../../../type-aliases/uint64.md) \| [`OnCompleteAction`](../../arc4/enumerations/OnCompleteAction.md)

Defined in: [packages/algo-ts/src/itxn.ts:148](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/itxn.ts#L148)

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
