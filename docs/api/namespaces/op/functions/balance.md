[**@algorandfoundation/algorand-typescript**](../../../README.md)

***

[@algorandfoundation/algorand-typescript](../../../README.md) / [op](../README.md) / balance

# Function: balance()

> **balance**(`a`): [`uint64`](../../../type-aliases/uint64.md)

Defined in: [packages/algo-ts/src/op.ts:536](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L536)

balance for account A, in microalgos. The balance is observed after the effects of previous transactions in the group, and after the fee for the current transaction is deducted. Changes caused by inner transactions are observable immediately following `itxn_submit`

## Parameters

### a

[`uint64`](../../../type-aliases/uint64.md) | [`Account`](../../../type-aliases/Account.md)

## Returns

[`uint64`](../../../type-aliases/uint64.md)

value.

## See

Native TEAL opcode: [`balance`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#balance)
Min AVM version: 2
