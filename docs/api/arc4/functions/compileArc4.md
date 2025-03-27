[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [arc4](../README.md) / compileArc4

# Function: compileArc4()

> **compileArc4**\<`TContract`\>(`contract`, `options`?): [`ContractProxy`](../type-aliases/ContractProxy.md)\<`TContract`\>

Defined in: [packages/algo-ts/src/arc4/c2c.ts:104](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/c2c.ts#L104)

Pre compile the target ARC4 contract and return a proxy object for constructing inner transactions to call an instance of that contract.

## Type Parameters

• **TContract** *extends* [`Contract`](../classes/Contract.md)

## Parameters

### contract

[`ConstructorFor`](../-internal-/type-aliases/ConstructorFor.md)\<`TContract`\>

An ARC4 contract class

### options?

[`CompileContractOptions`](../../index/type-aliases/CompileContractOptions.md)

Compile contract arguments

## Returns

[`ContractProxy`](../type-aliases/ContractProxy.md)\<`TContract`\>
