import { describe, expect, it } from 'vitest'
import { Arc4ParseError, parseArc4Method, parseArc4Type } from './arc4-signature-parser'
import { invariant } from './index'

describe('arc4 signature parser', () => {
  describe('can parse valid types', () => {
    it.each([
      ['byte'],
      ['byte[]'],
      ['byte[5]'],
      ['bool'],
      ['bool[]'],
      ['bool[12]'],
      ['uint8'],
      ['uint8[]'],
      ['uint8[12]'],
      ['uint16'],
      ['uint16[]'],
      ['uint16[12]'],
      ['uint32'],
      ['uint32[]'],
      ['uint32[12]'],
      ['uint64'],
      ['uint64[]'],
      ['uint64[12]'],
      ['uint128'],
      ['uint128[]'],
      ['uint128[12]'],
      ['uint256'],
      ['uint256[]'],
      ['uint256[12]'],
      ['string'],
      ['string[]'],
      ['string[12]'],
      ['byte[][][]'],
      ['byte[2][2][2]'],
      ['(bool)'],
      ['(bool,string,uint8,(uint16,string[]),bool[])[1][]'],
    ])('%s parses', (arc4TypeString) => {
      const match = parseArc4Type(arc4TypeString)

      expect(match.abiTypeSignature).toBe(arc4TypeString)
    })
  })
  describe('errors on invalid types', () => {
    it.each([
      ['float', "Expecting string 'uint', got 'floa...'", 0],
      ['uint2', 'n must be between 8 and 512, and a multiple of 8', 0],
      ['(uint8,uint2)', 'n must be between 8 and 512, and a multiple of 8', 7],
      ['uint8[', "Expecting character ']', but got end of input.", 6],
      ['uint8]', "Expected end of input but got ']'", 5],
      ['uint8,uint8', "Expected end of input but got ','", 5],
      ['(uint8', 'Tuple has not been closed', 6],
      ['(uint8,bool))', "Expected end of input but got ')'", 12],
    ])('%s returns error %s', (typeString, errorMessage, errorIndex) => {
      try {
        parseArc4Type(typeString)
      } catch (e) {
        invariant(e instanceof Arc4ParseError, 'e must be instance of Arc4ParseError')
        expect(e.message).toBe(errorMessage)
        expect(e.index).toBe(errorIndex)
        return
      }
      expect.fail('Expected error but none was thrown')
    })
  })
})

describe('arc4 method parser', () => {
  describe('can parse valid signatures', () => {
    it.each([
      ['test(uint8)void'],
      ['test()void'],
      ['test(txn,appl,acfg,axfer,keyreg,pay,afrz)void'],
      ['test((uint8))(uint8)'],
      ['test(uint8,uint8)uint8'],
      ['test(application,asset,account,address[])uint8'],
      ['test(uint8[],(uint16))(string,address)'],
      ['test()application'],
      ['test()asset'],
      ['test()account'],
    ])('%s parses', (signature) => {
      const match = parseArc4Method(signature)
      expect(`${match.name}(${match.parameters.map((p) => p.abiTypeSignature).join(',')})${match.returnType.abiTypeSignature}`).toBe(
        signature,
      )
    })
  })

  describe('errors on invalid signatures', () => {
    it.each([
      ['float', "Expecting string '(', but got end of input.", 5],
      ['float()', 'Expected ABI return type, but got end of input.', 7],
      ['test(', 'Expected ABI parameter type, but got end of input.', 5],
      ['test(void)void', "Expected ABI parameter type, got 'void)vo...'", 5],
      ['test()void,void', "Expected end of input but got ','", 10],
      ['t est()void', "Expecting string '(', got ' ...'", 1],
    ])('%s returns error %s', (typeString, errorMessage, errorIndex) => {
      try {
        parseArc4Method(typeString)
      } catch (e) {
        invariant(e instanceof Arc4ParseError, 'e must be instance of Arc4ParseError')
        expect(e.message).toBe(errorMessage)
        expect(e.index).toBe(errorIndex)
        return
      }
      expect.fail('Expected error but none was thrown')
    })
  })
})
