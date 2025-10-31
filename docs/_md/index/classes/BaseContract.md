---
title: BaseContract
type: class
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / BaseContract

# Class: `abstract` BaseContract

Defined in: [base-contract.ts:9](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/base-contract.ts#L9)

The base type for all Algorand TypeScript contracts

## Extended by

- [`Contract`](../../arc4/classes/Contract.md)

## Constructors

### Constructor

> **new BaseContract**(): `BaseContract`

#### Returns

`BaseContract`

## Methods

### approvalProgram()

> `abstract` **approvalProgram**(): `boolean` \| [`uint64`](../type-aliases/uint64.md)

Defined in: [base-contract.ts:13](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/base-contract.ts#L13)

The program to be run when the On Completion Action is != ClearState (3)

#### Returns

`boolean` \| [`uint64`](../type-aliases/uint64.md)

***

### clearStateProgram()

> **clearStateProgram**(): `boolean` \| [`uint64`](../type-aliases/uint64.md)

Defined in: [base-contract.ts:18](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/base-contract.ts#L18)

The program to be run when the On Completion Action is == ClearState (3)

#### Returns

`boolean` \| [`uint64`](../type-aliases/uint64.md)
