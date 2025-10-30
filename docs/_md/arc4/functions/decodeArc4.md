[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / decodeArc4

# Function: decodeArc4()

> **decodeArc4**\<`T`\>(`bytes`, `prefix`): `T`

Defined in: [packages/algo-ts/src/arc4/index.ts:192](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L192)

Decode the provided bytes to a native Algorand TypeScript value

## Type Parameters

### T

`T`

## Parameters

### bytes

[`BytesCompat`](../../index/type-aliases/BytesCompat.md)

An arc4 encoded bytes value

### prefix

The prefix (if any), present in the bytes value. This prefix will be validated and removed

`"log"` | `"none"`

## Returns

`T`
