[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [arc4](../../README.md) / [\<internal\>](../README.md) / CompatForArc4Int

# Type Alias: CompatForArc4Int\<N\>

> **CompatForArc4Int**\<`N`\>: `N` *extends* [`UintBitSize`](UintBitSize.md) ? [`Uint64Compat`](../../../index/type-aliases/Uint64Compat.md) : [`BigUintCompat`](../../../index/type-aliases/BigUintCompat.md)

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:80](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L80)

Conditional type which returns the compat type relevant to a given UintN bit size

## Type Parameters

• **N** *extends* [`BitSize`](../../type-aliases/BitSize.md)
