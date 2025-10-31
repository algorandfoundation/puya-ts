---
title: TypedApplicationArgs
type: doc
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / TypedApplicationArgs

# Type Alias: TypedApplicationArgs\<TArgs\>

> **TypedApplicationArgs**\<`TArgs`\> = `TArgs` *extends* `never` ? `unknown`[] : `TArgs` *extends* \[\] ? \[\] : `TArgs` *extends* \[infer TArg, `...(infer TRest)`\] ? readonly \[[`TypedApplicationArg`](TypedApplicationArg.md)\<`TArg`\>, `...TypedApplicationArgs<TRest>`\] : `never`

Defined in: [arc4/c2c.ts:46](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/c2c.ts#L46)

Conditional type which maps a tuple of application arguments to a tuple of input types for specifying those arguments.

## Type Parameters

### TArgs

`TArgs`
