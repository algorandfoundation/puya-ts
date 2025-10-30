[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / ed25519verifyBare

# Function: ed25519verifyBare()

> **ed25519verifyBare**(`a`, `b`, `c`): `boolean`

Defined in: [packages/algo-ts/src/op.ts:869](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L869)

for (data A, signature B, pubkey C) verify the signature of the data against the pubkey => {0 or 1}

## Parameters

### a

[`bytes`](../../index/type-aliases/bytes.md)

### b

[`bytes`](../../index/type-aliases/bytes.md)

### c

[`bytes`](../../index/type-aliases/bytes.md)

## Returns

`boolean`

## See

Native TEAL opcode: [`ed25519verify_bare`](https://dev.algorand.co/reference/algorand-teal/opcodes#ed25519verify_bare)
Min AVM version: 7
