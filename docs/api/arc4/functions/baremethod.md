[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [arc4](../README.md) / baremethod

# Function: baremethod()

> **baremethod**\<`TContract`\>(`config`?): \<`TArgs`, `TReturn`\>(`target`, `ctx`) => (`this`, ...`args`) => `TReturn`

Defined in: [packages/algo-ts/src/arc4/index.ts:122](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L122)

Declares the decorated method as a baremethod that can only be called with no transaction args

## Type Parameters

• **TContract** *extends* [`Contract`](../classes/Contract.md)

the type of the contract this method is a part of

## Parameters

### config?

[`BareMethodConfig`](../type-aliases/BareMethodConfig.md)

The config for this bare method

## Returns

`Function`

### Type Parameters

• **TArgs** *extends* `any`[]

• **TReturn**

### Parameters

#### target

(`this`, ...`args`) => `TReturn`

#### ctx

[`ClassMethodDecoratorContext`](../-internal-/interfaces/ClassMethodDecoratorContext.md)\<`TContract`\>

### Returns

`Function`

#### Parameters

##### this

`TContract`

##### args

...`TArgs`

#### Returns

`TReturn`
