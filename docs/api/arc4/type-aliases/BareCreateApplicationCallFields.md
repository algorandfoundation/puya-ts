[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [arc4](../README.md) / BareCreateApplicationCallFields

# Type Alias: BareCreateApplicationCallFields

> **BareCreateApplicationCallFields**: [`Omit`](../-internal-/type-aliases/Omit.md)\<[`ApplicationCallFields`](../../index/namespaces/itxn/interfaces/ApplicationCallFields.md), `"appId"` \| `"appArgs"`\>

Defined in: [packages/algo-ts/src/arc4/c2c.ts:16](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/c2c.ts#L16)

Defines txn fields that are available for a bare create application call.

This is the regular application call fields minus:
 - appId: because the appId is not known when creating an application
 - appArgs: because a bare call cannot have arguments
