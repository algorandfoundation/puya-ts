[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [arc4](../README.md) / abimethod

# Function: abimethod()

> **abimethod**\<`TContract`\>(`config`?): \<`TArgs`, `TReturn`\>(`target`, `ctx`) => (`this`, ...`args`) => `TReturn`

Defined in: [packages/algo-ts/src/arc4/index.ts:54](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/arc4/index.ts#L54)

## Type Parameters

• **TContract** *extends* [`Contract`](../classes/Contract.md)

## Parameters

### config?

[`AbiMethodConfig`](../type-aliases/AbiMethodConfig.md)\<`TContract`\>

## Returns

`Function`

### Type Parameters

• **TArgs** *extends* `any`[]

• **TReturn**

### Parameters

#### target

(`this`, ...`args`) => `TReturn`

#### ctx

`ClassMethodDecoratorContext`\<`TContract`, (`this`, ...`args`) => `any`\>

### Returns

`Function`

#### Parameters

##### this

`TContract`

##### args

...`TArgs`

#### Returns

`TReturn`
