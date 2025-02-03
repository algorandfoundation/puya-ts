[**@algorandfoundation/algorand-typescript**](../README.md)

***

[@algorandfoundation/algorand-typescript](../README.md) / compile

# Function: compile()

## Call Signature

> **compile**(`contract`, `options`?): [`CompiledContract`](../type-aliases/CompiledContract.md)

Defined in: [packages/algo-ts/src/compiled.ts:107](https://github.com/algorandfoundation/puya-ts/blob/14c9827d80da81ff08b4923e997ba22be04aa0db/packages/algo-ts/src/compiled.ts#L107)

Compile a contract and return the resulting byte code for approval and clear state programs.

### Parameters

#### contract

`ConstructorFor`\<[`BaseContract`](../classes/BaseContract.md)\>

The contract class to compile

#### options?

[`CompileContractOptions`](../type-aliases/CompileContractOptions.md)

Options for compiling the contract

### Returns

[`CompiledContract`](../type-aliases/CompiledContract.md)

## Call Signature

> **compile**(`logicSig`, `options`?): [`CompiledLogicSig`](../type-aliases/CompiledLogicSig.md)

Defined in: [packages/algo-ts/src/compiled.ts:113](https://github.com/algorandfoundation/puya-ts/blob/14c9827d80da81ff08b4923e997ba22be04aa0db/packages/algo-ts/src/compiled.ts#L113)

Compile a logic signature and return an account ready for signing transactions.

### Parameters

#### logicSig

`ConstructorFor`\<[`LogicSig`](../classes/LogicSig.md)\>

The logic sig class to compile

#### options?

[`CompileLogicSigOptions`](../type-aliases/CompileLogicSigOptions.md)

Options for compiling the logic sig

### Returns

[`CompiledLogicSig`](../type-aliases/CompiledLogicSig.md)
