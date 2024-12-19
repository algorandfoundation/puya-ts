import { describe, expect, it } from 'vitest'
import { BigUint, Bytes, Uint64 } from '../src'
import { AlgoTsPrimitiveCls, BigUintCls, BytesCls, Uint64Cls } from '../src/impl/primitives'

describe('AlgoTsPrimitives', () => {
  describe.each([
    [Bytes(''), BytesCls],
    [Bytes('123'), AlgoTsPrimitiveCls],
    [Uint64(1), Uint64Cls],
    [Uint64(43), AlgoTsPrimitiveCls],
    [BigUint(1), BigUintCls],
    [BigUint(43), AlgoTsPrimitiveCls],
  ])('Primitive value is instanceOf implementation class', (value, instanceType) => {
    it(`${JSON.stringify(value)} instanceof ${instanceType.name}`, () => {
      expect(value).toBeInstanceOf(instanceType)
    })
  })
  describe.each([
    [Bytes(''), Uint64Cls],
    [Bytes('123'), BigUintCls],
    [Uint64(1), BytesCls],
    [Uint64(43), BigUintCls],
    [BigUint(1), BytesCls],
    [BigUint(43), Uint64Cls],
  ])('Primitive value is not instanceOf unrelated class', (value, instanceType) => {
    it(`${JSON.stringify(value)} not instanceof ${instanceType.name}`, () => {
      expect(value).not.toBeInstanceOf(instanceType)
    })
  })
})
