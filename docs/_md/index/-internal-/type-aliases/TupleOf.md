[**Algorand TypeScript**](../../../README.md)

***

[Algorand TypeScript](../../../modules.md) / [index](../../README.md) / [\<internal\>](../README.md) / \_TupleOf

# Type Alias: \_TupleOf\<T, N, R\>

> **\_TupleOf**\<`T`, `N`, `R`\> = `R`\[`"length"`\] *extends* `N` ? `R` : `_TupleOf`\<`T`, `N`, readonly \[`T`, `...R`\]\>

Defined in: [packages/algo-ts/src/primitives.ts:265](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L265)

## Type Parameters

### T

`T`

### N

`N` *extends* `number`

### R

`R` *extends* readonly `unknown`[]
