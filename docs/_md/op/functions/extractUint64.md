---
title: extractUint64
type: function
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / extractUint64

# Function: extractUint64()

> **extractUint64**(`a`, `b`): [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [op.ts:935](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L935)

A uint64 formed from a range of big-endian bytes from A starting at B up to but not including B+8. If B+8 is larger than the array length, the program fails

## Parameters

### a

[`bytes`](../../index/type-aliases/bytes.md)

### b

[`uint64`](../../index/type-aliases/uint64.md)

## Returns

[`uint64`](../../index/type-aliases/uint64.md)

## See

Native TEAL opcode: [`extract_uint64`](https://dev.algorand.co/reference/algorand-teal/opcodes#extract_uint64)
Min AVM version: 5
