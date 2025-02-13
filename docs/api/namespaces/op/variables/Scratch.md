[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / Scratch

# Variable: Scratch

> `const` **Scratch**: `object`

Defined in: [packages/algo-ts/src/op.ts:3292](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/op.ts#L3292)

Load or store scratch values

## Type declaration

### loadBytes()

Ath scratch space value.  All scratch spaces are 0 at program start.

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`bytes`](../../../type-aliases/bytes.md)

#### See

Native TEAL opcode: [`loads`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#loads)
Min AVM version: 5

### loadUint64()

Ath scratch space value.  All scratch spaces are 0 at program start.

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md)

#### Returns

[`uint64`](../../../type-aliases/uint64.md)

#### See

Native TEAL opcode: [`loads`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#loads)
Min AVM version: 5

### store()

store B to the Ath scratch space

#### Parameters

##### a

[`uint64`](../../../type-aliases/uint64.md)

##### b

[`uint64`](../../../type-aliases/uint64.md) | [`bytes`](../../../type-aliases/bytes.md)

#### Returns

`void`

#### See

Native TEAL opcode: [`stores`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#stores)
Min AVM version: 5
