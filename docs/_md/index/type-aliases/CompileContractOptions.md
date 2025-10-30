[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / CompileContractOptions

# Type Alias: CompileContractOptions

> **CompileContractOptions** = `object`

Defined in: [packages/algo-ts/src/compiled.ts:55](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/compiled.ts#L55)

Options for compiling a contract

## Properties

### extraProgramPages?

> `optional` **extraProgramPages**: [`uint64`](uint64.md)

Defined in: [packages/algo-ts/src/compiled.ts:59](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/compiled.ts#L59)

Number of extra program pages, defaults to minimum required for contract

***

### globalBytes?

> `optional` **globalBytes**: [`uint64`](uint64.md)

Defined in: [packages/algo-ts/src/compiled.ts:67](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/compiled.ts#L67)

Number of global bytes, defaults to value defined for contract

***

### globalUints?

> `optional` **globalUints**: [`uint64`](uint64.md)

Defined in: [packages/algo-ts/src/compiled.ts:63](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/compiled.ts#L63)

Number of global uint64s, defaults to value defined for contract

***

### localBytes?

> `optional` **localBytes**: [`uint64`](uint64.md)

Defined in: [packages/algo-ts/src/compiled.ts:75](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/compiled.ts#L75)

Number of local bytes, defaults to value defined for contract

***

### localUints?

> `optional` **localUints**: [`uint64`](uint64.md)

Defined in: [packages/algo-ts/src/compiled.ts:71](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/compiled.ts#L71)

Number of local uint64s, defaults to value defined for contract

***

### templateVars?

> `optional` **templateVars**: [`Record`](../-internal-/type-aliases/Record.md)\<`string`, [`DeliberateAny`](../-internal-/type-aliases/DeliberateAny.md)\>

Defined in: [packages/algo-ts/src/compiled.ts:80](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/compiled.ts#L80)

Template variables to substitute into the contract, key should be without the prefix, must evaluate to a compile time constant
and match the type of the template var declaration

***

### templateVarsPrefix?

> `optional` **templateVarsPrefix**: `string`

Defined in: [packages/algo-ts/src/compiled.ts:84](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/compiled.ts#L84)

Prefix to add to provided template vars, defaults to the prefix supplied on command line (which defaults to TMPL_)
