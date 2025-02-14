[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [arc4](../README.md) / AbiMethodConfig

# Type Alias: AbiMethodConfig\<TContract\>

> **AbiMethodConfig**\<`TContract`\>: `object`

Defined in: [packages/algo-ts/src/arc4/index.ts:28](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L28)

## Type Parameters

• **TContract** *extends* [`Contract`](../classes/Contract.md)

## Type declaration

### allowActions?

> `optional` **allowActions**: [`OnCompleteActionStr`](OnCompleteActionStr.md) \| [`OnCompleteActionStr`](OnCompleteActionStr.md)[]

Which on complete action(s) are allowed when invoking this method.

#### Default

```ts
'NoOp'
```

### defaultArguments?

> `optional` **defaultArguments**: `Record`\<`string`, [`DefaultArgument`](DefaultArgument.md)\<`TContract`\>\>

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
