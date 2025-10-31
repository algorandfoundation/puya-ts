---
title: getBit
type: function
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / getBit

# Function: getBit()

> **getBit**(`a`, `b`): `boolean`

Defined in: [op.ts:964](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L964)

Bth bit of (byte-array or integer) A. If B is greater than or equal to the bit length of the value (8*byte length), the program fails
see explanation of bit ordering in setbit

## Parameters

### a

[`uint64`](../../index/type-aliases/uint64.md) | [`bytes`](../../index/type-aliases/bytes.md)

### b

[`uint64`](../../index/type-aliases/uint64.md)

## Returns

`boolean`

## See

Native TEAL opcode: [`getbit`](https://dev.algorand.co/reference/algorand-teal/opcodes#getbit)
Min AVM version: 3
