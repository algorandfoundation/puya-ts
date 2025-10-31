---
title: TypedApplicationCallFields
type: doc
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / TypedApplicationCallFields

# Type Alias: TypedApplicationCallFields\<TArgs\>

> **TypedApplicationCallFields**\<`TArgs`\> = `Omit`\<[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md), `"appArgs"`\> & `TArgs` *extends* \[\] ? `object` : `object`

Defined in: [arc4/c2c.ts:58](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/c2c.ts#L58)

Application call fields with `appArgs` replaced with an `args` property that is strongly typed to the actual arguments for the
given application call.

## Type Parameters

### TArgs

`TArgs`
