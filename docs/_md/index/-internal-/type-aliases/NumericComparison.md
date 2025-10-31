---
title: NumericComparison
type: doc
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../../README.md)

***

[Algorand TypeScript](../../../modules.md) / [index](../../README.md) / [\<internal\>](../README.md) / NumericComparison

# Type Alias: NumericComparison\<T\>

> **NumericComparison**\<`T`\> = `T` \| \{ `lessThan`: `T`; \} \| \{ `greaterThan`: `T`; \} \| \{ `greaterThanEq`: `T`; \} \| \{ `lessThanEq`: `T`; \} \| \{ `between`: readonly \[`T`, `T`\]; \} \| \{ `not`: `T`; \}

Defined in: [util.ts:34](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/util.ts#L34)

Defines possible comparison expressions for numeric types

## Type Parameters

### T

`T`

## Type declaration

`T`

\{ `lessThan`: `T`; \}

### lessThan

> **lessThan**: `T`

Is the subject less than the specified value

\{ `greaterThan`: `T`; \}

### greaterThan

> **greaterThan**: `T`

Is the subject greater than the specified value

\{ `greaterThanEq`: `T`; \}

### greaterThanEq

> **greaterThanEq**: `T`

Is the subject greater than or equal to the specified value

\{ `lessThanEq`: `T`; \}

### lessThanEq

> **lessThanEq**: `T`

Is the subject less than or equal to the specified value

\{ `between`: readonly \[`T`, `T`\]; \}

### between

> **between**: readonly \[`T`, `T`\]

Is the subject between the specified values (inclusive)

\{ `not`: `T`; \}

### not

> **not**: `T`

Is the subject not equal to the specified value
