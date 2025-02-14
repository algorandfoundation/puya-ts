[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / vrfVerify

# Function: vrfVerify()

> **vrfVerify**(`s`, `a`, `b`, `c`): readonly \[[`bytes`](../../../type-aliases/bytes.md), `boolean`\]

Defined in: [packages/algo-ts/src/op.ts:4025](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L4025)

Verify the proof B of message A against pubkey C. Returns vrf output and verification flag.
`VrfAlgorand` is the VRF used in Algorand. It is ECVRF-ED25519-SHA512-Elligator2, specified in the IETF internet draft [draft-irtf-cfrg-vrf-03](https://datatracker.ietf.org/doc/draft-irtf-cfrg-vrf/03/).

## Parameters

### s

[`VrfAlgorand`](../enumerations/VrfVerify.md#vrfalgorand)

### a

[`bytes`](../../../type-aliases/bytes.md)

### b

[`bytes`](../../../type-aliases/bytes.md)

### c

[`bytes`](../../../type-aliases/bytes.md)

## Returns

readonly \[[`bytes`](../../../type-aliases/bytes.md), `boolean`\]

## See

Native TEAL opcode: [`vrf_verify`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#vrf_verify)
Min AVM version: 7
