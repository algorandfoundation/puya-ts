---
title: AbiCallResponse
type: doc
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / AbiCallResponse

# Type Alias: AbiCallResponse\<TMethod\>

> **AbiCallResponse**\<`TMethod`\> = `TMethod` *extends* [`InstanceMethod`](../-internal-/type-aliases/InstanceMethod.md)\<[`Contract`](../classes/Contract.md), infer TParams, infer TResult\> ? [`TypedApplicationCallResponse`](TypedApplicationCallResponse.md)\<`TResult`\> : [`TypedApplicationCallResponse`](TypedApplicationCallResponse.md)\<`unknown`\>

Defined in: [arc4/c2c.ts:117](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/c2c.ts#L117)

## Type Parameters

### TMethod

`TMethod`
