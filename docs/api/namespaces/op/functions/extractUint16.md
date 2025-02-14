[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / extractUint16

# Function: extractUint16()

> **extractUint16**(`a`, `b`): [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/op.ts:895](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L895)

A uint16 formed from a range of big-endian bytes from A starting at B up to but not including B+2. If B+2 is larger than the array length, the program fails

## Parameters

### a

[`bytes`](../../../type-aliases/bytes.md)

### b

[`uint64`](../../../type-aliases/uint64.md)

## Returns

[`uint64`](../../../type-aliases/uint64.md)

## See

Native TEAL opcode: [`extract_uint16`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#extract_uint16)
Min AVM version: 5
