---
title: concat
type: function
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / concat

# Function: concat()

> **concat**(`a`, `b`): [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [op.ts:735](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L735)

join A and B
`concat` fails if the result would be greater than 4096 bytes.

## Parameters

### a

[`bytes`](../../index/type-aliases/bytes.md)

### b

[`bytes`](../../index/type-aliases/bytes.md)

## Returns

[`bytes`](../../index/type-aliases/bytes.md)

## See

Native TEAL opcode: [`concat`](https://dev.algorand.co/reference/algorand-teal/opcodes#concat)
Min AVM version: 2
