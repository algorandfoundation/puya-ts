---
title: Str
type: class
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / Str

# Class: Str

Defined in: [arc4/encoded-types.ts:110](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L110)

A utf8 encoded string prefixed with its length expressed as a 2 byte uint

## Extends

- [`ARC4Encoded`](ARC4Encoded.md)

## Constructors

### Constructor

> **new Str**(`s?`): `Str`

Defined in: [arc4/encoded-types.ts:118](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L118)

Create a new Str instance

#### Parameters

##### s?

`string`

The native string to initialize this Str from

#### Returns

`Str`

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

> **get** **native**(): `string`

Defined in: [arc4/encoded-types.ts:125](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L125)

Retrieve the decoded native string

##### Returns

`string`
