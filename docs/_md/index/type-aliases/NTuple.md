[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / NTuple

# Type Alias: NTuple\<T, N\>

> **NTuple**\<`T`, `N`\> = `N` *extends* `N` ? `number` *extends* `N` ? `T`[] : [`_TupleOf`](../-internal-/type-aliases/TupleOf.md)\<`T`, `N`, readonly \[\]\> : `never`

Defined in: [packages/algo-ts/src/primitives.ts:263](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L263)

Declare a homogeneous tuple with the item type T and length N.

Eg.
NTuple<uint64, 3> === [uint64, uint64, uint64]

## Type Parameters

### T

`T`

### N

`N` *extends* `number`
