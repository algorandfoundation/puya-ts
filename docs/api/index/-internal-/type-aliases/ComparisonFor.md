[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [index](../../README.md) / [\<internal\>](../README.md) / ComparisonFor

# Type Alias: ComparisonFor\<T\>

> **ComparisonFor**\<`T`\> = `T` *extends* [`uint64`](../../type-aliases/uint64.md) \| [`biguint`](../../type-aliases/biguint.md) ? [`NumericComparison`](NumericComparison.md)\<`T`\> : `T`

Defined in: [packages/algo-ts/src/util.ts:71](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/util.ts#L71)

Returns compatible comparison expressions for a type `T`

## Type Parameters

### T

`T`

The type requiring comparison
