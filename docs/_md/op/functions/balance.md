---
title: balance
type: function
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / balance

# Function: balance()

> **balance**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [op.ts:545](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L545)

balance for account A, in microalgos. The balance is observed after the effects of previous transactions in the group, and after the fee for the current transaction is deducted. Changes caused by inner transactions are observable immediately following `itxn_submit`

## Parameters

### a

Txn.Accounts offset (or, since v4, an _available_ account address), _available_ application id (or, since v4, a Txn.ForeignApps offset).

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

## Returns

[`uint64`](../../index/type-aliases/uint64.md)

value.

## See

Native TEAL opcode: [`balance`](https://dev.algorand.co/reference/algorand-teal/opcodes#balance)
Min AVM version: 2
