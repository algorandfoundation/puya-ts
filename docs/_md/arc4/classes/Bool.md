---
title: Bool
type: class
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / Bool

# Class: Bool

Defined in: [arc4/encoded-types.ts:214](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L214)

A boolean value

## Extends

- [`ARC4Encoded`](ARC4Encoded.md)

## Constructors

### Constructor

> **new Bool**(`v?`): `Bool`

Defined in: [arc4/encoded-types.ts:222](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L222)

Create a new Bool value

#### Parameters

##### v?

`boolean`

The native boolean to initialize this value from

#### Returns

`Bool`

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

***

### native

#### Get Signature

> **get** **native**(): `boolean`

Defined in: [arc4/encoded-types.ts:229](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L229)

Get the decoded native boolean for this value

##### Returns

`boolean`
