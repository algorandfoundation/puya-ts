---
title: AbiMethodConfig
type: doc
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / AbiMethodConfig

# Type Alias: AbiMethodConfig\<TContract\>

> **AbiMethodConfig**\<`TContract`\> = `object`

Defined in: [arc4/index.ts:103](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L103)

Configuration options for an abi method

## Type Parameters

### TContract

`TContract` *extends* [`Contract`](../classes/Contract.md)

the type of the contract this method is a part of

## Properties

### allowActions?

> `optional` **allowActions**: [`OnCompleteActionStr`](../../index/type-aliases/OnCompleteActionStr.md) \| [`OnCompleteActionStr`](../../index/type-aliases/OnCompleteActionStr.md)[]

Defined in: [arc4/index.ts:108](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L108)

Which on complete action(s) are allowed when invoking this method.

#### Default

```ts
'NoOp'
```

***

### defaultArguments?

> `optional` **defaultArguments**: `Record`\<`string`, [`DefaultArgument`](DefaultArgument.md)\<`TContract`\>\>

Defined in: [arc4/index.ts:147](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L147)

Specify default arguments that can be populated by clients calling this method.

A map of parameter names to the default argument source

***

### name?

> `optional` **name**: `string`

Defined in: [arc4/index.ts:122](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L122)

Override the name used to generate the abi method selector

***

### onCreate?

> `optional` **onCreate**: [`CreateOptions`](CreateOptions.md)

Defined in: [arc4/index.ts:113](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L113)

Whether this method should be callable when creating the application.

#### Default

```ts
'disallow'
```

***

### readonly?

> `optional` **readonly**: `boolean`

Defined in: [arc4/index.ts:118](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L118)

Does the method only perform read operations (no mutation of chain state)

#### Default

```ts
false
```

***

### resourceEncoding?

> `optional` **resourceEncoding**: [`ResourceEncodingOptions`](ResourceEncodingOptions.md)

Defined in: [arc4/index.ts:131](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L131)

The resource encoding to use for this method. The default is 'value'

index: Application, Asset, and Account arguments are included in the transaction's relevant array. The argument value is the uint8 index of the resource in the that array.
value: Application, Asset and Account arguments are passed by their uint64 id (Application and Asset) or bytes[32] address (Account).

The resource must still be 'available' to this transaction but can take advantage of resource sharing within the transaction group.

***

### validateEncoding?

> `optional` **validateEncoding**: [`ValidateEncodingOptions`](ValidateEncodingOptions.md)

Defined in: [arc4/index.ts:140](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L140)

Controls validation behaviour for this method.

If "args", then ABI arguments are validated automatically to ensure they are encoded correctly.
If "unsafe-disabled", then no automatic validation occurs. Arguments can instead be validated using the validateEncoding(...) function.
The default behaviour of this option can be controlled with the --validate-abi-args CLI flag.
