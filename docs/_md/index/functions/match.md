---
title: match
type: function
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / match

# Function: match()

> **match**\<`T`\>(`subject`, `test`): `boolean`

Defined in: [util.ts:111](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/util.ts#L111)

Applies all tests in `test` against `subject` and returns a boolean indicating if they all pass

## Type Parameters

### T

`T`

The type of the subject

## Parameters

### subject

`T`

An object or tuple to be tested

### test

[`MatchTest`](../-internal-/type-aliases/MatchTest.md)\<`T`\>

An object containing one or more tests to be applied to the subject

## Returns

`boolean`

True if all tests pass, otherwise false
