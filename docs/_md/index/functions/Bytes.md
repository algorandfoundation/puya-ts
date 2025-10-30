[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / Bytes

# Function: Bytes()

## Call Signature

> **Bytes**(`value`, ...`replacements`): [`bytes`](../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/primitives.ts:192](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L192)

Create a byte array from a string interpolation template and compatible replacements

### Parameters

#### value

[`TemplateStringsArray`](../-internal-/interfaces/TemplateStringsArray.md)

#### replacements

...[`BytesCompat`](../type-aliases/BytesCompat.md)[]

### Returns

[`bytes`](../type-aliases/bytes.md)

## Call Signature

> **Bytes**(`value`): [`bytes`](../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/primitives.ts:196](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L196)

Create a byte array from a utf8 string

### Parameters

#### value

`string`

### Returns

[`bytes`](../type-aliases/bytes.md)

## Call Signature

> **Bytes**(`value`): [`bytes`](../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/primitives.ts:200](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L200)

No op, returns the provided byte array.

### Parameters

#### value

[`bytes`](../type-aliases/bytes.md)

### Returns

[`bytes`](../type-aliases/bytes.md)

## Call Signature

> **Bytes**(`value`): [`bytes`](../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/primitives.ts:204](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L204)

Create a byte array from a biguint value encoded as a variable length big-endian number

### Parameters

#### value

[`biguint`](../type-aliases/biguint.md)

### Returns

[`bytes`](../type-aliases/bytes.md)

## Call Signature

> **Bytes**(`value`): [`bytes`](../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/primitives.ts:208](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L208)

Create a byte array from a uint64 value encoded as a fixed length 64-bit number

### Parameters

#### value

[`uint64`](../type-aliases/uint64.md)

### Returns

[`bytes`](../type-aliases/bytes.md)

## Call Signature

> **Bytes**(`value`): [`bytes`](../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/primitives.ts:212](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L212)

Create a byte array from an Iterable<uint64> where each item is interpreted as a single byte and must be between 0 and 255 inclusively

### Parameters

#### value

[`Iterable`](../-internal-/interfaces/Iterable.md)\<[`uint64`](../type-aliases/uint64.md)\>

### Returns

[`bytes`](../type-aliases/bytes.md)

## Call Signature

> **Bytes**(): [`bytes`](../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/primitives.ts:216](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/primitives.ts#L216)

Create an empty byte array

### Returns

[`bytes`](../type-aliases/bytes.md)
