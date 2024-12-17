import { describe, expect, it } from 'vitest'
import { AvmError } from './errors'
import { arrayUtil } from './primitives'

describe('ArrayUtil', () => {
  describe('arrayAt', () => {
    it.each([
      [[1, 2, 3], 0, 1],
      [[1, 2, 3], 1, 2],
      [[1, 2, 3], 2, 3],
      [[1, 2, 3], -1, 3],
      [[1, 2, 3], -2, 2],
      [[1, 2, 3], -3, 1],
      [[1, 2, 3], 4, AvmError],
      [[1, 2, 3], -4, AvmError],
      [new Uint8Array([1, 2, 3]), 0, new Uint8Array([1])],
      [new Uint8Array([1, 2, 3]), 1, new Uint8Array([2])],
      [new Uint8Array([1, 2, 3]), 2, new Uint8Array([3])],
      [new Uint8Array([1, 2, 3]), -1, new Uint8Array([3])],
      [new Uint8Array([1, 2, 3]), -2, new Uint8Array([2])],
      [new Uint8Array([1, 2, 3]), -3, new Uint8Array([1])],
      [new Uint8Array([1, 2, 3]), 4, AvmError],
      [new Uint8Array([1, 2, 3]), -4, AvmError],
    ])('%s.at(%d) results in %s', (theArray, theIndex, theResult) => {
      if (theResult === AvmError) {
        expect(() => arrayUtil.arrayAt(theArray, theIndex)).toThrow(theResult)
      } else {
        expect(arrayUtil.arrayAt(theArray, theIndex)).toEqual(theResult)
      }
    })
  })
  describe('arraySlice', () => {
    it.each([
      [[1, 2, 3], [], [1, 2, 3]],
      [[1, 2, 3], [0], [1, 2, 3]],
      [[1, 2, 3], [1], [2, 3]],
      [[1, 2, 3], [2], [3]],
      [[1, 2, 3], [-1], [3]],
      [[1, 2, 3], [-2], [2, 3]],
      [[1, 2, 3], [-3], [1, 2, 3]],
      [[1, 2, 3], [4], []],
      [[1, 2, 3], [-4], [1, 2, 3]],
    ])('%s.at(%d) results in %s', (theArray, [start, stop], theResult) => {
      expect(arrayUtil.arraySlice(theArray, start, stop)).toEqual(theResult)
    })
    it.each([
      [new Uint8Array([1, 2, 3]), [], new Uint8Array([1, 2, 3])],
      [new Uint8Array([1, 2, 3]), [0], new Uint8Array([1, 2, 3])],
      [new Uint8Array([1, 2, 3]), [1], new Uint8Array([2, 3])],
      [new Uint8Array([1, 2, 3]), [2], new Uint8Array([3])],
      [new Uint8Array([1, 2, 3]), [-1], new Uint8Array([3])],
      [new Uint8Array([1, 2, 3]), [-2], new Uint8Array([2, 3])],
      [new Uint8Array([1, 2, 3]), [-3], new Uint8Array([1, 2, 3])],
      [new Uint8Array([1, 2, 3]), [4], new Uint8Array([])],
      [new Uint8Array([1, 2, 3]), [-4], new Uint8Array([1, 2, 3])],
    ])('%s.at(%d) results in %s', (theArray, [start, stop], theResult) => {
      expect(arrayUtil.arraySlice(theArray, start, stop)).toEqual(theResult)
    })
  })
})
