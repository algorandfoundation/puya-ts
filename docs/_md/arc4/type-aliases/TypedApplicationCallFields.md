[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [arc4](../README.md) / TypedApplicationCallFields

# Type Alias: TypedApplicationCallFields\<TArgs\>

> **TypedApplicationCallFields**\<`TArgs`\> = [`Omit`](../-internal-/type-aliases/Omit.md)\<[`ApplicationCallFields`](../../itxn/interfaces/ApplicationCallFields.md), `"appArgs"`\> & `TArgs` *extends* \[\] ? `object` : `object`

Defined in: [packages/algo-ts/src/arc4/c2c.ts:57](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/c2c.ts#L57)

Application call fields with `appArgs` replaced with an `args` property that is strongly typed to the actual arguments for the
given application call.

## Type Parameters

### TArgs

`TArgs`
