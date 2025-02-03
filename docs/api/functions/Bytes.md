[**@algorandfoundation/algorand-typescript**](../README.md)

***

[@algorandfoundation/algorand-typescript](../README.md) / Bytes

# Function: Bytes()

## Call Signature

> **Bytes**(`value`, ...`replacements`): [`bytes`](../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/primitives.ts:116](https://github.com/algorandfoundation/puya-ts/blob/14c9827d80da81ff08b4923e997ba22be04aa0db/packages/algo-ts/src/primitives.ts#L116)

Create a byte array from a string interpolation template and compatible replacements

### Parameters

#### value

`TemplateStringsArray`

#### replacements

...[`BytesCompat`](../type-aliases/BytesCompat.md)[]

### Returns

[`bytes`](../type-aliases/bytes.md)

## Call Signature

> **Bytes**(`value`): [`bytes`](../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/primitives.ts:120](https://github.com/algorandfoundation/puya-ts/blob/14c9827d80da81ff08b4923e997ba22be04aa0db/packages/algo-ts/src/primitives.ts#L120)

Create a byte array from a utf8 string

### Parameters

#### value

`string`

### Returns

[`bytes`](../type-aliases/bytes.md)

## Call Signature

> **Bytes**(`value`): [`bytes`](../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/primitives.ts:124](https://github.com/algorandfoundation/puya-ts/blob/14c9827d80da81ff08b4923e997ba22be04aa0db/packages/algo-ts/src/primitives.ts#L124)

No op, returns the provided byte array.

### Parameters

#### value

[`bytes`](../type-aliases/bytes.md)

### Returns

[`bytes`](../type-aliases/bytes.md)

## Call Signature

> **Bytes**(`value`): [`bytes`](../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/primitives.ts:128](https://github.com/algorandfoundation/puya-ts/blob/14c9827d80da81ff08b4923e997ba22be04aa0db/packages/algo-ts/src/primitives.ts#L128)

Create a byte array from a biguint value encoded as a variable length big-endian number

### Parameters

#### value

[`biguint`](../type-aliases/biguint.md)

### Returns

[`bytes`](../type-aliases/bytes.md)

## Call Signature

> **Bytes**(`value`): [`bytes`](../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/primitives.ts:132](https://github.com/algorandfoundation/puya-ts/blob/14c9827d80da81ff08b4923e997ba22be04aa0db/packages/algo-ts/src/primitives.ts#L132)

Create a byte array from a uint64 value encoded as a fixed length 64-bit number

### Parameters

#### value

[`uint64`](../type-aliases/uint64.md)

### Returns

[`bytes`](../type-aliases/bytes.md)

## Call Signature

> **Bytes**(`value`): [`bytes`](../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/primitives.ts:136](https://github.com/algorandfoundation/puya-ts/blob/14c9827d80da81ff08b4923e997ba22be04aa0db/packages/algo-ts/src/primitives.ts#L136)

Create a byte array from an Iterable<uint64> where each item is interpreted as a single byte and must be between 0 and 255 inclusively

### Parameters

#### value

`Iterable`\<[`uint64`](../type-aliases/uint64.md)\>

### Returns

[`bytes`](../type-aliases/bytes.md)

## Call Signature

> **Bytes**(): [`bytes`](../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/primitives.ts:140](https://github.com/algorandfoundation/puya-ts/blob/14c9827d80da81ff08b4923e997ba22be04aa0db/packages/algo-ts/src/primitives.ts#L140)

Create an empty byte array

### Returns

[`bytes`](../type-aliases/bytes.md)
