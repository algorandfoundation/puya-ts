[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / ed25519verifyBare

# Function: ed25519verifyBare()

> **ed25519verifyBare**(`a`, `b`, `c`): `boolean`

Defined in: [packages/algo-ts/src/op.ts:868](https://github.com/algorandfoundation/puya-ts/blob/89ee9cf9a58d93e3ffbb727cfadf537835799a71/packages/algo-ts/src/op.ts#L868)

for (data A, signature B, pubkey C) verify the signature of the data against the pubkey => {0 or 1}

## Parameters

### a

[`bytes`](../../../type-aliases/bytes.md)

### b

[`bytes`](../../../type-aliases/bytes.md)

### c

[`bytes`](../../../type-aliases/bytes.md)

## Returns

`boolean`

## See

Native TEAL opcode: [`ed25519verify_bare`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#ed25519verify_bare)
Min AVM version: 7
