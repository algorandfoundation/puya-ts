[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [index](../README.md) / BoxRef

# Function: BoxRef()

> **BoxRef**(`options`): [`BoxRef`](../type-aliases/BoxRef.md)

Defined in: [packages/algo-ts/src/box.ts:214](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/box.ts#L214)

Creates a BoxRef proxy object offering methods for getting and setting binary data in a box under a single key. This proxy is particularly
relevant when dealing with binary data that is larger than what the AVM can handle in a single value.

## Parameters

### options

[`CreateBoxRefOptions`](../-internal-/interfaces/CreateBoxRefOptions.md)

The options for creating the BoxRef proxy

## Returns

[`BoxRef`](../type-aliases/BoxRef.md)
