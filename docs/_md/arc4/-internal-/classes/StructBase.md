---
title: StructBase
type: class
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../../README.md)

***

[Algorand TypeScript](../../../modules.md) / [arc4](../../README.md) / [\<internal\>](../README.md) / StructBase

# Class: StructBase\<T\>

Defined in: [arc4/encoded-types.ts:474](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L474)

The base type for arc4 structs

## Extends

- [`ARC4Encoded`](../../classes/ARC4Encoded.md)

## Type Parameters

### T

`T`

## Constructors

### Constructor

> **new StructBase**\<`T`\>(): `StructBase`\<`T`\>

#### Returns

`StructBase`\<`T`\>

#### Inherited from

[`ARC4Encoded`](../../classes/ARC4Encoded.md).[`constructor`](../../classes/ARC4Encoded.md#constructor)

## Accessors

### bytes

#### Get Signature

> **get** **bytes**(): [`bytes`](../../../index/type-aliases/bytes.md)

Defined in: [arc4/encoded-types.ts:102](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L102)

Retrieve the encoded bytes for this type

##### Returns

[`bytes`](../../../index/type-aliases/bytes.md)

#### Inherited from

[`ARC4Encoded`](../../classes/ARC4Encoded.md).[`bytes`](../../classes/ARC4Encoded.md#bytes)

***

### native

#### Get Signature

> **get** **native**(): `T`

Defined in: [arc4/encoded-types.ts:478](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L478)

##### Returns

`T`
