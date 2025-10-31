---
title: substring
type: function
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / substring

# Function: substring()

> **substring**(`a`, `b`, `c`): [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [op.ts:3493](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L3493)

A range of bytes from A starting at B up to but not including C. If C < B, or either is larger than the array length, the program fails

## Parameters

### a

[`bytes`](../../index/type-aliases/bytes.md)

### b

[`uint64`](../../index/type-aliases/uint64.md)

### c

[`uint64`](../../index/type-aliases/uint64.md)

## Returns

[`bytes`](../../index/type-aliases/bytes.md)

## See

Native TEAL opcode: [`substring3`](https://dev.algorand.co/reference/algorand-teal/opcodes#substring3)
Min AVM version: 2
