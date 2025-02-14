[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [itxn](../README.md) / ApplicationCallFields

# Interface: ApplicationCallFields

Defined in: [packages/algo-ts/src/itxn.ts:157](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L157)

## Extends

- [`CommonTransactionFields`](CommonTransactionFields.md)

## Properties

### accounts?

> `optional` **accounts**: readonly `AccountInput`[]

Defined in: [packages/algo-ts/src/itxn.ts:168](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L168)

***

### appArgs?

> `optional` **appArgs**: readonly `unknown`[]

Defined in: [packages/algo-ts/src/itxn.ts:167](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L167)

***

### appId?

> `optional` **appId**: `ApplicationInput`

Defined in: [packages/algo-ts/src/itxn.ts:158](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L158)

***

### approvalProgram?

> `optional` **approvalProgram**: [`bytes`](../../../type-aliases/bytes.md) \| readonly [`bytes`](../../../type-aliases/bytes.md)[]

Defined in: [packages/algo-ts/src/itxn.ts:159](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L159)

***

### apps?

> `optional` **apps**: readonly `ApplicationInput`[]

Defined in: [packages/algo-ts/src/itxn.ts:170](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L170)

***

### assets?

> `optional` **assets**: readonly `AssetInput`[]

Defined in: [packages/algo-ts/src/itxn.ts:169](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L169)

***

### clearStateProgram?

> `optional` **clearStateProgram**: [`bytes`](../../../type-aliases/bytes.md) \| readonly [`bytes`](../../../type-aliases/bytes.md)[]

Defined in: [packages/algo-ts/src/itxn.ts:160](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L160)

***

### extraProgramPages?

> `optional` **extraProgramPages**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:166](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L166)

***

### fee?

> `optional` **fee**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:47](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L47)

microalgos

#### Inherited from

[`CommonTransactionFields`](CommonTransactionFields.md).[`fee`](CommonTransactionFields.md#fee)

***

### firstValid?

> `optional` **firstValid**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:52](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L52)

round number

#### Inherited from

[`CommonTransactionFields`](CommonTransactionFields.md).[`firstValid`](CommonTransactionFields.md#firstvalid)

***

### firstValidTime?

> `optional` **firstValidTime**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:57](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L57)

UNIX timestamp of block before txn.FirstValid. Fails if negative

#### Inherited from

[`CommonTransactionFields`](CommonTransactionFields.md).[`firstValidTime`](CommonTransactionFields.md#firstvalidtime)

***

### globalNumBytes?

> `optional` **globalNumBytes**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:163](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L163)

***

### globalNumUint?

> `optional` **globalNumUint**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:162](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L162)

***

### lease?

> `optional` **lease**: [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:67](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L67)

32 byte lease value

#### Inherited from

[`CommonTransactionFields`](CommonTransactionFields.md).[`lease`](CommonTransactionFields.md#lease)

***

### localNumBytes?

> `optional` **localNumBytes**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:165](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L165)

***

### localNumUint?

> `optional` **localNumUint**: [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/itxn.ts:164](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L164)

***

### note?

> `optional` **note**: `string` \| [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/itxn.ts:62](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L62)

Any data up to 1024 bytes

#### Inherited from

[`CommonTransactionFields`](CommonTransactionFields.md).[`note`](CommonTransactionFields.md#note)

***

### onCompletion?

> `optional` **onCompletion**: [`uint64`](../../../type-aliases/uint64.md) \| [`OnCompleteAction`](../../arc4/enumerations/OnCompleteAction.md)

Defined in: [packages/algo-ts/src/itxn.ts:161](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L161)

***

### rekeyTo?

> `optional` **rekeyTo**: `AccountInput`

Defined in: [packages/algo-ts/src/itxn.ts:72](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L72)

32 byte Sender's new AuthAddr

#### Inherited from

[`CommonTransactionFields`](CommonTransactionFields.md).[`rekeyTo`](CommonTransactionFields.md#rekeyto)

***

### sender?

> `optional` **sender**: `AccountInput`

Defined in: [packages/algo-ts/src/itxn.ts:42](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L42)

32 byte address

#### Inherited from

[`CommonTransactionFields`](CommonTransactionFields.md).[`sender`](CommonTransactionFields.md#sender)
