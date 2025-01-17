[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [arc4](../README.md) / UintN

# Class: UintN\<N\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:89](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/arc4/encoded-types.ts#L89)

## Extends

- [`ARC4Encoded`](ARC4Encoded.md)

## Extended by

- [`Byte`](Byte.md)
- [`UintN8`](UintN8.md)
- [`UintN16`](UintN16.md)
- [`UintN32`](UintN32.md)
- [`UintN64`](UintN64.md)
- [`UintN128`](UintN128.md)
- [`UintN256`](UintN256.md)

## Type Parameters

• **N** *extends* [`BitSize`](../type-aliases/BitSize.md)

## Constructors

### new UintN()

> **new UintN**\<`N`\>(`v`?): [`UintN`](UintN.md)\<`N`\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:93](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/arc4/encoded-types.ts#L93)

#### Parameters

##### v?

`CompatForArc4Int`\<`N`\>

#### Returns

[`UintN`](UintN.md)\<`N`\>

#### Overrides

[`ARC4Encoded`](ARC4Encoded.md).[`constructor`](ARC4Encoded.md#constructors)

## Accessors

### bytes

#### Get Signature

> **get** **bytes**(): [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:72](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/arc4/encoded-types.ts#L72)

##### Returns

[`bytes`](../../../type-aliases/bytes.md)

#### Inherited from

[`ARC4Encoded`](ARC4Encoded.md).[`bytes`](ARC4Encoded.md#bytes)

***

### native

#### Get Signature

> **get** **native**(): `NativeForArc4Int`\<`N`\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:96](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/arc4/encoded-types.ts#L96)

##### Returns

`NativeForArc4Int`\<`N`\>
