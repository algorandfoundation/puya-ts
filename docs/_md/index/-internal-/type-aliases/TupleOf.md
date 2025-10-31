---
title: _TupleOf
type: doc
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../../README.md)

***

[Algorand TypeScript](../../../modules.md) / [index](../../README.md) / [\<internal\>](../README.md) / \_TupleOf

# Type Alias: \_TupleOf\<T, N, R\>

> **\_TupleOf**\<`T`, `N`, `R`\> = `R`\[`"length"`\] *extends* `N` ? `R` : `_TupleOf`\<`T`, `N`, readonly \[`T`, `...R`\]\>

Defined in: [primitives.ts:366](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L366)

## Type Parameters

### T

`T`

### N

`N` *extends* `number`

### R

`R` *extends* readonly `unknown`[]
