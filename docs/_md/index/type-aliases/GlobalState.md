---
title: GlobalState
type: doc
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / GlobalState

# Type Alias: GlobalState\<ValueType\>

> **GlobalState**\<`ValueType`\> = `object`

Defined in: [state.ts:44](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/state.ts#L44)

Creates a new proxy for manipulating a global state field

## Param

Options for configuring this field

## Type Parameters

### ValueType

`ValueType`

The type of the value being stored - must be a serializable type

## Properties

### hasValue

> `readonly` **hasValue**: `boolean`

Defined in: [state.ts:21](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/state.ts#L21)

Gets a boolean value indicating if global state field currently has a value

***

### value

> **value**: `ValueType`

Defined in: [state.ts:13](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/state.ts#L13)

Get or set the value of this global state field

## Methods

### delete()

> **delete**(): `void`

Defined in: [state.ts:17](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/state.ts#L17)

Delete the stored value of this global state field

#### Returns

`void`
