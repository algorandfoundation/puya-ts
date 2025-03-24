[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [arc4](../README.md) / AbiMethodConfig

# Type Alias: AbiMethodConfig\<TContract\>

> **AbiMethodConfig**\<`TContract`\>: `object`

Defined in: [packages/algo-ts/src/arc4/index.ts:58](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L58)

Configuration options for an abi method

## Type Parameters

• **TContract** *extends* [`Contract`](../classes/Contract.md)

the type of the contract this method is a part of

## Type declaration

### allowActions?

> `optional` **allowActions**: [`OnCompleteActionStr`](../../index/type-aliases/OnCompleteActionStr.md) \| [`OnCompleteActionStr`](../../index/type-aliases/OnCompleteActionStr.md)[]

Which on complete action(s) are allowed when invoking this method.

#### Default

```ts
'NoOp'
```

### defaultArguments?

> `optional` **defaultArguments**: [`Record`](../../index/-internal-/type-aliases/Record.md)\<`string`, [`DefaultArgument`](DefaultArgument.md)\<`TContract`\>\>

Specify default arguments that can be populated by clients calling this method.

A map of parameter names to the default argument source

### name?

> `optional` **name**: `string`

Override the name used to generate the abi method selector

### onCreate?

> `optional` **onCreate**: [`CreateOptions`](CreateOptions.md)

Whether this method should be callable when creating the application.

#### Default

```ts
'disallow'
```

### readonly?

> `optional` **readonly**: `boolean`

Does the method only perform read operations (no mutation of chain state)

#### Default

```ts
false
```
