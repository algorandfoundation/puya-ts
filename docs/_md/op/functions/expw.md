---
title: expw
type: function
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / expw

# Function: expw()

> **expw**(`a`, `b`): readonly \[[`uint64`](../../index/type-aliases/uint64.md), [`uint64`](../../index/type-aliases/uint64.md)\]

Defined in: [op.ts:908](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L908)

A raised to the Bth power as a 128-bit result in two uint64s. X is the high 64 bits, Y is the low. Fail if A == B == 0 or if the results exceeds 2^128-1

## Parameters

### a

[`uint64`](../../index/type-aliases/uint64.md)

### b

[`uint64`](../../index/type-aliases/uint64.md)

## Returns

readonly \[[`uint64`](../../index/type-aliases/uint64.md), [`uint64`](../../index/type-aliases/uint64.md)\]

## See

Native TEAL opcode: [`expw`](https://dev.algorand.co/reference/algorand-teal/opcodes#expw)
Min AVM version: 4
