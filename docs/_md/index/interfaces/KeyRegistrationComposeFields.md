---
title: KeyRegistrationComposeFields
type: interface
version: 1.0.0
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / KeyRegistrationComposeFields

# Interface: KeyRegistrationComposeFields

Defined in: [itxn-compose.ts:10](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn-compose.ts#L10)

## Extends

- [`KeyRegistrationFields`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md)

## Properties

### fee?

> `optional` **fee**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:635](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L635)

microalgos

#### Inherited from

[`KeyRegistrationFields`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md).[`fee`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md#fee)

***

### firstValid?

> `optional` **firstValid**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:639](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L639)

round number

#### Inherited from

[`KeyRegistrationFields`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md).[`firstValid`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md#firstvalid)

***

### firstValidTime?

> `optional` **firstValidTime**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:643](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L643)

UNIX timestamp of block before txn.FirstValid. Fails if negative

#### Inherited from

[`KeyRegistrationFields`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md).[`firstValidTime`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md#firstvalidtime)

***

### lastValid?

> `optional` **lastValid**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:647](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L647)

round number

#### Inherited from

[`KeyRegistrationFields`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md).[`lastValid`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md#lastvalid)

***

### lease?

> `optional` **lease**: [`bytes`](../type-aliases/bytes.md)\<`32`\>

Defined in: [itxn.ts:655](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L655)

32 byte lease value

#### Inherited from

[`KeyRegistrationFields`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md).[`lease`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md#lease)

***

### nonparticipation?

> `optional` **nonparticipation**: `boolean`

Defined in: [itxn.ts:683](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L683)

Marks an account nonparticipating for rewards

#### Inherited from

[`KeyRegistrationFields`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md).[`nonparticipation`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md#nonparticipation)

***

### note?

> `optional` **note**: `string` \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:651](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L651)

Any data up to 1024 bytes

#### Inherited from

[`KeyRegistrationFields`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md).[`note`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md#note)

***

### rekeyTo?

> `optional` **rekeyTo**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:659](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L659)

32 byte Sender's new AuthAddr

#### Inherited from

[`KeyRegistrationFields`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md).[`rekeyTo`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md#rekeyto)

***

### selectionKey?

> `optional` **selectionKey**: [`bytes`](../type-aliases/bytes.md)\<`32`\>

Defined in: [itxn.ts:667](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L667)

32 byte address

#### Inherited from

[`KeyRegistrationFields`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md).[`selectionKey`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md#selectionkey)

***

### sender?

> `optional` **sender**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:631](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L631)

32 byte address

#### Inherited from

[`KeyRegistrationFields`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md).[`sender`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md#sender)

***

### stateProofKey?

> `optional` **stateProofKey**: [`bytes`](../type-aliases/bytes.md)\<`64`\>

Defined in: [itxn.ts:687](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L687)

64 byte state proof public key

#### Inherited from

[`KeyRegistrationFields`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md).[`stateProofKey`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md#stateproofkey)

***

### type

> **type**: [`KeyRegistration`](../enumerations/TransactionType.md#keyregistration)

Defined in: [itxn-compose.ts:11](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn-compose.ts#L11)

***

### voteFirst?

> `optional` **voteFirst**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:671](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L671)

The first round that the participation key is valid.

#### Inherited from

[`KeyRegistrationFields`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md).[`voteFirst`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md#votefirst)

***

### voteKey?

> `optional` **voteKey**: [`bytes`](../type-aliases/bytes.md)\<`32`\>

Defined in: [itxn.ts:663](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L663)

32 byte address

#### Inherited from

[`KeyRegistrationFields`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md).[`voteKey`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md#votekey)

***

### voteKeyDilution?

> `optional` **voteKeyDilution**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:679](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L679)

Dilution for the 2-level participation key

#### Inherited from

[`KeyRegistrationFields`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md).[`voteKeyDilution`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md#votekeydilution)

***

### voteLast?

> `optional` **voteLast**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:675](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L675)

The last round that the participation key is valid.

#### Inherited from

[`KeyRegistrationFields`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md).[`voteLast`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md#votelast)
