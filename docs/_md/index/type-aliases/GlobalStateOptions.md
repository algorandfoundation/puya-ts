---
title: GlobalStateOptions
type: doc
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / GlobalStateOptions

# Type Alias: GlobalStateOptions\<ValueType\>

> **GlobalStateOptions**\<`ValueType`\> = `object`

Defined in: [state.ts:26](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/state.ts#L26)

Options for declaring a global state field

## Type Parameters

### ValueType

`ValueType`

## Properties

### initialValue?

> `optional` **initialValue**: `ValueType`

Defined in: [state.ts:36](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/state.ts#L36)

An initial value to assign to this global state field when the application is created

***

### key?

> `optional` **key**: [`bytes`](bytes.md) \| `string`

Defined in: [state.ts:32](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/state.ts#L32)

The key to be used for this global state field.

Defaults to the name of the property this proxy is assigned to
