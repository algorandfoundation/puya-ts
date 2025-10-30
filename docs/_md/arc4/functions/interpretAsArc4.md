[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / interpretAsArc4

# Function: interpretAsArc4()

> **interpretAsArc4**\<`T`\>(`bytes`, `prefix`): `T`

Defined in: [packages/algo-ts/src/arc4/index.ts:183](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L183)

Interpret the provided bytes as an ARC4 encoded type with no validation

## Type Parameters

### T

`T` *extends* [`ARC4Encoded`](../classes/ARC4Encoded.md)

## Parameters

### bytes

[`BytesCompat`](../../index/type-aliases/BytesCompat.md)

An arc4 encoded bytes value

### prefix

The prefix (if any), present in the bytes value. This prefix will be validated and removed

`"log"` | `"none"`

## Returns

`T`
