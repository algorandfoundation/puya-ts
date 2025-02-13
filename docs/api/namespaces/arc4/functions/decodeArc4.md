[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [arc4](../README.md) / decodeArc4

# Function: decodeArc4()

> **decodeArc4**\<`T`\>(`bytes`, `prefix`): `T`

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:342](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/arc4/encoded-types.ts#L342)

Decode the provided bytes to a native Algorand TypeScript value

## Type Parameters

• **T**

## Parameters

### bytes

[`BytesCompat`](../../../type-aliases/BytesCompat.md)

An arc4 encoded bytes value

### prefix

The prefix (if any), present in the bytes value. This prefix will be validated and removed

`"log"` | `"none"`

## Returns

`T`
