---
title: addw
type: function
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / addw

# Function: addw()

> **addw**(`a`, `b`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), [`uint64`](../../index/type-aliases/uint64.md)\]

Defined in: [op.ts:179](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L179)

A plus B as a 128-bit result. X is the carry-bit, Y is the low-order 64 bits.

## Parameters

### a

[`uint64`](../../index/type-aliases/uint64.md)

### b

[`uint64`](../../index/type-aliases/uint64.md)

## Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), [`uint64`](../../index/type-aliases/uint64.md)\]

## See

Native TEAL opcode: [`addw`](https://dev.algorand.co/reference/algorand-teal/opcodes#addw)
Min AVM version: 2
