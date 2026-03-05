import { TestExecutionContext } from '@algorandfoundation/algorand-typescript-testing'
import { afterEach, describe, expect, it } from 'vitest'
import { ArrayPlayground } from './contract.algo'

describe('ArrayPlayground', () => {
  const ctx = new TestExecutionContext()
  afterEach(() => ctx.reset())

  describe('exploreNativeArray', () => {
    it('creates array, pushes, pops, and returns b + c', () => {
      const contract = ctx.contract.create(ArrayPlayground)
      // arr[0] set to 0, so total = 0 + b + c = b + c
      expect(contract.exploreNativeArray(10, 20, 30)).toEqual(50n)
    })

    it('handles zero values', () => {
      const contract = ctx.contract.create(ArrayPlayground)
      expect(contract.exploreNativeArray(0, 0, 0)).toEqual(0n)
    })

    it('handles large values', () => {
      const contract = ctx.contract.create(ArrayPlayground)
      expect(contract.exploreNativeArray(1, 2 ** 32, 2 ** 32)).toEqual(2n ** 32n * 2n)
    })
  })

  describe('exploreFixedArray', () => {
    it('returns sum with mutated element', () => {
      const contract = ctx.contract.create(ArrayPlayground)
      // fixed = [x, y, 100, 20] (element 2 mutated from 10 to 100)
      // total = x + y + 100 + 20
      expect(contract.exploreFixedArray(5, 15)).toEqual(140n)
    })

    it('handles zero inputs', () => {
      const contract = ctx.contract.create(ArrayPlayground)
      // total = 0 + 0 + 100 + 20 = 120
      expect(contract.exploreFixedArray(0, 0)).toEqual(120n)
    })
  })

  describe('exploreReferenceArray', () => {
    it('builds array 0..n-1, pops last, sums rest', () => {
      const contract = ctx.contract.create(ArrayPlayground)
      // ra = [0,1,2,3,4], pop → [0,1,2,3], sum = 6
      expect(contract.exploreReferenceArray(5)).toEqual(6n)
    })

    it('handles n=1 (single element popped, empty sum)', () => {
      const contract = ctx.contract.create(ArrayPlayground)
      // ra = [0], pop → [], sum = 0
      expect(contract.exploreReferenceArray(1)).toEqual(0n)
    })

    it('handles n=2', () => {
      const contract = ctx.contract.create(ArrayPlayground)
      // ra = [0,1], pop → [0], sum = 0
      expect(contract.exploreReferenceArray(2)).toEqual(0n)
    })

    it('handles larger n', () => {
      const contract = ctx.contract.create(ArrayPlayground)
      // ra = [0..9], pop → [0..8], sum = 0+1+...+8 = 36
      expect(contract.exploreReferenceArray(10)).toEqual(36n)
    })
  })

  describe('exploreClone', () => {
    it('returns original value unchanged after clone mutation', () => {
      const contract = ctx.contract.create(ArrayPlayground)
      expect(contract.exploreClone(42, 7)).toEqual(42n)
    })
  })

  describe('exploreUrange', () => {
    it('returns 18 from stepped urange(0, 10, 3)', () => {
      const contract = ctx.contract.create(ArrayPlayground)
      expect(contract.exploreUrange()).toEqual(18n)
    })
  })

  describe('exploreEntries', () => {
    it('returns sum of all values via .entries()', () => {
      const contract = ctx.contract.create(ArrayPlayground)
      expect(contract.exploreEntries(10, 20, 30)).toEqual(60n)
    })

    it('handles zero values', () => {
      const contract = ctx.contract.create(ArrayPlayground)
      expect(contract.exploreEntries(0, 0, 0)).toEqual(0n)
    })

    it('handles large values', () => {
      const contract = ctx.contract.create(ArrayPlayground)
      expect(contract.exploreEntries(2 ** 32, 2 ** 32, 2 ** 32)).toEqual(2n ** 32n * 3n)
    })
  })
})
