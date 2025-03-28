[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [index](../README.md) / LocalStateForAccount

# Type Alias: LocalStateForAccount\<ValueType\>

> **LocalStateForAccount**\<`ValueType`\> = `object`

Defined in: [packages/algo-ts/src/state.ts:51](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/state.ts#L51)

A proxy for manipulating a local state field for a single account

## Type Parameters

### ValueType

`ValueType`

## Properties

### hasValue

> `readonly` **hasValue**: `boolean`

Defined in: [packages/algo-ts/src/state.ts:63](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/state.ts#L63)

Gets a boolean value indicating if local state field for a single account currently has a value

***

### value

> **value**: `ValueType`

Defined in: [packages/algo-ts/src/state.ts:55](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/state.ts#L55)

Get or set the value of this local state field for a single account

## Methods

### delete()

> **delete**(): `void`

Defined in: [packages/algo-ts/src/state.ts:59](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/state.ts#L59)

Delete the stored value of this local state field for a single account

#### Returns

`void`
