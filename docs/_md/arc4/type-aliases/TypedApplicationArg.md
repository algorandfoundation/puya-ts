---
title: TypedApplicationArg
type: doc
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / TypedApplicationArg

# Type Alias: TypedApplicationArg\<TArg\>

> **TypedApplicationArg**\<`TArg`\> = `TArg` *extends* [`Transaction`](../../gtxn/namespaces/gtxn/type-aliases/Transaction.md) ? [`GtxnToItxnFields`](GtxnToItxnFields.md)\<`TArg`\> : `TArg`

Defined in: [arc4/c2c.ts:41](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/c2c.ts#L41)

Conditional type which given an application argument, returns the input type for that argument.

The input type will usually be the original type apart from group transactions which will be substituted
with their equivalent inner transaction type.

## Type Parameters

### TArg

`TArg`
