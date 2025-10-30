[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / ARC4Encoded

# Class: `abstract` ARC4Encoded

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:90](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L90)

A base type for ARC4 encoded values

## Extended by

- [`Str`](Str.md)
- [`UintN`](UintN.md)
- [`UFixedNxM`](UFixedNxM.md)
- [`Bool`](Bool.md)
- [`Tuple`](Tuple.md)
- [`Arc4ArrayBase`](../-internal-/classes/Arc4ArrayBase.md)
- [`StructBase`](../-internal-/classes/StructBase.md)

## Implements

- [`BytesBacked`](../../index/interfaces/BytesBacked.md)

## Constructors

### Constructor

> **new ARC4Encoded**(): `ARC4Encoded`

#### Returns

`ARC4Encoded`

## Accessors

### bytes

#### Get Signature

> **get** **bytes**(): [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:97](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L97)

Retrieve the encoded bytes for this type

##### Returns

[`bytes`](../../index/type-aliases/bytes.md)

#### Implementation of

[`BytesBacked`](../../index/interfaces/BytesBacked.md).[`bytes`](../../index/interfaces/BytesBacked.md#bytes)
