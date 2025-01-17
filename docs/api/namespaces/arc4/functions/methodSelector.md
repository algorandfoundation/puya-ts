[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [arc4](../README.md) / methodSelector

# Function: methodSelector()

> **methodSelector**(`methodSignature`): [`bytes`](../../../type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/arc4/index.ts:96](https://github.com/algorandfoundation/puya-ts/blob/5bdb536fcbeffa6fe079b274d09cae785c8fb7b7/packages/algo-ts/src/arc4/index.ts#L96)

Returns the ARC4 method selector for a given ARC4 method signature. The method selector is the first
4 bytes of the SHA512/256 hash of the method signature.

## Parameters

### methodSignature

`string`

An ARC4 method signature. Eg. `hello(string)string`. Must be a compile time constant.

## Returns

[`bytes`](../../../type-aliases/bytes.md)

The ARC4 method selector. Eg. `02BECE11`
