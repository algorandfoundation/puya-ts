---
title: extractUint16
type: function
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / extractUint16

# Function: extractUint16()

> **extractUint16**(`a`, `b`): [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [op.ts:917](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L917)

A uint16 formed from a range of big-endian bytes from A starting at B up to but not including B+2. If B+2 is larger than the array length, the program fails

## Parameters

### a

[`bytes`](../../index/type-aliases/bytes.md)

### b

[`uint64`](../../index/type-aliases/uint64.md)

## Returns

[`uint64`](../../index/type-aliases/uint64.md)

## See

Native TEAL opcode: [`extract_uint16`](https://dev.algorand.co/reference/algorand-teal/opcodes#extract_uint16)
Min AVM version: 5
