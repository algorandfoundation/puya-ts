---
title: minBalance
type: function
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / minBalance

# Function: minBalance()

> **minBalance**(`a`): [`uint64`](../../index/type-aliases/uint64.md)

Defined in: [op.ts:3393](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L3393)

minimum required balance for account A, in microalgos. Required balance is affected by ASA, App, and Box usage. When creating or opting into an app, the minimum balance grows before the app code runs, therefore the increase is visible there. When deleting or closing out, the minimum balance decreases after the app executes. Changes caused by inner transactions or box usage are observable immediately following the opcode effecting the change.

## Parameters

### a

Txn.Accounts offset (or, since v4, an _available_ account address), _available_ application id (or, since v4, a Txn.ForeignApps offset).

[`uint64`](../../index/type-aliases/uint64.md) | [`Account`](../../index/type-aliases/Account.md)

## Returns

[`uint64`](../../index/type-aliases/uint64.md)

value.

## See

Native TEAL opcode: [`min_balance`](https://dev.algorand.co/reference/algorand-teal/opcodes#min_balance)
Min AVM version: 3
