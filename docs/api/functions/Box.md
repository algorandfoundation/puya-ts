[**@algorandfoundation/algorand-typescript**](../README.md)

***

[@algorandfoundation/algorand-typescript](../README.md) / Box

# Function: Box()

> **Box**\<`TValue`\>(`options`): [`Box`](../type-aliases/Box.md)\<`TValue`\>

Defined in: [packages/algo-ts/src/box.ts:214](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/box.ts#L214)

Creates a Box proxy object offering methods of getting and setting the value stored in a single box.

## Type Parameters

• **TValue**

The type of the data stored in the box. This value will be encoded to bytes when stored and decoded on retrieval.

## Parameters

### options

`CreateBoxOptions`

Options for creating the Box proxy

## Returns

[`Box`](../type-aliases/Box.md)\<`TValue`\>
