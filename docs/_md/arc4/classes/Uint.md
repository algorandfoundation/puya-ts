---
title: Uint
type: class
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / Uint

# Class: Uint\<N\>

Defined in: [arc4/encoded-types.ts:133](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L133)

A fixed bit size unsigned int

## Extends

- [`ARC4Encoded`](ARC4Encoded.md)

## Extended by

- [`Byte`](Byte.md)
- [`Uint8`](Uint8.md)
- [`Uint16`](Uint16.md)
- [`Uint32`](Uint32.md)
- [`Uint64`](Uint64.md)
- [`Uint128`](Uint128.md)
- [`Uint256`](Uint256.md)

## Type Parameters

### N

`N` *extends* [`BitSize`](../type-aliases/BitSize.md)

## Constructors

### Constructor

> **new Uint**\<`N`\>(`v?`): `Uint`\<`N`\>

Defined in: [arc4/encoded-types.ts:141](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L141)

Create a new UintN instance

#### Parameters

##### v?

[`CompatForArc4Int`](../-internal-/type-aliases/CompatForArc4Int.md)\<`N`\>

The native uint64 or biguint value to initialize this UintN from

#### Returns

`Uint`\<`N`\>

#### Overrides

[`ARC4Encoded`](ARC4Encoded.md).[`constructor`](ARC4Encoded.md#constructor)

## Accessors

### bytes

#### Get Signature

> **get** **bytes**(): [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [arc4/encoded-types.ts:102](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L102)

Retrieve the encoded bytes for this type

##### Returns

[`bytes`](../../index/type-aliases/bytes.md)

#### Inherited from

[`ARC4Encoded`](ARC4Encoded.md).[`bytes`](ARC4Encoded.md#bytes)

## Methods

### asBigUint()

> **asBigUint**(): [`biguint`](../../index/type-aliases/biguint.md)

Defined in: [arc4/encoded-types.ts:155](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L155)

Retrieve the decoded native biguint

#### Returns

[`biguint`](../../index/type-aliases/biguint.md)

***

### asUint64()

> **asUint64**(): [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [arc4/encoded-types.ts:148](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L148)

Retrieve the decoded native uint64

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)
