[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [arc4](../README.md) / Tuple

# Class: Tuple\<TTuple\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:247](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/arc4/encoded-types.ts#L247)

## Extends

- [`ARC4Encoded`](ARC4Encoded.md)

## Type Parameters

• **TTuple** *extends* \[[`ARC4Encoded`](ARC4Encoded.md), `...ARC4Encoded[]`\]

## Constructors

### new Tuple()

> **new Tuple**\<`TTuple`\>(...`items`): [`Tuple`](Tuple.md)\<`TTuple`\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:250](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/arc4/encoded-types.ts#L250)

#### Parameters

##### items

...`TTuple`

#### Returns

[`Tuple`](Tuple.md)\<`TTuple`\>

#### Overrides

[`ARC4Encoded`](ARC4Encoded.md).[`constructor`](ARC4Encoded.md#constructors)

## Accessors

### bytes

#### Get Signature

> **get** **bytes**(): [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:72](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/arc4/encoded-types.ts#L72)

##### Returns

[`bytes`](../../../type-aliases/bytes.md)

#### Inherited from

[`ARC4Encoded`](ARC4Encoded.md).[`bytes`](ARC4Encoded.md#bytes)

***

### length

#### Get Signature

> **get** **length**(): `TTuple`\[`"length"`\] & `object` & `number`

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:258](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/arc4/encoded-types.ts#L258)

##### Returns

`TTuple`\[`"length"`\] & `object` & `number`

***

### native

#### Get Signature

> **get** **native**(): `TTuple`

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:262](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/arc4/encoded-types.ts#L262)

##### Returns

`TTuple`

## Methods

### at()

> **at**\<`TIndex`\>(`index`): `TTuple`\[`TIndex`\]

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:254](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/arc4/encoded-types.ts#L254)

#### Type Parameters

• **TIndex** *extends* `string` \| `number` \| `symbol`

#### Parameters

##### index

`TIndex`

#### Returns

`TTuple`\[`TIndex`\]
