[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / Account

# Function: Account()

## Call Signature

> **Account**(): [`Account`](../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/reference.ts:109](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L109)

Create a new account object representing the zero address

### Returns

[`Account`](../type-aliases/Account.md)

## Call Signature

> **Account**(`publicKey`): [`Account`](../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/reference.ts:114](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L114)

Create a new account object representing the provided public key bytes

### Parameters

#### publicKey

[`bytes`](../type-aliases/bytes.md)

A 32-byte Algorand account public key

### Returns

[`Account`](../type-aliases/Account.md)

## Call Signature

> **Account**(`address`): [`Account`](../type-aliases/Account.md)

Defined in: [packages/algo-ts/src/reference.ts:120](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/reference.ts#L120)

Create a new account object representing the provided address

### Parameters

#### address

`string`

A 56 character base-32 encoded Algorand address

### Returns

[`Account`](../type-aliases/Account.md)
