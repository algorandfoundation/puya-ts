---
title: convertBytes
type: function
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / convertBytes

# Function: convertBytes()

> **convertBytes**\<`T`\>(`bytes`, `options`): `T`

Defined in: [arc4/index.ts:232](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L232)

Interpret the provided bytes as an ARC4 encoded type

## Type Parameters

### T

`T` *extends* [`ARC4Encoded`](../classes/ARC4Encoded.md)

## Parameters

### bytes

[`BytesCompat`](../../index/type-aliases/BytesCompat.md)

An arc4 encoded bytes value

### options

Options for how the bytes should be converted

#### prefix?

`"log"` \| `"none"`

The prefix (if any), present in the bytes value. This prefix will be validated and removed

#### strategy

`"validate"` \| `"unsafe-cast"`

The strategy used for converting bytes.
        `unsafe-cast`: Reinterpret the value as an ARC4 encoded type without validation
        `validate`: Asserts the encoding of the raw bytes matches the expected type

## Returns

`T`
