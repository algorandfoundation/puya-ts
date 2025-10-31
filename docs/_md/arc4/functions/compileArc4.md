---
title: compileArc4
type: function
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / compileArc4

# Function: compileArc4()

> **compileArc4**\<`TContract`\>(`contract`, `options?`): [`ContractProxy`](../type-aliases/ContractProxy.md)\<`TContract`\>

Defined in: [arc4/c2c.ts:105](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/c2c.ts#L105)

Pre compile the target ARC4 contract and return a proxy object for constructing inner transactions to call an instance of that contract.

## Type Parameters

### TContract

`TContract` *extends* [`Contract`](../classes/Contract.md)

## Parameters

### contract

[`ConstructorFor`](../../index/-internal-/type-aliases/ConstructorFor.md)\<`TContract`\>

An ARC4 contract class

### options?

[`CompileContractOptions`](../../index/type-aliases/CompileContractOptions.md)

Compile contract arguments

## Returns

[`ContractProxy`](../type-aliases/ContractProxy.md)\<`TContract`\>
