[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [arc4](../README.md) / TypedApplicationArg

# Type Alias: TypedApplicationArg\<TArg\>

> **TypedApplicationArg**\<`TArg`\> = `TArg` *extends* [`Transaction`](../../index/namespaces/gtxn/type-aliases/Transaction.md) ? [`GtxnToItxnFields`](GtxnToItxnFields.md)\<`TArg`\> : `TArg`

Defined in: [packages/algo-ts/src/arc4/c2c.ts:42](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/c2c.ts#L42)

Conditional type which given an application argument, returns the input type for that argument.

The input type will usually be the original type apart from group transactions which will be substituted
with their equivalent inner transaction type.

## Type Parameters

### TArg

`TArg`
