---
title: LocalState
type: doc
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / LocalState

# Type Alias: LocalState()\<ValueType\>

> **LocalState**\<`ValueType`\> = (`account`) => [`LocalStateForAccount`](LocalStateForAccount.md)\<`ValueType`\>

Defined in: [state.ts:92](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/state.ts#L92)

Creates a new proxy for manipulating a local state field

## Type Parameters

### ValueType

`ValueType`

Gets the LocalState proxy for a specific account

## Parameters

### account

[`Account`](Account.md)

The account to read or write state for. This account must be opted into the contract

## Returns

[`LocalStateForAccount`](LocalStateForAccount.md)\<`ValueType`\>

## Param

Options for configuring this field
