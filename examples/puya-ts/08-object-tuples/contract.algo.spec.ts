import { TestExecutionContext } from '@algorandfoundation/algorand-typescript-testing'
import { afterEach, describe, expect, it } from 'vitest'
import { ObjectTuples } from './contract.algo'

describe('ObjectTuples', () => {
  const ctx = new TestExecutionContext()
  afterEach(() => ctx.reset())

  function createContract() {
    const contract = ctx.contract.create(ObjectTuples)
    contract.createApplication()
    return contract
  }

  describe('add', () => {
    it('adds two vectors', () => {
      const contract = createContract()
      const result = contract.add({ x: 3, y: 4 }, { x: 10, y: 20 })
      expect(result.x).toEqual(13n)
      expect(result.y).toEqual(24n)
    })

    it('adds zero vectors', () => {
      const contract = createContract()
      const result = contract.add({ x: 0, y: 0 }, { x: 0, y: 0 })
      expect(result.x).toEqual(0n)
      expect(result.y).toEqual(0n)
    })
  })

  describe('destructureExample', () => {
    it('returns sum of x and y', () => {
      const contract = createContract()
      expect(contract.destructureExample({ x: 5, y: 7 })).toEqual(12n)
    })

    it('handles zero', () => {
      const contract = createContract()
      expect(contract.destructureExample({ x: 0, y: 0 })).toEqual(0n)
    })
  })

  describe('destructuredParam', () => {
    it('returns product of x and y', () => {
      const contract = createContract()
      expect(contract.destructuredParam({ x: 6, y: 8 })).toEqual(48n)
    })

    it('returns zero when either is zero', () => {
      const contract = createContract()
      expect(contract.destructuredParam({ x: 0, y: 100 })).toEqual(0n)
    })
  })

  describe('segmentLength', () => {
    it('returns squared distance of segment', () => {
      const contract = createContract()
      // dx=7, dy=4 → 49+16=65
      const result = contract.segmentLength({
        start: { x: 1, y: 2 },
        end: { x: 8, y: 6 },
      })
      expect(result).toEqual(65n)
    })

    it('returns zero for zero-length segment', () => {
      const contract = createContract()
      const result = contract.segmentLength({
        start: { x: 5, y: 5 },
        end: { x: 5, y: 5 },
      })
      expect(result).toEqual(0n)
    })
  })

  describe('saveVector / getSavedVector', () => {
    it('saves and retrieves a vector from state', () => {
      const contract = createContract()
      contract.saveVector({ x: 42, y: 99 })
      const saved = contract.getSavedVector()
      expect(saved.x).toEqual(42n)
      expect(saved.y).toEqual(99n)
    })

    it('initial saved vector is zero', () => {
      const contract = createContract()
      const saved = contract.getSavedVector()
      expect(saved.x).toEqual(0n)
      expect(saved.y).toEqual(0n)
    })
  })

  describe('saveSegment / getSavedSegment', () => {
    it('saves and retrieves a segment from state', () => {
      const contract = createContract()
      contract.saveSegment({ start: { x: 1, y: 2 }, end: { x: 3, y: 4 } })
      const saved = contract.getSavedSegment()
      expect(saved.start.x).toEqual(1n)
      expect(saved.start.y).toEqual(2n)
      expect(saved.end.x).toEqual(3n)
      expect(saved.end.y).toEqual(4n)
    })
  })

  describe('testCopyAndMutate', () => {
    it('returns mutated copy with new x', () => {
      const contract = createContract()
      const result = contract.testCopyAndMutate({ x: 10, y: 20 }, 99)
      expect(result.x).toEqual(99n)
      expect(result.y).toEqual(20n)
    })
  })

  describe('testSpread', () => {
    it('returns a copy with same fields', () => {
      const contract = createContract()
      const result = contract.testSpread({ x: 7, y: 13 })
      expect(result.x).toEqual(7n)
      expect(result.y).toEqual(13n)
    })
  })

  describe('magnitudeSquared', () => {
    it('returns x*x + y*y', () => {
      const contract = createContract()
      // 3*3 + 4*4 = 25
      expect(contract.magnitudeSquared({ x: 3, y: 4 })).toEqual(25n)
    })

    it('returns zero for zero vector', () => {
      const contract = createContract()
      expect(contract.magnitudeSquared({ x: 0, y: 0 })).toEqual(0n)
    })
  })

  describe('createLabeledPoint', () => {
    it('creates a labeled point with all fields', () => {
      const contract = createContract()
      const result = contract.createLabeledPoint('origin', 0, 0)
      expect(result.label).toEqual('origin')
      expect(result.x).toEqual(0n)
      expect(result.y).toEqual(0n)
    })

    it('preserves label and coordinates', () => {
      const contract = createContract()
      const result = contract.createLabeledPoint('target', 100, 200)
      expect(result.label).toEqual('target')
      expect(result.x).toEqual(100n)
      expect(result.y).toEqual(200n)
    })
  })

  describe('getLabel', () => {
    it('extracts label from a LabeledPoint', () => {
      const contract = createContract()
      expect(contract.getLabel({ label: 'hello', x: 1, y: 2 })).toEqual('hello')
    })
  })
})
