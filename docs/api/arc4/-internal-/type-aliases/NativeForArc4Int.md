[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [arc4](../../README.md) / [\<internal\>](../README.md) / NativeForArc4Int

# Type Alias: NativeForArc4Int\<N\>

> **NativeForArc4Int**\<`N`\> = `N` *extends* [`UintBitSize`](UintBitSize.md) ? [`uint64`](../../../index/type-aliases/uint64.md) : [`biguint`](../../../index/type-aliases/biguint.md)

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:76](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L76)

Conditional type which returns the native equivalent type for a given UintN bit size

## Type Parameters

### N

`N` *extends* [`BitSize`](../../type-aliases/BitSize.md)
