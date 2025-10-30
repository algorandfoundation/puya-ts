[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / methodSelector

# Function: methodSelector()

## Call Signature

> **methodSelector**(`methodSignature`): [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/arc4/index.ts:166](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L166)

Returns the ARC4 method selector for a given ARC4 method signature. The method selector is the first
4 bytes of the SHA512/256 hash of the method signature.

### Parameters

#### methodSignature

[`InstanceMethod`](../-internal-/type-aliases/InstanceMethod.md)\<[`Contract`](../classes/Contract.md)\>

An ARC4 contract method reference. (Eg. `MyContract.prototype.myMethod`)

### Returns

[`bytes`](../../index/type-aliases/bytes.md)

The ARC4 method selector. Eg. `02BECE11`

## Call Signature

> **methodSelector**(`methodSignature`): [`bytes`](../../index/type-aliases/bytes.md)

Defined in: [packages/algo-ts/src/arc4/index.ts:173](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L173)

Returns the ARC4 method selector for a given ARC4 method signature. The method selector is the first
4 bytes of the SHA512/256 hash of the method signature.

### Parameters

#### methodSignature

`string`

An ARC4 method signature string (Eg. `hello(string)string`.  Must be a compile time constant)

### Returns

[`bytes`](../../index/type-aliases/bytes.md)

The ARC4 method selector. Eg. `02BECE11`
