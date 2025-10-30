[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / Tuple

# Class: Tuple\<TTuple\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:414](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L414)

An arc4 encoded tuple of values

## Extends

- [`ARC4Encoded`](ARC4Encoded.md)

## Type Parameters

### TTuple

`TTuple` *extends* \[[`ARC4Encoded`](ARC4Encoded.md), `...ARC4Encoded[]`\]

A type representing the native tuple of item types

## Constructors

### Constructor

> **new Tuple**\<`TTuple`\>(): `Tuple`\<`TTuple`\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:421](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L421)

Create a new Tuple with the default zero values for items

#### Returns

`Tuple`\<`TTuple`\>

#### Overrides

[`ARC4Encoded`](ARC4Encoded.md).[`constructor`](ARC4Encoded.md#constructor)

### Constructor

> **new Tuple**\<`TTuple`\>(...`items`): `Tuple`\<`TTuple`\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:426](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L426)

Create a new Tuple with the specified items

#### Parameters

##### items

...`TTuple`

The tuple items

#### Returns

`Tuple`\<`TTuple`\>

#### Overrides

`ARC4Encoded.constructor`

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

### length

#### Get Signature

> **get** **length**(): `TTuple`\[`"length"`\] & `object` & `number`

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:442](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L442)

Returns the length of this tuple

##### Returns

`TTuple`\[`"length"`\] & `object` & `number`

***

### native

#### Get Signature

> **get** **native**(): `TTuple`

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:449](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L449)

Returns the decoded native tuple (with arc4 encoded items)

##### Returns

`TTuple`

## Methods

### at()

> **at**\<`TIndex`\>(`index`): `TTuple`\[`TIndex`\]

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:435](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L435)

Returns the item at the specified index

#### Type Parameters

##### TIndex

`TIndex` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### index

`TIndex`

The index of the item to get. Must be a positive literal representing a tuple index

#### Returns

`TTuple`\[`TIndex`\]
