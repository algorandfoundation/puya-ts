[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [arc4](../README.md) / UintN

# Class: UintN\<N\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:128](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L128)

A fixed bit size unsigned int

## Extends

- [`ARC4Encoded`](ARC4Encoded.md)

## Extended by

- [`Byte`](Byte.md)
- [`UintN8`](UintN8.md)
- [`UintN16`](UintN16.md)
- [`UintN32`](UintN32.md)
- [`UintN64`](UintN64.md)
- [`UintN128`](UintN128.md)
- [`UintN256`](UintN256.md)

## Type Parameters

• **N** *extends* [`BitSize`](../type-aliases/BitSize.md)

## Constructors

### new UintN()

> **new UintN**\<`N`\>(`v`?): [`UintN`](UintN.md)\<`N`\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:136](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L136)

Create a new UintN instance

#### Parameters

##### v?

[`CompatForArc4Int`](../-internal-/type-aliases/CompatForArc4Int.md)\<`N`\>

The native uint64 or biguint value to initialize this UintN from

#### Returns

[`UintN`](UintN.md)\<`N`\>

#### Overrides

[`ARC4Encoded`](ARC4Encoded.md).[`constructor`](ARC4Encoded.md#constructors)

## Accessors

### bytes

#### Get Signature

> **get** **bytes**(): [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:97](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L97)

Retrieve the encoded bytes for this type

##### Returns

[`bytes`](../../index/type-aliases/bytes.md)

#### Inherited from

[`ARC4Encoded`](ARC4Encoded.md).[`bytes`](ARC4Encoded.md#bytes)

***

### native

#### Get Signature

> **get** **native**(): [`NativeForArc4Int`](../-internal-/type-aliases/NativeForArc4Int.md)\<`N`\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:143](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L143)

Retrieve the decoded native uint64 or biguint

##### Returns

[`NativeForArc4Int`](../-internal-/type-aliases/NativeForArc4Int.md)\<`N`\>
