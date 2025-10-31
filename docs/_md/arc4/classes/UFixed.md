---
title: UFixed
type: class
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / UFixed

# Class: UFixed\<N, M\>

Defined in: [arc4/encoded-types.ts:198](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L198)

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

> **new UFixed**\<`N`, `M`\>(`v?`): `UFixed`\<`N`, `M`\>

Defined in: [arc4/encoded-types.ts:206](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L206)

Create a new UFixed value

#### Parameters

##### v?

`` `${number}.${number}` ``

A string representing the integer and fractional portion of the number

#### Returns

`UFixed`\<`N`, `M`\>

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
