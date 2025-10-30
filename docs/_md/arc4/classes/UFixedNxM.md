[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / UFixedNxM

# Class: UFixedNxM\<N, M\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:186](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L186)

A fixed bit size, fixed decimal unsigned value

## Extends

- [`ARC4Encoded`](ARC4Encoded.md)

## Type Parameters

### N

`N` *extends* [`BitSize`](../type-aliases/BitSize.md)

### M

`M` *extends* `number`

## Constructors

### Constructor

> **new UFixedNxM**\<`N`, `M`\>(`v`?): `UFixedNxM`\<`N`, `M`\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:194](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L194)

Create a new UFixedNxM value

#### Parameters

##### v?

`` `${number}.${number}` ``

A string representing the integer and fractional portion of the number

#### Returns

`UFixedNxM`\<`N`, `M`\>

#### Overrides

[`ARC4Encoded`](ARC4Encoded.md).[`constructor`](ARC4Encoded.md#constructor)

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

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:201](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L201)

Retrieve the decoded native uint64 or biguint where the returned integer represents the fixed decimal value * (10 ^ M)

##### Returns

[`NativeForArc4Int`](../-internal-/type-aliases/NativeForArc4Int.md)\<`N`\>
