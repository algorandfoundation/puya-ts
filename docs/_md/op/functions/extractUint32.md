[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / extractUint32

# Function: extractUint32()

> **extractUint32**(`a`, `b`): [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/op.ts:905](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L905)

A uint32 formed from a range of big-endian bytes from A starting at B up to but not including B+4. If B+4 is larger than the array length, the program fails

## Parameters

### a

[`bytes`](../../index/type-aliases/bytes.md)

### b

[`uint64`](../../index/type-aliases/uint64.md)

## Returns

[`uint64`](../../index/type-aliases/uint64.md)

## See

Native TEAL opcode: [`extract_uint32`](https://dev.algorand.co/reference/algorand-teal/opcodes#extract_uint32)
Min AVM version: 5
