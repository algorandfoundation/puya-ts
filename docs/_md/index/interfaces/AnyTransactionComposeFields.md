---
title: AnyTransactionComposeFields
type: interface
generated: 2025-10-31
repo: puya-ts
---
[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [index](../README.md) / AnyTransactionComposeFields

# Interface: AnyTransactionComposeFields

Defined in: [itxn-compose.ts:26](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn-compose.ts#L26)

## Extends

- [`PaymentFields`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md).[`KeyRegistrationFields`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md).[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`AssetTransferFields`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md).[`AssetFreezeFields`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md).[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md)

## Properties

### accounts?

> `optional` **accounts**: readonly ([`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md))[]

Defined in: [itxn.ts:951](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L951)

Accounts listed in the ApplicationCall transaction

#### Param

Index of the account to get

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`accounts`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#accounts)

***

### amount?

> `optional` **amount**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:621](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L621)

microalgos

#### Inherited from

[`PaymentFields`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md).[`amount`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md#amount)

***

### appArgs?

> `optional` **appArgs**: readonly `unknown`[]

Defined in: [itxn.ts:946](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L946)

Arguments passed to the application in the ApplicationCall transaction

#### Param

Index of the arg to get

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`appArgs`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#appargs)

***

### appId?

> `optional` **appId**: [`uint64`](../type-aliases/uint64.md) \| [`Application`](../type-aliases/Application.md)

Defined in: [itxn.ts:907](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L907)

ApplicationID from ApplicationCall transaction

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`appId`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#appid)

***

### approvalProgram?

> `optional` **approvalProgram**: [`bytes`](../type-aliases/bytes.md) \| readonly [`bytes`](../type-aliases/bytes.md)[]

Defined in: [itxn.ts:936](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L936)

All approval program pages

#### Param

Index of the page to get

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`approvalProgram`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#approvalprogram)

***

### apps?

> `optional` **apps**: readonly ([`uint64`](../type-aliases/uint64.md) \| [`Application`](../type-aliases/Application.md))[]

Defined in: [itxn.ts:961](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L961)

Foreign Apps listed in the ApplicationCall transaction

#### Param

Index of the application to get

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`apps`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#apps)

***

### assetAmount?

> `optional` **assetAmount**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:811](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L811)

value in Asset's units

#### Inherited from

[`AssetTransferFields`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md).[`assetAmount`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md#assetamount)

***

### assetCloseTo?

> `optional` **assetCloseTo**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:823](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L823)

32 byte address

#### Inherited from

[`AssetTransferFields`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md).[`assetCloseTo`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md#assetcloseto)

***

### assetName?

> `optional` **assetName**: `string` \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:745](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L745)

The asset name

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`assetName`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#assetname)

***

### assetReceiver?

> `optional` **assetReceiver**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:819](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L819)

32 byte address

#### Inherited from

[`AssetTransferFields`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md).[`assetReceiver`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md#assetreceiver)

***

### assets?

> `optional` **assets**: readonly ([`uint64`](../type-aliases/uint64.md) \| [`Asset`](../type-aliases/Asset.md))[]

Defined in: [itxn.ts:956](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L956)

Foreign Assets listed in the ApplicationCall transaction

#### Param

Index of the asset to get

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`assets`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#assets)

***

### assetSender?

> `optional` **assetSender**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:815](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L815)

32 byte address. Source of assets if Sender is the Asset's Clawback address.

#### Inherited from

[`AssetTransferFields`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md).[`assetSender`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md#assetsender)

***

### clawback?

> `optional` **clawback**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:769](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L769)

32 byte address

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`clawback`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#clawback)

***

### clearStateProgram?

> `optional` **clearStateProgram**: [`bytes`](../type-aliases/bytes.md) \| readonly [`bytes`](../type-aliases/bytes.md)[]

Defined in: [itxn.ts:941](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L941)

All clear state program pages

#### Param

Index of the page to get

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`clearStateProgram`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#clearstateprogram)

***

### closeRemainderTo?

> `optional` **closeRemainderTo**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:625](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L625)

32 byte address

#### Inherited from

[`PaymentFields`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md).[`closeRemainderTo`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md#closeremainderto)

***

### configAsset?

> `optional` **configAsset**: [`uint64`](../type-aliases/uint64.md) \| [`Asset`](../type-aliases/Asset.md)

Defined in: [itxn.ts:725](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L725)

Asset ID in asset config transaction

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`configAsset`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#configasset)

***

### decimals?

> `optional` **decimals**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:733](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L733)

Number of digits to display after the decimal place when displaying the asset

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`decimals`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#decimals)

***

### defaultFrozen?

> `optional` **defaultFrozen**: `boolean`

Defined in: [itxn.ts:737](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L737)

Whether the asset's slots are frozen by default or not, 0 or 1

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`defaultFrozen`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#defaultfrozen)

***

### extraProgramPages?

> `optional` **extraProgramPages**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:931](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L931)

Number of additional pages for each of the application's approval and clear state program

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`extraProgramPages`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#extraprogrampages)

***

### fee?

> `optional` **fee**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:589](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L589)

microalgos

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`fee`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#fee)

***

### firstValid?

> `optional` **firstValid**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:593](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L593)

round number

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`firstValid`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#firstvalid)

***

### firstValidTime?

> `optional` **firstValidTime**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:597](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L597)

UNIX timestamp of block before txn.FirstValid. Fails if negative

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`firstValidTime`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#firstvalidtime)

***

### freeze?

> `optional` **freeze**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:765](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L765)

32 byte address

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`freeze`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#freeze)

***

### freezeAccount?

> `optional` **freezeAccount**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:865](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L865)

32 byte address of the account whose asset slot is being frozen or un-frozen

#### Inherited from

[`AssetFreezeFields`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md).[`freezeAccount`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md#freezeaccount)

***

### freezeAsset?

> `optional` **freezeAsset**: [`uint64`](../type-aliases/uint64.md) \| [`Asset`](../type-aliases/Asset.md)

Defined in: [itxn.ts:861](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L861)

Asset ID being frozen or un-frozen

#### Inherited from

[`AssetFreezeFields`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md).[`freezeAsset`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md#freezeasset)

***

### frozen?

> `optional` **frozen**: `boolean`

Defined in: [itxn.ts:869](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L869)

The new frozen value

#### Inherited from

[`AssetFreezeFields`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md).[`frozen`](../../itxn/namespaces/itxn/interfaces/AssetFreezeFields.md#frozen)

***

### globalNumBytes?

> `optional` **globalNumBytes**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:919](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L919)

Number of global state byteslices this application makes use of.

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`globalNumBytes`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#globalnumbytes)

***

### globalNumUint?

> `optional` **globalNumUint**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:915](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L915)

Number of global state integers this application makes use of.

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`globalNumUint`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#globalnumuint)

***

### lastValid?

> `optional` **lastValid**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:601](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L601)

round number

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`lastValid`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#lastvalid)

***

### lease?

> `optional` **lease**: [`bytes`](../type-aliases/bytes.md)\<`32`\>

Defined in: [itxn.ts:609](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L609)

32 byte lease value

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`lease`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#lease)

***

### localNumBytes?

> `optional` **localNumBytes**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:927](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L927)

Number of local state byteslices this application makes use of.

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`localNumBytes`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#localnumbytes)

***

### localNumUint?

> `optional` **localNumUint**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:923](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L923)

Number of local state integers this application makes use of.

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`localNumUint`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#localnumuint)

***

### manager?

> `optional` **manager**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:757](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L757)

32 byte address

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`manager`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#manager)

***

### metadataHash?

> `optional` **metadataHash**: [`bytes`](../type-aliases/bytes.md)\<`32`\>

Defined in: [itxn.ts:753](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L753)

32 byte commitment to unspecified asset metadata

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`metadataHash`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#metadatahash)

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

Defined in: [itxn.ts:605](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L605)

Any data up to 1024 bytes

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`note`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#note)

***

### onCompletion?

> `optional` **onCompletion**: [`OnCompleteAction`](../enumerations/OnCompleteAction.md)

Defined in: [itxn.ts:911](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L911)

ApplicationCall transaction on completion action

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`onCompletion`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#oncompletion)

***

### receiver?

> `optional` **receiver**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:617](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L617)

32 byte address

#### Inherited from

[`PaymentFields`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md).[`receiver`](../../itxn/namespaces/itxn/interfaces/PaymentFields.md#receiver)

***

### rejectVersion?

> `optional` **rejectVersion**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:965](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L965)

Application version for which the txn must reject

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`rejectVersion`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#rejectversion)

***

### rekeyTo?

> `optional` **rekeyTo**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:613](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L613)

32 byte Sender's new AuthAddr

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`rekeyTo`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#rekeyto)

***

### reserve?

> `optional` **reserve**: [`Account`](../type-aliases/Account.md) \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:761](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L761)

32 byte address

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`reserve`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#reserve)

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

Defined in: [itxn.ts:585](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L585)

32 byte address

#### Inherited from

[`ApplicationCallFields`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md).[`sender`](../../itxn/namespaces/itxn/interfaces/ApplicationCallFields.md#sender)

***

### stateProofKey?

> `optional` **stateProofKey**: [`bytes`](../type-aliases/bytes.md)\<`64`\>

Defined in: [itxn.ts:687](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L687)

64 byte state proof public key

#### Inherited from

[`KeyRegistrationFields`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md).[`stateProofKey`](../../itxn/namespaces/itxn/interfaces/KeyRegistrationFields.md#stateproofkey)

***

### total?

> `optional` **total**: [`uint64`](../type-aliases/uint64.md)

Defined in: [itxn.ts:729](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L729)

Total number of units of this asset created

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`total`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#total)

***

### type

> **type**: [`TransactionType`](../enumerations/TransactionType.md)

Defined in: [itxn-compose.ts:33](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn-compose.ts#L33)

***

### unitName?

> `optional` **unitName**: `string` \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:741](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L741)

Unit name of the asset

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`unitName`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#unitname)

***

### url?

> `optional` **url**: `string` \| [`bytes`](../type-aliases/bytes.md)

Defined in: [itxn.ts:749](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L749)

URL

#### Inherited from

[`AssetConfigFields`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md).[`url`](../../itxn/namespaces/itxn/interfaces/AssetConfigFields.md#url)

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

***

### xferAsset?

> `optional` **xferAsset**: [`uint64`](../type-aliases/uint64.md) \| [`Asset`](../type-aliases/Asset.md)

Defined in: [itxn.ts:807](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/itxn.ts#L807)

Asset ID

#### Inherited from

[`AssetTransferFields`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md).[`xferAsset`](../../itxn/namespaces/itxn/interfaces/AssetTransferFields.md#xferasset)
