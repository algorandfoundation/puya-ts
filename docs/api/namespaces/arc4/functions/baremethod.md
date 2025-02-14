[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [arc4](../README.md) / baremethod

# Function: baremethod()

> **baremethod**\<`TContract`\>(`config`?): \<`TArgs`, `TReturn`\>(`target`, `ctx`) => (`this`, ...`args`) => `TReturn`

Defined in: [packages/algo-ts/src/arc4/index.ts:82](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L82)

Declares the decorated method as a baremethod that can only be called with no transaction args

## Type Parameters

• **TContract** *extends* [`Contract`](../classes/Contract.md)

## Parameters

### config?

[`BareMethodConfig`](../type-aliases/BareMethodConfig.md)

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
