[**@algorandfoundation/algorand-typescript**](../README.md)

***

[@algorandfoundation/algorand-typescript](../README.md) / Application

# Type Alias: Application

> **Application**: `object`

Defined in: [packages/algo-ts/src/reference.ts:199](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L199)

An Application on the Algorand network.

## Type declaration

### address

> `readonly` **address**: [`Account`](Account.md)

Address for which this application has authority

### approvalProgram

> `readonly` **approvalProgram**: [`bytes`](bytes.md)

Bytecode of Approval Program

### clearStateProgram

> `readonly` **clearStateProgram**: [`bytes`](bytes.md)

Bytecode of Clear State Program

### creator

> `readonly` **creator**: [`Account`](Account.md)

Creator address

### extraProgramPages

> `readonly` **extraProgramPages**: [`uint64`](uint64.md)

Number of Extra Program Pages of code space

### globalNumBytes

> `readonly` **globalNumBytes**: [`uint64`](uint64.md)

Number of byte array values allowed in Global State

### globalNumUint

> `readonly` **globalNumUint**: [`uint64`](uint64.md)

Number of uint64 values allowed in Global State

### id

> `readonly` **id**: [`uint64`](uint64.md)

The id of this application on the current network

### localNumBytes

> `readonly` **localNumBytes**: [`uint64`](uint64.md)

Number of byte array values allowed in Local State

### localNumUint

> `readonly` **localNumUint**: [`uint64`](uint64.md)

Number of uint64 values allowed in Local State
