[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / AbiMethodConfig

# Type Alias: AbiMethodConfig\<TContract\>

> **AbiMethodConfig**\<`TContract`\> = `object`

Defined in: [packages/algo-ts/src/arc4/index.ts:88](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L88)

Configuration options for an abi method

## Type Parameters

### TContract

`TContract` *extends* [`Contract`](../classes/Contract.md)

the type of the contract this method is a part of

## Properties

### allowActions?

> `optional` **allowActions**: [`OnCompleteActionStr`](../../index/type-aliases/OnCompleteActionStr.md) \| [`OnCompleteActionStr`](../../index/type-aliases/OnCompleteActionStr.md)[]

Defined in: [packages/algo-ts/src/arc4/index.ts:93](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L93)

Which on complete action(s) are allowed when invoking this method.

#### Default

```ts
'NoOp'
```

***

### defaultArguments?

> `optional` **defaultArguments**: [`Record`](../../index/-internal-/type-aliases/Record.md)\<`string`, [`DefaultArgument`](DefaultArgument.md)\<`TContract`\>\>

Defined in: [packages/algo-ts/src/arc4/index.ts:114](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L114)

Specify default arguments that can be populated by clients calling this method.

A map of parameter names to the default argument source

***

### name?

> `optional` **name**: `string`

Defined in: [packages/algo-ts/src/arc4/index.ts:107](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L107)

Override the name used to generate the abi method selector

***

### onCreate?

> `optional` **onCreate**: [`CreateOptions`](CreateOptions.md)

Defined in: [packages/algo-ts/src/arc4/index.ts:98](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L98)

Whether this method should be callable when creating the application.

#### Default

```ts
'disallow'
```

***

### readonly?

> `optional` **readonly**: `boolean`

Defined in: [packages/algo-ts/src/arc4/index.ts:103](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L103)

Does the method only perform read operations (no mutation of chain state)

#### Default

```ts
false
```
