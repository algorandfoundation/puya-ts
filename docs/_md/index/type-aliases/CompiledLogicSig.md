---
title: CompiledLogicSig
type: doc
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / CompiledLogicSig

# Type Alias: CompiledLogicSig

> **CompiledLogicSig** = `object`

Defined in: [compiled.ts:45](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/compiled.ts#L45)

Provides account for a Logic Signature. Created by calling `compile(LogicSigType)`

## Properties

### account

> `readonly` **account**: [`Account`](Account.md)

Defined in: [compiled.ts:49](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/compiled.ts#L49)

Address of a logic sig program, after template variables have been replaced and compiled to AVM bytecode
