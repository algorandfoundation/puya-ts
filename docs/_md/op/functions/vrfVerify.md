---
title: vrfVerify
type: function
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / vrfVerify

# Function: vrfVerify()

> **vrfVerify**(`s`, `a`, `b`, `c`): readonly \[[`bytes`](../../index/type-aliases/bytes.md)\<`64`\>, `boolean`\]

Defined in: [op.ts:4087](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L4087)

Verify the proof B of message A against pubkey C. Returns vrf output and verification flag.
`VrfAlgorand` is the VRF used in Algorand. It is ECVRF-ED25519-SHA512-Elligator2, specified in the IETF internet draft [draft-irtf-cfrg-vrf-03](https://datatracker.ietf.org/doc/draft-irtf-cfrg-vrf/03/).

## Parameters

### s

[`VrfAlgorand`](../enumerations/VrfVerify.md#vrfalgorand)

### a

[`bytes`](../../index/type-aliases/bytes.md)

### b

[`bytes`](../../index/type-aliases/bytes.md) | [`bytes`](../../index/type-aliases/bytes.md)\<`80`\>

### c

[`bytes`](../../index/type-aliases/bytes.md)\<`32`\> | [`bytes`](../../index/type-aliases/bytes.md)

## Returns

readonly \[[`bytes`](../../index/type-aliases/bytes.md)\<`64`\>, `boolean`\]

## See

Native TEAL opcode: [`vrf_verify`](https://dev.algorand.co/reference/algorand-teal/opcodes#vrf_verify)
Min AVM version: 7
