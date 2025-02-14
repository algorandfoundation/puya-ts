[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [arc4](../README.md) / UFixedNxM

# Class: UFixedNxM\<N, M\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:107](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L107)

## Extends

- [`ARC4Encoded`](ARC4Encoded.md)

## Type Parameters

• **N** *extends* [`BitSize`](../type-aliases/BitSize.md)

• **M** *extends* `number`

## Constructors

### new UFixedNxM()

> **new UFixedNxM**\<`N`, `M`\>(`v`): [`UFixedNxM`](UFixedNxM.md)\<`N`, `M`\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:110](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L110)

#### Parameters

##### v

`` `${number}.${number}` ``

#### Returns

[`UFixedNxM`](UFixedNxM.md)\<`N`, `M`\>

#### Overrides

[`ARC4Encoded`](ARC4Encoded.md).[`constructor`](ARC4Encoded.md#constructors)

## Accessors

### bytes

#### Get Signature

> **get** **bytes**(): [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:72](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L72)

##### Returns

[`bytes`](../../../type-aliases/bytes.md)

#### Inherited from

[`ARC4Encoded`](ARC4Encoded.md).[`bytes`](ARC4Encoded.md#bytes)

***

### native

#### Get Signature

> **get** **native**(): `NativeForArc4Int`\<`N`\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:114](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L114)

##### Returns

`NativeForArc4Int`\<`N`\>
