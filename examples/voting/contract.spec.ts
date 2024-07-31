import { describe } from 'vitest'
import { VotingRoundApp } from './contract.algo'
import { uint64, bytes, arc4 } from '@algorandfoundation/algo-ts'
import { AnyFunction, DeliberateAny } from '../../src/typescript-helpers'

type PrimitiveFor<T> = T extends string
  ? string
  : T extends uint64
    ? number | bigint
    : T extends bytes
      ? string | Uint8Array
      : T extends arc4.UintN<DeliberateAny>
        ? number | bigint
        : T extends arc4.DynamicArray<infer TItem>
          ? Array<PrimitiveFor<TItem>>
          : never
type MapParams<T extends [...DeliberateAny[]]> = {
  [Index in keyof T]: PrimitiveFor<T[Index]>
} & { length: T['length'] }
type MappedFunc<T extends AnyFunction> = (...args: MapParams<Parameters<T>>) => { returnValue: ReturnType<T>; logs: string[] }

type ContractProxy<T> = {
  [key in keyof T]: T[key] extends AnyFunction ? MappedFunc<T[key]> : never
}

describe('Voting contract', () => {
  const proxy: ContractProxy<VotingRoundApp> = {} as ContractProxy<VotingRoundApp>
  describe('When contract is created', () => {
    const { returnValue, logs } = proxy.create('Hello', 'abc', 'ipfs://', 10, 40, [1, 2, 3, 4], 4, '')
    /*
     voteId: string,
    snapshotPublicKey: bytes,
    metadataIpfsCid: string,
    startTime: uint64,
    endTime: uint64,
    optionCounts: VoteIndexArray,
    quorum: uint64,
    nftImageUrl: string,
     */
  })
})
