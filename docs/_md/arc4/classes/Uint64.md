---
title: Uint64
type: class
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / Uint64

# Class: Uint64

Defined in: [arc4/encoded-types.ts:183](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L183)

An alias for Uint<64>

## Extends

- [`Uint`](Uint.md)\<`64`\>

## Constructors

### Constructor

> **new Uint64**(`v?`): `Uint64`

Defined in: [arc4/encoded-types.ts:141](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L141)

Create a new UintN instance

#### Parameters

##### v?

[`Uint64Compat`](../../index/type-aliases/Uint64Compat.md)

The native uint64 or biguint value to initialize this UintN from

#### Returns

`Uint64`

#### Inherited from

[`Uint`](Uint.md).[`constructor`](Uint.md#constructor)

## Accessors

### bytes

#### Get Signature

> **get** **bytes**(): [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [arc4/encoded-types.ts:102](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L102)

Retrieve the encoded bytes for this type

##### Returns

[`bytes`](../../index/type-aliases/bytes.md)

#### Inherited from

[`Uint`](Uint.md).[`bytes`](Uint.md#bytes)

## Methods

### asBigUint()

> **asBigUint**(): [`biguint`](../../index/type-aliases/biguint.md)

Defined in: [arc4/encoded-types.ts:155](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L155)

Retrieve the decoded native biguint

#### Returns

[`biguint`](../../index/type-aliases/biguint.md)

#### Inherited from

[`Uint`](Uint.md).[`asBigUint`](Uint.md#asbiguint)

***

### asUint64()

> **asUint64**(): [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [arc4/encoded-types.ts:148](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L148)

Retrieve the decoded native uint64

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

#### Inherited from

[`Uint`](Uint.md).[`asUint64`](Uint.md#asuint64)
