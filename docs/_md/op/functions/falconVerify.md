---
title: falconVerify
type: function
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / falconVerify

# Function: falconVerify()

> **falconVerify**(`a`, `b`, `c`): `boolean`

Defined in: [op.ts:944](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L944)

for (data A, compressed-format signature B, pubkey C) verify the signature of data against the pubkey => {0 or 1}

## Parameters

### a

[`bytes`](../../index/type-aliases/bytes.md)

### b

[`bytes`](../../index/type-aliases/bytes.md) | [`bytes`](../../index/type-aliases/bytes.md)\<`1232`\>

### c

[`bytes`](../../index/type-aliases/bytes.md) | [`bytes`](../../index/type-aliases/bytes.md)\<`1793`\>

## Returns

`boolean`

## See

Native TEAL opcode: [`falcon_verify`](https://dev.algorand.co/reference/algorand-teal/opcodes#falcon_verify)
Min AVM version: 12
