[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [arc4](../README.md) / abiCall

# Function: abiCall()

> **abiCall**\<`TArgs`, `TReturn`\>(`method`, `fields`): [`TypedApplicationCallResponse`](../type-aliases/TypedApplicationCallResponse.md)\<`TReturn`\>

Defined in: [packages/algo-ts/src/arc4/c2c.ts:116](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/c2c.ts#L116)

Invokes the target ABI method using a strongly typed fields object.

## Type Parameters

• **TArgs** *extends* `any`[]

• **TReturn**

## Parameters

### method

[`InstanceMethod`](../-internal-/type-aliases/InstanceMethod.md)\<[`Contract`](../classes/Contract.md), `TArgs`, `TReturn`\>

An ABI method function reference.

### fields

[`TypedApplicationCallFields`](../type-aliases/TypedApplicationCallFields.md)\<`TArgs`\>

Specify values for transaction fields.

## Returns

[`TypedApplicationCallResponse`](../type-aliases/TypedApplicationCallResponse.md)\<`TReturn`\>
