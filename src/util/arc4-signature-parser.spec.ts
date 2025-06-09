import { describe, expect, it } from 'vitest'
import { SourceLocation } from '../awst/source-location'
import { getABITypeName } from '../awst_build/arc4-util'
import { Arc4ParseError, parseArc4Type } from './arc4-signature-parser'
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
      const parsedName = getABITypeName(match, 'in', SourceLocation.None)
      expect(parsedName).toBe(arc4TypeString)
    })
  })
  describe('errors on invalid types', () => {
    it.each([
      ['float', "Expecting string 'uint', got 'floa...'", 0],
      ['uint2', 'n must be between 8 and 512, and a multiple of 8', 0],
      ['(uint8,uint2)', 'n must be between 8 and 512, and a multiple of 8', 7],
      ['uint8[', "Expecting character ']', but got end of input.", 6],
      ['uint8]', "Expecting ',', '[', or ')', but got ]", 6],
      ['uint8,uint8', 'Signature contained more than one type. Wrap multiple types in parentheses to declare a tuple type', 0],
      ['(uint8', 'Tuple has not been closed', 6],
      ['(uint8,bool))', "Char ')' has no matching opening '('", 13],
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
