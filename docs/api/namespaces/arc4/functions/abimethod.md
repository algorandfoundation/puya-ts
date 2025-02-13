[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [arc4](../README.md) / abimethod

# Function: abimethod()

> **abimethod**\<`TContract`\>(`config`?): \<`TArgs`, `TReturn`\>(`target`, `ctx`) => (`this`, ...`args`) => `TReturn`

Defined in: [packages/algo-ts/src/arc4/index.ts:56](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/arc4/index.ts#L56)

Declares the decorated method as an abimethod that is called when the first transaction arg matches the method selector

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
