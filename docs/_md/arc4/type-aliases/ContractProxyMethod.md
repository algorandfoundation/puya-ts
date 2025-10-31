---
title: ContractProxyMethod
type: doc
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / ContractProxyMethod

# Type Alias: ContractProxyMethod\<TMethod\>

> **ContractProxyMethod**\<`TMethod`\> = `TMethod` *extends* (...`args`) => infer TReturn ? (`fields?`) => [`TypedApplicationCallResponse`](TypedApplicationCallResponse.md)\<`TReturn`\> : `never`

Defined in: [arc4/c2c.ts:71](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/c2c.ts#L71)

Conditional type which maps an ABI method to a factory method for constructing an application call transaction to call that method.

## Type Parameters

### TMethod

`TMethod`
