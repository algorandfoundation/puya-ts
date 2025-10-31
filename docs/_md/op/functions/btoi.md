---
title: btoi
type: function
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / btoi

# Function: btoi()

> **btoi**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [op.ts:716](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L716)

converts big-endian byte array A to uint64. Fails if len(A) > 8. Padded by leading 0s if len(A) < 8.
`btoi` fails if the input is longer than 8 bytes.

## Parameters

### a

[`bytes`](../../index/type-aliases/bytes.md)

## Returns

[`uint64`](../../index/type-aliases/uint64.md)

## See

Native TEAL opcode: [`btoi`](https://dev.algorand.co/reference/algorand-teal/opcodes#btoi)
Min AVM version: 1
