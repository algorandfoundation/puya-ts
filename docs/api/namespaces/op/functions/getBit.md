[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / getBit

# Function: getBit()

> **getBit**(`a`, `b`): [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/op.ts:942](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L942)

Bth bit of (byte-array or integer) A. If B is greater than or equal to the bit length of the value (8*byte length), the program fails
see explanation of bit ordering in setbit

## Parameters

### a

[`uint64`](../../../type-aliases/uint64.md) | [`bytes`](../../../type-aliases/bytes.md)

### b

[`uint64`](../../../type-aliases/uint64.md)

## Returns

[`uint64`](../../../type-aliases/uint64.md)

## See

Native TEAL opcode: [`getbit`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#getbit)
Min AVM version: 3
