[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [index](../README.md) / CompiledContract

# Type Alias: CompiledContract

> **CompiledContract**: `object`

Defined in: [packages/algo-ts/src/compiled.ts:11](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/compiled.ts#L11)

Provides compiled programs and state allocation values for a Contract. Created by calling `compile(ExampleContractType)`

## Type declaration

### approvalProgram

> **approvalProgram**: \[[`bytes`](bytes.md), [`bytes`](bytes.md)\]

Approval program pages for a contract, after template variables have been replaced and compiled to AVM bytecode

### clearStateProgram

> **clearStateProgram**: \[[`bytes`](bytes.md), [`bytes`](bytes.md)\]

Clear state program pages for a contract, after template variables have been replaced and compiled to AVM bytecode

### extraProgramPages

> **extraProgramPages**: [`uint64`](uint64.md)

By default, provides extra program pages required based on approval and clear state program size, can be overridden when calling `compile(ExampleContractType, { extraProgramPages: ... })`

### globalBytes

> **globalBytes**: [`uint64`](uint64.md)

By default, provides global num bytes based on contract state totals, can be overridden when calling `compile(ExampleContractType, { globalBytes: ... })`

### globalUints

> **globalUints**: [`uint64`](uint64.md)

By default, provides global num uints based on contract state totals, can be overridden when calling `compile(ExampleContractType, { globalUints: ... })`

### localBytes

> **localBytes**: [`uint64`](uint64.md)

By default, provides local num bytes based on contract state totals, can be overridden  when calling `compile(ExampleContractType, { localBytes: ... })`

### localUints

> **localUints**: [`uint64`](uint64.md)

By default, provides local num uints based on contract state totals, can be overridden when calling `compile(ExampleContractType, { localUints: ... })`
