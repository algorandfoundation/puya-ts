---
title: ToFixedBytesOptions
type: doc
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../../README.md)

***

[Algorand TypeScript](../../../modules.md) / [index](../../README.md) / [\<internal\>](../README.md) / ToFixedBytesOptions

# Type Alias: ToFixedBytesOptions\<TLength\>

> **ToFixedBytesOptions**\<`TLength`\> = `object`

Defined in: [primitives.ts:101](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L101)

## Type Parameters

### TLength

`TLength` *extends* [`uint64`](../../type-aliases/uint64.md) = [`uint64`](../../type-aliases/uint64.md)

## Properties

### length

> **length**: `TLength`

Defined in: [primitives.ts:105](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L105)

The length for the bounded type

***

### strategy?

> `optional` **strategy**: `"assert-length"` \| `"unsafe-cast"`

Defined in: [primitives.ts:114](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L114)

The strategy to use for converting to a fixed length bytes type (default: 'assert-length')

- 'assert-length': Asserts that the byte sequence has the specified length and fails if it differs
- 'unsafe-cast': Reinterprets the byte sequence as a fixed length type without any checks. This will succeed even if the value
             is not of the specified length but will result in undefined behaviour for any code that makes use of this value.
