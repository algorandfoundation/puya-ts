---
title: Account
type: function
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / Account

# Function: Account()

## Call Signature

> **Account**(): [`Account`](../type-aliases/Account.md)

Defined in: [reference.ts:109](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L109)

Create a new account object representing the zero address

### Returns

[`Account`](../type-aliases/Account.md)

## Call Signature

> **Account**(`publicKey`): [`Account`](../type-aliases/Account.md)

Defined in: [reference.ts:114](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L114)

Create a new account object representing the provided public key bytes

### Parameters

#### publicKey

[`bytes`](../type-aliases/bytes.md)

A 32-byte Algorand account public key

### Returns

[`Account`](../type-aliases/Account.md)

## Call Signature

> **Account**(`address`): [`Account`](../type-aliases/Account.md)

Defined in: [reference.ts:119](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L119)

Create a new account object representing the provided address

### Parameters

#### address

`string`

A 56 character base-32 encoded Algorand address

### Returns

[`Account`](../type-aliases/Account.md)
