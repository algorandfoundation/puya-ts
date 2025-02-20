[**@algorandfoundation/algorand-typescript**](../README.md)

***

[@algorandfoundation/algorand-typescript](../README.md) / CompileContractOptions

# Type Alias: CompileContractOptions

> **CompileContractOptions**: `object`

Defined in: [packages/algo-ts/src/compiled.ts:55](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/compiled.ts#L55)

Options for compiling a contract

## Type declaration

### extraProgramPages?

> `optional` **extraProgramPages**: [`uint64`](uint64.md)

Number of extra program pages, defaults to minimum required for contract

### globalBytes?

> `optional` **globalBytes**: [`uint64`](uint64.md)

Number of global bytes, defaults to value defined for contract

### globalUints?

> `optional` **globalUints**: [`uint64`](uint64.md)

Number of global uint64s, defaults to value defined for contract

### localBytes?

> `optional` **localBytes**: [`uint64`](uint64.md)

Number of local bytes, defaults to value defined for contract

### localUints?

> `optional` **localUints**: [`uint64`](uint64.md)

Number of local uint64s, defaults to value defined for contract

### templateVars?

> `optional` **templateVars**: `Record`\<`string`, `DeliberateAny`\>

Template variables to substitute into the contract, key should be without the prefix, must evaluate to a compile time constant
and match the type of the template var declaration

### templateVarsPrefix?

> `optional` **templateVarsPrefix**: `string`

Prefix to add to provided template vars, defaults to the prefix supplied on command line (which defaults to TMPL_)
