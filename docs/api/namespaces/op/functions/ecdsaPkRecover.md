[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / ecdsaPkRecover

# Function: ecdsaPkRecover()

> **ecdsaPkRecover**(`v`, `a`, `b`, `c`, `d`): readonly \[[`bytes`](../../../type-aliases/bytes.md), [`bytes`](../../../type-aliases/bytes.md)\]

Defined in: [packages/algo-ts/src/op.ts:839](https://github.com/algorandfoundation/puya-ts/blob/14c9827d80da81ff08b4923e997ba22be04aa0db/packages/algo-ts/src/op.ts#L839)

for (data A, recovery id B, signature C, D) recover a public key
S (top) and R elements of a signature, recovery id and data (bottom) are expected on the stack and used to deriver a public key. All values are big-endian encoded. The signed data must be 32 bytes long.

## Parameters

### v

[`Ecdsa`](../enumerations/Ecdsa.md)

### a

[`bytes`](../../../type-aliases/bytes.md)

### b

[`uint64`](../../../type-aliases/uint64.md)

### c

[`bytes`](../../../type-aliases/bytes.md)

### d

[`bytes`](../../../type-aliases/bytes.md)

## Returns

readonly \[[`bytes`](../../../type-aliases/bytes.md), [`bytes`](../../../type-aliases/bytes.md)\]

## See

Native TEAL opcode: [`ecdsa_pk_recover`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#ecdsa_pk_recover)
Min AVM version: 5
