[**Algorand TypeScript**](../../README.md)

***

[Algorand TypeScript](../../modules.md) / [op](../README.md) / Global

# Variable: Global

> `const` **Global**: `object`

Defined in: [packages/algo-ts/src/op.ts:1522](https://github.com/algorandfoundation/puya-ts/blob/main/packages/algo-ts/src/op.ts#L1522)

## Type declaration

### assetCreateMinBalance

#### Get Signature

> **get** **assetCreateMinBalance**(): [`uint64`](../../index/type-aliases/uint64.md)

The additional minimum balance required to create (and opt-in to) an asset.
Min AVM version: 10

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### assetOptInMinBalance

#### Get Signature

> **get** **assetOptInMinBalance**(): [`uint64`](../../index/type-aliases/uint64.md)

The additional minimum balance required to opt-in to an asset.
Min AVM version: 10

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### callerApplicationAddress

#### Get Signature

> **get** **callerApplicationAddress**(): [`Account`](../../index/type-aliases/Account.md)

The application address of the application that called this application. ZeroAddress if this application is at the top-level. Application mode only.
Min AVM version: 6

##### Returns

[`Account`](../../index/type-aliases/Account.md)

### callerApplicationId

#### Get Signature

> **get** **callerApplicationId**(): [`uint64`](../../index/type-aliases/uint64.md)

The application ID of the application that called this application. 0 if this application is at the top-level. Application mode only.
Min AVM version: 6

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### creatorAddress

#### Get Signature

> **get** **creatorAddress**(): [`Account`](../../index/type-aliases/Account.md)

Address of the creator of the current application. Application mode only.
Min AVM version: 3

##### Returns

[`Account`](../../index/type-aliases/Account.md)

### currentApplicationAddress

#### Get Signature

> **get** **currentApplicationAddress**(): [`Account`](../../index/type-aliases/Account.md)

Address that the current application controls. Application mode only.
Min AVM version: 5

##### Returns

[`Account`](../../index/type-aliases/Account.md)

### currentApplicationId

#### Get Signature

> **get** **currentApplicationId**(): [`Application`](../../index/type-aliases/Application.md)

ID of current application executing. Application mode only.
Min AVM version: 2

##### Returns

[`Application`](../../index/type-aliases/Application.md)

### genesisHash

#### Get Signature

> **get** **genesisHash**(): [`bytes`](../../index/type-aliases/bytes.md)

The Genesis Hash for the network.
Min AVM version: 10

##### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### groupId

#### Get Signature

> **get** **groupId**(): [`bytes`](../../index/type-aliases/bytes.md)

ID of the transaction group. 32 zero bytes if the transaction is not part of a group.
Min AVM version: 5

##### Returns

[`bytes`](../../index/type-aliases/bytes.md)

### groupSize

#### Get Signature

> **get** **groupSize**(): [`uint64`](../../index/type-aliases/uint64.md)

Number of transactions in this atomic transaction group. At least 1
Min AVM version: 1

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### latestTimestamp

#### Get Signature

> **get** **latestTimestamp**(): [`uint64`](../../index/type-aliases/uint64.md)

Last confirmed block UNIX timestamp. Fails if negative. Application mode only.
Min AVM version: 2

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### logicSigVersion

#### Get Signature

> **get** **logicSigVersion**(): [`uint64`](../../index/type-aliases/uint64.md)

Maximum supported version
Min AVM version: 2

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### maxTxnLife

#### Get Signature

> **get** **maxTxnLife**(): [`uint64`](../../index/type-aliases/uint64.md)

rounds
Min AVM version: 1

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### minBalance

#### Get Signature

> **get** **minBalance**(): [`uint64`](../../index/type-aliases/uint64.md)

microalgos
Min AVM version: 1

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### minTxnFee

#### Get Signature

> **get** **minTxnFee**(): [`uint64`](../../index/type-aliases/uint64.md)

microalgos
Min AVM version: 1

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### opcodeBudget

#### Get Signature

> **get** **opcodeBudget**(): [`uint64`](../../index/type-aliases/uint64.md)

The remaining cost that can be spent by opcodes in this program.
Min AVM version: 6

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### payoutsEnabled

#### Get Signature

> **get** **payoutsEnabled**(): `boolean`

Whether block proposal payouts are enabled.
Min AVM version: 11

##### Returns

`boolean`

### payoutsGoOnlineFee

#### Get Signature

> **get** **payoutsGoOnlineFee**(): [`uint64`](../../index/type-aliases/uint64.md)

The fee required in a keyreg transaction to make an account incentive eligible.
Min AVM version: 11

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### payoutsMaxBalance

#### Get Signature

> **get** **payoutsMaxBalance**(): [`uint64`](../../index/type-aliases/uint64.md)

The maximum balance an account can have in the agreement round to receive block payouts in the proposal round.
Min AVM version: 11

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### payoutsMinBalance

#### Get Signature

> **get** **payoutsMinBalance**(): [`uint64`](../../index/type-aliases/uint64.md)

The minimum balance an account must have in the agreement round to receive block payouts in the proposal round.
Min AVM version: 11

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### payoutsPercent

#### Get Signature

> **get** **payoutsPercent**(): [`uint64`](../../index/type-aliases/uint64.md)

The percentage of transaction fees in a block that can be paid to the block proposer.
Min AVM version: 11

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### round

#### Get Signature

> **get** **round**(): [`uint64`](../../index/type-aliases/uint64.md)

Current round number. Application mode only.
Min AVM version: 2

##### Returns

[`uint64`](../../index/type-aliases/uint64.md)

### zeroAddress

#### Get Signature

> **get** **zeroAddress**(): [`Account`](../../index/type-aliases/Account.md)

32 byte address of all zero bytes
Min AVM version: 1

##### Returns

[`Account`](../../index/type-aliases/Account.md)
