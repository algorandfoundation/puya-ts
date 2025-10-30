[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / Application

# Type Alias: Application

> **Application** = `object`

Defined in: [packages/algo-ts/src/reference.ts:228](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L228)

An Application on the Algorand network.

## Properties

### address

> `readonly` **address**: [`Account`](Account.md)

Defined in: [packages/algo-ts/src/reference.ts:289](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L289)

Address for which this application has authority

***

### approvalProgram

> `readonly` **approvalProgram**: [`bytes`](bytes.md)

Defined in: [packages/algo-ts/src/reference.ts:249](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L249)

Bytecode of Approval Program

***

### clearStateProgram

> `readonly` **clearStateProgram**: [`bytes`](bytes.md)

Defined in: [packages/algo-ts/src/reference.ts:254](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L254)

Bytecode of Clear State Program

***

### creator

> `readonly` **creator**: [`Account`](Account.md)

Defined in: [packages/algo-ts/src/reference.ts:284](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L284)

Creator address

***

### extraProgramPages

> `readonly` **extraProgramPages**: [`uint64`](uint64.md)

Defined in: [packages/algo-ts/src/reference.ts:279](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L279)

Number of Extra Program Pages of code space

***

### globalNumBytes

> `readonly` **globalNumBytes**: [`uint64`](uint64.md)

Defined in: [packages/algo-ts/src/reference.ts:264](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L264)

Number of byte array values allowed in Global State

***

### globalNumUint

> `readonly` **globalNumUint**: [`uint64`](uint64.md)

Defined in: [packages/algo-ts/src/reference.ts:259](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L259)

Number of uint64 values allowed in Global State

***

### id

> `readonly` **id**: [`uint64`](uint64.md)

Defined in: [packages/algo-ts/src/reference.ts:245](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L245)

The id of this application on the current network

***

### localNumBytes

> `readonly` **localNumBytes**: [`uint64`](uint64.md)

Defined in: [packages/algo-ts/src/reference.ts:274](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L274)

Number of byte array values allowed in Local State

***

### localNumUint

> `readonly` **localNumUint**: [`uint64`](uint64.md)

Defined in: [packages/algo-ts/src/reference.ts:269](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L269)

Number of uint64 values allowed in Local State
