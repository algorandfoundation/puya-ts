[**@algorandfoundation/algorand-typescript**](../../README.md)

***

[@algorandfoundation/algorand-typescript](../../README.md) / [arc4](../README.md) / ContractProxy

# Type Alias: ContractProxy\<TContract\>

> **ContractProxy**\<`TContract`\>: [`CompiledContract`](../../index/type-aliases/CompiledContract.md) & `object`

Defined in: [packages/algo-ts/src/arc4/c2c.ts:78](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/arc4/c2c.ts#L78)

Conditional type which maps an ARC4 compatible contract to a proxy object which allows for constructing application call transactions for
all available ABI and bare methods. Also includes the compiled contract result data.

## Type declaration

### call

> **call**: \{ \[key in keyof TContract as key extends "approvalProgram" \| "clearStateProgram" ? never : TContract\[key\] extends AnyFunction ? key : never\]: ContractProxyMethod\<TContract\[key\]\> \}

Get methods for calling ABI and bare methods on the target contract

### bareCreate()

Create a bare application call itxn to create the contract.

#### Parameters

##### fields?

[`BareCreateApplicationCallFields`](BareCreateApplicationCallFields.md)

Specify values for transaction fields which should override the default values.

#### Returns

[`ApplicationInnerTxn`](../../index/namespaces/itxn/interfaces/ApplicationInnerTxn.md)

## Type Parameters

• **TContract** *extends* [`Contract`](../classes/Contract.md)
