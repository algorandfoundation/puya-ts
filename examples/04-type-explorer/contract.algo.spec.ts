import { Bytes, Uint64 } from '@algorandfoundation/algorand-typescript'
import { TestExecutionContext } from '@algorandfoundation/algorand-typescript-testing'
import { afterEach, describe, expect, it } from 'vitest'
import { TypeExplorer } from './contract.algo'

describe('TypeExplorer', () => {
  const ctx = new TestExecutionContext()
  afterEach(() => ctx.reset())

  describe('exploreUint64', () => {
    it('returns the sum of two uint64 values', () => {
      const contract = ctx.contract.create(TypeExplorer)
      expect(contract.exploreUint64(3, 5)).toEqual(8n)
    })

    it('handles zero values', () => {
      const contract = ctx.contract.create(TypeExplorer)
      expect(contract.exploreUint64(0, 0)).toEqual(0n)
    })

    it('handles large uint64 values', () => {
      const contract = ctx.contract.create(TypeExplorer)
      expect(contract.exploreUint64(2 ** 32, 1)).toEqual(2n ** 32n + 1n)
    })
  })

  describe('exploreBigUint', () => {
    it('returns the original value after square then sqrt', () => {
      const contract = ctx.contract.create(TypeExplorer)
      expect(contract.exploreBigUint(9)).toEqual(9n)
    })

    it('handles zero', () => {
      const contract = ctx.contract.create(TypeExplorer)
      expect(contract.exploreBigUint(0)).toEqual(0n)
    })

    it('handles one', () => {
      const contract = ctx.contract.create(TypeExplorer)
      expect(contract.exploreBigUint(1)).toEqual(1n)
    })

    it('handles large values', () => {
      const contract = ctx.contract.create(TypeExplorer)
      expect(contract.exploreBigUint(2 ** 32)).toEqual(2n ** 32n)
    })
  })

  describe('exploreBytes', () => {
    it('returns a 32-byte sha256 hash', () => {
      const contract = ctx.contract.create(TypeExplorer)
      const input = Bytes.fromHex('AABB')
      const result = contract.exploreBytes(input)
      expect(result.length).toEqual(32)
    })

    it('returns consistent hash for same input', () => {
      const contract = ctx.contract.create(TypeExplorer)
      const input = Bytes.fromHex('FF')
      const hash1 = contract.exploreBytes(input)
      const hash2 = contract.exploreBytes(input)
      expect(hash1).toEqual(hash2)
    })

    it('returns different hash for different input', () => {
      const contract = ctx.contract.create(TypeExplorer)
      const hash1 = contract.exploreBytes(Bytes.fromHex('AA'))
      const hash2 = contract.exploreBytes(Bytes.fromHex('BB'))
      expect(hash1).not.toEqual(hash2)
    })
  })

  describe('exploreWideMath', () => {
    it('returns low part of addition when no overflow', () => {
      const contract = ctx.contract.create(TypeExplorer)
      expect(contract.exploreWideMath(10, 20)).toEqual(30n)
    })

    it('returns low part when addition overflows uint64', () => {
      const contract = ctx.contract.create(TypeExplorer)
      const max = Uint64(2n ** 64n - 1n)
      // max + 1 overflows: carry=1, low=0
      expect(contract.exploreWideMath(max, 1)).toEqual(0n)
    })

    it('returns low part for large non-overflowing values', () => {
      const contract = ctx.contract.create(TypeExplorer)
      const a = 2 ** 63
      const b = 2 ** 62
      expect(contract.exploreWideMath(a, b)).toEqual(BigInt(a) + BigInt(b))
    })
  })
})
