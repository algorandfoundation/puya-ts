[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [arc4](../README.md) / TypedApplicationArgs

# Type Alias: TypedApplicationArgs\<TArgs\>

> **TypedApplicationArgs**\<`TArgs`\> = `TArgs` *extends* \[\] ? \[\] : `TArgs` *extends* \[infer TArg, `...(infer TRest)`\] ? \[[`TypedApplicationArg`](TypedApplicationArg.md)\<`TArg`\>, `...TypedApplicationArgs<TRest>`\] : `never`

Defined in: [packages/algo-ts/src/arc4/c2c.ts:47](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/c2c.ts#L47)

Conditional type which maps a tuple of application arguments to a tuple of input types for specifying those arguments.

## Type Parameters

### TArgs

`TArgs`
