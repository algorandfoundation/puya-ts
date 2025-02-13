[**@algorandfoundation/algorand-typescript**](../README.md)

***

[@algorandfoundation/algorand-typescript](../README.md) / GlobalState

# Type Alias: GlobalState\<ValueType\>

> **GlobalState**\<`ValueType`\>: `object`

Defined in: [packages/algo-ts/src/state.ts:44](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/state.ts#L44)

A proxy for manipulating a global state field

## Type Parameters

• **ValueType**

The type of the value being stored - must be a serializable type

## Type declaration

### hasValue

> `readonly` **hasValue**: `boolean`

Gets a boolean value indicating if global state field currently has a value

### value

> **value**: `ValueType`

Get or set the value of this global state field

### delete()

Delete the stored value of this global state field

#### Returns

`void`
