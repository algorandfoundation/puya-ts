[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / UintN256

# Class: UintN256

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:181](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L181)

An alias for UintN<256>

## Extends

- [`UintN`](UintN.md)\<`256`\>

## Constructors

### Constructor

> **new UintN256**(`v`?): `UintN256`

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:136](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L136)

Create a new UintN instance

#### Parameters

##### v?

[`BigUintCompat`](../../index/type-aliases/BigUintCompat.md)

The native uint64 or biguint value to initialize this UintN from

#### Returns

`UintN256`

#### Inherited from

[`UintN`](UintN.md).[`constructor`](UintN.md#constructor)

## Accessors

### bytes

#### Get Signature

> **get** **bytes**(): [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:97](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L97)

Retrieve the encoded bytes for this type

##### Returns

[`bytes`](../../index/type-aliases/bytes.md)

#### Inherited from

[`UintN`](UintN.md).[`bytes`](UintN.md#bytes)

***

### native

#### Get Signature

> **get** **native**(): [`NativeForArc4Int`](../-internal-/type-aliases/NativeForArc4Int.md)\<`N`\>

Defined in: [packages/algo-ts/src/arc4/encoded-types.ts:143](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/encoded-types.ts#L143)

Retrieve the decoded native uint64 or biguint

##### Returns

[`NativeForArc4Int`](../-internal-/type-aliases/NativeForArc4Int.md)\<`N`\>

#### Inherited from

[`UintN`](UintN.md).[`native`](UintN.md#native)
