---
title: CompatForArc4Int
type: doc
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../../README.md)

***

[Algorand TypeScript](../../../modules.md) / [arc4](../../README.md) / [\<internal\>](../README.md) / CompatForArc4Int

# Type Alias: CompatForArc4Int\<N\>

> **CompatForArc4Int**\<`N`\> = `N` *extends* [`UintBitSize`](UintBitSize.md) ? [`Uint64Compat`](../../../index/type-aliases/Uint64Compat.md) : [`BigUintCompat`](../../../index/type-aliases/BigUintCompat.md)

Defined in: [arc4/encoded-types.ts:77](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L77)

Conditional type which returns the compat type relevant to a given UintN bit size

## Type Parameters

### N

`N` *extends* [`BitSize`](../../type-aliases/BitSize.md)
