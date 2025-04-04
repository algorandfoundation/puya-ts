[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [op](../README.md) / Scratch

# Variable: Scratch

> `const` **Scratch**: `object`

Defined in: [packages/algo-ts/src/op.ts:3293](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L3293)

Load or store scratch values

## Type declaration

### loadBytes()

Ath scratch space value.  All scratch spaces are 0 at program start.

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`bytes`](../../index/type-aliases/bytes.md)

#### See

Native TEAL opcode: [`loads`](https://dev.algorand.co/reference/algorand-teal/opcodes#loads)
Min AVM version: 5

### loadUint64()

Ath scratch space value.  All scratch spaces are 0 at program start.

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

#### Returns

[`uint64`](../../index/type-aliases/uint64.md)

#### See

Native TEAL opcode: [`loads`](https://dev.algorand.co/reference/algorand-teal/opcodes#loads)
Min AVM version: 5

### store()

store B to the Ath scratch space

#### Parameters

##### a

[`uint64`](../../index/type-aliases/uint64.md)

##### b

[`uint64`](../../index/type-aliases/uint64.md) | [`bytes`](../../index/type-aliases/bytes.md)

#### Returns

`void`

#### See

Native TEAL opcode: [`stores`](https://dev.algorand.co/reference/algorand-teal/opcodes#stores)
Min AVM version: 5
