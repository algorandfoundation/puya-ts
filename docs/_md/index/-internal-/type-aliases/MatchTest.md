---
title: MatchTest
type: doc
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../../README.md)

***

[Algorand TypeScript](../../../modules.md) / [index](../../README.md) / [\<internal\>](../README.md) / MatchTest

# Type Alias: MatchTest\<T\>

> **MatchTest**\<`T`\> = `T` *extends* `ConcatArray`\<infer TItem\> ? `object` & `object` : `{ [key in keyof T]?: ComparisonFor<T[key]> }`

Defined in: [util.ts:95](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/util.ts#L95)

A set of tests to apply to the match subject

## Type Parameters

### T

`T`

The type of the test subject
