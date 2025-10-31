---
title: ecdsaVerify
type: function
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / ecdsaVerify

# Function: ecdsaVerify()

> **ecdsaVerify**(`v`, `a`, `b`, `c`, `d`, `e`): `boolean`

Defined in: [op.ts:864](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L864)

for (data A, signature B, C and pubkey D, E) verify the signature of the data against the pubkey => {0 or 1}
The 32 byte Y-component of a public key is the last element on the stack, preceded by X-component of a pubkey, preceded by S and R components of a signature, preceded by the data that is fifth element on the stack. All values are big-endian encoded. The signed data must be 32 bytes long, and signatures in lower-S form are only accepted.

## Parameters

### v

[`Ecdsa`](../enumerations/Ecdsa.md)

### a

[`bytes`](../../index/type-aliases/bytes.md)\<`32`\> | [`bytes`](../../index/type-aliases/bytes.md)

### b

[`bytes`](../../index/type-aliases/bytes.md)\<`32`\> | [`bytes`](../../index/type-aliases/bytes.md)

### c

[`bytes`](../../index/type-aliases/bytes.md)\<`32`\> | [`bytes`](../../index/type-aliases/bytes.md)

### d

[`bytes`](../../index/type-aliases/bytes.md)\<`32`\> | [`bytes`](../../index/type-aliases/bytes.md)

### e

[`bytes`](../../index/type-aliases/bytes.md)\<`32`\> | [`bytes`](../../index/type-aliases/bytes.md)

## Returns

`boolean`

## See

Native TEAL opcode: [`ecdsa_verify`](https://dev.algorand.co/reference/algorand-teal/opcodes#ecdsa_verify)
Min AVM version: 5
