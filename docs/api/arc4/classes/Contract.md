[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [arc4](../README.md) / Contract

# Class: Contract

Defined in: [packages/algo-ts/src/arc4/index.ts:14](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L14)

The base type for all ARC4 contracts in Algorand TypeScript

## Extends

- [`BaseContract`](../../index/classes/BaseContract.md)

## Constructors

### Constructor

> **new Contract**(): `Contract`

#### Returns

`Contract`

#### Inherited from

[`BaseContract`](../../index/classes/BaseContract.md).[`constructor`](../../index/classes/BaseContract.md#constructor)

## Methods

### approvalProgram()

> **approvalProgram**(): `boolean`

Defined in: [packages/algo-ts/src/arc4/index.ts:19](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/index.ts#L19)

Default implementation of an ARC4 approval program, routes transactions to ABI or bare methods based on application
args and on completion actions

#### Returns

`boolean`

#### Overrides

[`BaseContract`](../../index/classes/BaseContract.md).[`approvalProgram`](../../index/classes/BaseContract.md#approvalprogram)

***

### clearStateProgram()

> **clearStateProgram**(): `boolean` \| [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/base-contract.ts:18](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/base-contract.ts#L18)

The program to be run when the On Completion Action is == ClearState (3)

#### Returns

`boolean` \| [`uint64`](../../index/type-aliases/uint64.md)

#### Inherited from

[`BaseContract`](../../index/classes/BaseContract.md).[`clearStateProgram`](../../index/classes/BaseContract.md#clearstateprogram)
