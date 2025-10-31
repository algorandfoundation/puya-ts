---
title: mimc
type: function
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / mimc

# Function: mimc()

> **mimc**(`c`, `a`): [`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

Defined in: [op.ts:3382](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L3382)

MiMC hash of scalars A, using curve and parameters specified by configuration C
A is a list of concatenated 32 byte big-endian unsigned integer scalars.  Fail if A's length is not a multiple of 32 or any element exceeds the curve modulus.
The MiMC hash function has known collisions since any input which is a multiple of the elliptic curve modulus will hash to the same value. MiMC is thus not a general purpose hash function, but meant to be used in zero knowledge applications to match a zk-circuit implementation.

## Parameters

### c

[`MimcConfigurations`](../enumerations/MimcConfigurations.md)

### a

[`bytes`](../../index/type-aliases/bytes.md)

## Returns

[`bytes`](../../index/type-aliases/bytes.md)\<`32`\>

## See

Native TEAL opcode: [`mimc`](https://dev.algorand.co/reference/algorand-teal/opcodes#mimc)
Min AVM version: 11
