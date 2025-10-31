---
title: ComparisonFor
type: doc
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../../README.md)

***

[Algorand TypeScript](../../../modules.md) / [index](../../README.md) / [\<internal\>](../README.md) / ComparisonFor

# Type Alias: ComparisonFor\<T\>

> **ComparisonFor**\<`T`\> = `T` *extends* [`uint64`](../../type-aliases/uint64.md) \| [`biguint`](../../type-aliases/biguint.md) ? [`NumericComparison`](NumericComparison.md)\<`T`\> : [`NonNumericComparison`](NonNumericComparison.md)\<`T`\>

Defined in: [util.ts:89](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/util.ts#L89)

Returns compatible comparison expressions for a type `T`

## Type Parameters

### T

`T`

The type requiring comparison
