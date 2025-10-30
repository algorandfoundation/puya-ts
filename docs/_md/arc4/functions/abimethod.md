[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / abimethod

# Function: abimethod()

> **abimethod**\<`TContract`\>(`config`?): \<`TArgs`, `TReturn`\>(`target`, `ctx`) => (`this`, ...`args`) => `TReturn`

Defined in: [packages/algo-ts/src/arc4/index.ts:122](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L122)

Declares the decorated method as an abimethod that is called when the first transaction arg matches the method selector

## Type Parameters

### TContract

`TContract` *extends* [`Contract`](../classes/Contract.md)

the type of the contract this method is a part of

## Parameters

### config?

[`AbiMethodConfig`](../type-aliases/AbiMethodConfig.md)\<`TContract`\>

The config for this abi method

## Returns

`Function`

### Type Parameters

#### TArgs

`TArgs` *extends* `any`[]

#### TReturn

`TReturn`

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
