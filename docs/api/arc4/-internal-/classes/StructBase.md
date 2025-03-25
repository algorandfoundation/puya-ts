[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [arc4](../../README.md) / [\<internal\>](../README.md) / StructBase

# Class: StructBase\<T\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:466](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L466)

The base type for arc4 structs

## Extends

- [`ARC4Encoded`](../../classes/ARC4Encoded.md)

## Type Parameters

• **T**

## Constructors

### new StructBase()

> **new StructBase**\<`T`\>(): [`StructBase`](StructBase.md)\<`T`\>

#### Returns

[`StructBase`](StructBase.md)\<`T`\>

#### Inherited from

[`ARC4Encoded`](../../classes/ARC4Encoded.md).[`constructor`](../../classes/ARC4Encoded.md#constructors)

## Accessors

### bytes

#### Get Signature

> **get** **bytes**(): [`bytes`](../../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:97](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L97)

Retrieve the encoded bytes for this type

##### Returns

[`bytes`](../../../index/type-aliases/bytes.md)

#### Inherited from

[`ARC4Encoded`](../../classes/ARC4Encoded.md).[`bytes`](../../classes/ARC4Encoded.md#bytes)

***

### native

#### Get Signature

> **get** **native**(): `T`

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:470](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L470)

##### Returns

`T`

## Methods

### copy()

> **copy**(): `this`

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:477](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L477)

Returns a deep copy of this struct

#### Returns

`this`
