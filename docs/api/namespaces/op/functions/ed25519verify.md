[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / ed25519verify

# Function: ed25519verify()

> **ed25519verify**(`a`, `b`, `c`): `boolean`

Defined in: [packages/algo-ts/src/op.ts:859](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L859)

for (data A, signature B, pubkey C) verify the signature of ("ProgData" || program_hash || data) against the pubkey => {0 or 1}
The 32 byte public key is the last element on the stack, preceded by the 64 byte signature at the second-to-last element on the stack, preceded by the data which was signed at the third-to-last element on the stack.

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

Native TEAL opcode: [`ed25519verify`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#ed25519verify)
Min AVM version: 1
