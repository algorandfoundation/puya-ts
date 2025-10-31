---
title: CompileLogicSigOptions
type: doc
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / CompileLogicSigOptions

# Type Alias: CompileLogicSigOptions

> **CompileLogicSigOptions** = `object`

Defined in: [compiled.ts:90](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/compiled.ts#L90)

Options for compiling a logic signature

## Properties

### templateVars?

> `optional` **templateVars**: `Record`\<`string`, [`DeliberateAny`](../-internal-/type-aliases/DeliberateAny.md)\>

Defined in: [compiled.ts:95](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/compiled.ts#L95)

Template variables to substitute into the contract, key should be without the prefix, must evaluate to a compile time constant
and match the type of the template var declaration

***

### templateVarsPrefix?

> `optional` **templateVarsPrefix**: `string`

Defined in: [compiled.ts:99](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/compiled.ts#L99)

Prefix to add to provided template vars, defaults to the prefix supplied on command line (which defaults to TMPL_)
