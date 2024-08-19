import { Uint64 } from '@algorandfoundation/algo-ts'
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import { describe, expect, it } from 'vitest'
import { MAX_UINT64 } from '../../src/constants'
import appSpecJson from '../artifacts/primitive-ops/data/PrimitiveOpsContract.arc32.json'
import { getAlgorandAppClient, getAvmResult } from '../avm-invoker'

const asUint64 = (val: bigint | number) => (typeof val === 'bigint') ? Uint64(val) : Uint64(val)

describe('Unit64', async () => {
  const appClient = await getAlgorandAppClient(appSpecJson as AppSpec)

  describe.each([
    [0, 0],
    [0, 1],
    [0, MAX_UINT64],
    [1, 0],
    [1, 1],
    [1, MAX_UINT64],
    [13, 42],
    [MAX_UINT64, MAX_UINT64]
  ])('logical operators', async (a, b) => {
    const uintA = asUint64(a)
    const uintB = asUint64(b)

    it(`${a} === ${b}`, async () => {
      const avmResult = await getAvmResult<boolean>(appClient, 'verify_uint64_eq', a, b)
      let result = uintA === uintB
      expect(result, `for values: ${a}, ${b}`).toBe(avmResult)

      if (typeof a === 'number') {
        result = a === uintB
        expect(result, `for values: ${a}, ${b}`).toBe(avmResult)
      }

      if (typeof b === 'number') {
        result = uintA === b
        expect(result, `for values: ${a}, ${b}`).toBe(avmResult)
      }
    })

    it(`${a} !== ${b}`, async () => {
      const avmResult = await getAvmResult<boolean>(appClient, 'verify_uint64_ne', a, b)
      let result = uintA !== uintB
      expect(result, `for values: ${a}, ${b}`).toBe(avmResult)

      if (typeof a === 'number') {
        result = a !== uintB
        expect(result, `for values: ${a}, ${b}`).toBe(avmResult)
      }

      if (typeof b === 'number') {
        result = uintA !== b
        expect(result, `for values: ${a}, ${b}`).toBe(avmResult)
      }
    })

    it(`${a} < ${b}`, async () => {
      const avmResult = await getAvmResult<boolean>(appClient, 'verify_uint64_lt', a, b)
      let result = uintA < uintB
      expect(result, `for values: ${a}, ${b}`).toBe(avmResult)

      if (typeof a === 'number') {
        result = a < uintB
        expect(result, `for values: ${a}, ${b}`).toBe(avmResult)
      }

      if (typeof b === 'number') {
        result = uintA < b
        expect(result, `for values: ${a}, ${b}`).toBe(avmResult)
      }
    })

    it(`${a} <= ${b}`, async () => {
      const avmResult = await getAvmResult<boolean>(appClient, 'verify_uint64_le', a, b)
      let result = uintA <= uintB
      expect(result, `for values: ${a}, ${b}`).toBe(avmResult)

      if (typeof a === 'number') {
        result = a <= uintB
        expect(result, `for values: ${a}, ${b}`).toBe(avmResult)
      }

      if (typeof b === 'number') {
        result = uintA <= b
        expect(result, `for values: ${a}, ${b}`).toBe(avmResult)
      }
    })

    it(`${a} > ${b}`, async () => {
      const avmResult = await getAvmResult<boolean>(appClient, 'verify_uint64_gt', a, b)
      let result = uintA > uintB
      expect(result, `for values: ${a}, ${b}`).toBe(avmResult)

      if (typeof a === 'number') {
        result = a > uintB
        expect(result, `for values: ${a}, ${b}`).toBe(avmResult)
      }

      if (typeof b === 'number') {
        result = uintA > b
        expect(result, `for values: ${a}, ${b}`).toBe(avmResult)
      }
    })

    it(`${a} >= ${b}`, async () => {
      const avmResult = await getAvmResult<boolean>(appClient, 'verify_uint64_ge', a, b)
      let result = uintA >= uintB
      expect(result, `for values: ${a}, ${b}`).toBe(avmResult)

      if (typeof a === 'number') {
        result = a >= uintB
        expect(result, `for values: ${a}, ${b}`).toBe(avmResult)
      }

      if (typeof b === 'number') {
        result = uintA >= b
        expect(result, `for values: ${a}, ${b}`).toBe(avmResult)
      }
    })
  })

  describe.each([
    [0, 0],
    [0, MAX_UINT64],
    [MAX_UINT64, 0],
    [1, 0],
    [0, 1],
    [1, 1],
    [13, 42],
    [1, MAX_UINT64 - 1n],
    [MAX_UINT64 - 1n, 1],
  ])('addition', async (a, b) => {
    it(`${a} + ${b}`, async () => {
      const avmResult = await getAvmResult<bigint>(appClient, 'verify_uint64_add', a, b)
      let result = asUint64(a) + asUint64(b)
      expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)

      if (typeof a === 'number') {
        result = a + asUint64(b)
        expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)
      }

      if (typeof b === 'number') {
        result = asUint64(a) + b
        expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)
      }
    })
  })

  describe.each([
    [1, MAX_UINT64],
    [MAX_UINT64, 1],
    [MAX_UINT64, MAX_UINT64],
  ])('addition overflow', async (a, b) => {
    it(`${a} + ${b}`, async () => {
      await expect(getAvmResult<bigint>(appClient, 'verify_uint64_add', a, b)).rejects.toThrow('+ overflowed')

      expect(() => asUint64(a) + asUint64(b)).toThrow('Uint64 over or underflow')

      if (typeof a === 'number') {
        expect(() => a + asUint64(b)).toThrow('Uint64 over or underflow')
      }

      if (typeof b === 'number') {
        expect(() => asUint64(a) + b).toThrow('Uint64 over or underflow')
      }
    })
  })

  describe.each([
    [0, 0],
    [1, 0],
    [1, 1],
    [42, 13],
    [MAX_UINT64, 0],
    [MAX_UINT64, 1],
    [MAX_UINT64, MAX_UINT64],
  ])('subtraction', async (a, b) => {
    it(`${a} - ${b}`, async () => {
      const avmResult = await getAvmResult<bigint>(appClient, 'verify_uint64_sub', a, b)
      let result = asUint64(a) - asUint64(b)
      expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)

      if (typeof a === 'number') {
        result = a - asUint64(b)
        expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)
      }

      if (typeof b === 'number') {
        result = asUint64(a) - b
        expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)
      }
    })
  })

  describe.each([
    [0, 1],
    [1, 2],
    [13, 42],
    [0, MAX_UINT64],
    [1, MAX_UINT64]
  ])('subtraction underflow', async (a, b) => {
    it(`${a} - ${b}`, async () => {
      await expect(getAvmResult<bigint>(appClient, 'verify_uint64_sub', a, b)).rejects.toThrow('- would result negative')

      expect(() => asUint64(a) - asUint64(b)).toThrow('Uint64 over or underflow')

      if (typeof a === 'number') {
        expect(() => a - asUint64(b)).toThrow('Uint64 over or underflow')
      }

      if (typeof b === 'number') {
        expect(() => asUint64(a) - b).toThrow('Uint64 over or underflow')
      }
    })
  })

  describe.each([
    [0, 0],
    [0, 1],
    [42, 13],
    [MAX_UINT64, 0],
    [MAX_UINT64, 1],
  ])('multiplication', async (a, b) => {
    it(`${a} * ${b}`, async () => {
      const avmResult = await getAvmResult<bigint>(appClient, 'verify_uint64_mul', a, b)
      let result = asUint64(a) * asUint64(b)
      expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)

      if (typeof a === 'number') {
        result = a * asUint64(b)
        expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)
      }

      if (typeof b === 'number') {
        result = asUint64(a) * b
        expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)
      }
    })
  })

  describe.each([
    [MAX_UINT64, 2],
    [MAX_UINT64, MAX_UINT64],
    [MAX_UINT64 / 2n, 3],
  ])('multiplication overflow', async (a, b) => {
    it(`${a} * ${b}`, async () => {
      await expect(getAvmResult<bigint>(appClient, 'verify_uint64_mul', a, b)).rejects.toThrow('* overflowed')

      expect(() => asUint64(a) * asUint64(b)).toThrow('Uint64 over or underflow')

      if (typeof a === 'number') {
        expect(() => a * asUint64(b)).toThrow('Uint64 over or underflow')
      }

      if (typeof b === 'number') {
        expect(() => asUint64(a) * b).toThrow('Uint64 over or underflow')
      }
    })
  })

  describe.each([
    [0, 1],
    [1, 1],
    [42, 13],
    [0, MAX_UINT64],
    [1, MAX_UINT64],
    [MAX_UINT64, MAX_UINT64]
  ])('division', async (a, b) => {
    it(`${a} / ${b}`, async () => {
      const avmResult = await getAvmResult<bigint>(appClient, 'verify_uint64_div', a, b)
      let result = asUint64(a) / asUint64(b)
      expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)

      if (typeof a === 'number') {
        result = a / asUint64(b)
        expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)
      }

      if (typeof b === 'number') {
        result = asUint64(a) / b
        expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)
      }
    })
  })

  describe.each([
    [0, 0],
    [1, 0],
    [MAX_UINT64, 0]
  ])('division by zero', async (a, b) => {
    it(`${a} / ${b}`, async () => {
      await expect(getAvmResult<bigint>(appClient, 'verify_uint64_div', a, b)).rejects.toThrow('/ 0')

      expect(() => asUint64(a) / asUint64(b)).toThrow('Division by zero')

      if (typeof a === 'number') {
        expect(() => a / asUint64(b)).toThrow('Division by zero')
      }

      expect(() => asUint64(a) / b).toThrow('Division by zero')
    })
  })

  describe.each([
    [0, 1],
    [1, 1],
    [42, 13],
    [0, MAX_UINT64],
    [1, MAX_UINT64],
    [MAX_UINT64, MAX_UINT64]
  ])('modulo', async (a, b) => {
    it(`${a} % ${b}`, async () => {
      const avmResult = await getAvmResult<bigint>(appClient, 'verify_uint64_mod', a, b)
      let result = asUint64(a) % asUint64(b)
      expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)

      if (typeof a === 'number') {
        result = a % asUint64(b)
        expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)
      }

      if (typeof b === 'number') {
        result = asUint64(a) % b
        expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)
      }
    })
  })

  describe.each([
    [0, 0],
    [1, 0],
    [MAX_UINT64, 0]
  ])('modulo by zero', async (a, b) => {
    it(`${a} % ${b}`, async () => {
      await expect(getAvmResult<bigint>(appClient, 'verify_uint64_mod', a, b)).rejects.toThrow('% 0')

      expect(() => asUint64(a) % asUint64(b)).toThrow('Division by zero')

      if (typeof a === 'number') {
        expect(() => a % asUint64(b)).toThrow('Division by zero')
      }

      expect(() => asUint64(a) % b).toThrow('Division by zero')
    })
  })

  describe.each([
    [0, 1],
    [1, 1],
    [1, 0],
    [0, MAX_UINT64],
    [1, MAX_UINT64],
    [MAX_UINT64, 0],
    [MAX_UINT64, 1],
    [2 ** 31, 2]
  ])('pow', async (a, b) => {
    it(`${a} ** ${b}`, async () => {
      const avmResult = await getAvmResult<bigint>(appClient, 'verify_uint64_pow', a, b)
      let result = asUint64(a) ** asUint64(b)
      expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)

      if (typeof a === 'number') {
        result = a ** asUint64(b)
        expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)
      }

      if (typeof b === 'number') {
        result = asUint64(a) ** b
        expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)
      }
    })
  })

  describe('pow undefined', async () => {
    it('0 ** 0', async () => {
      const a = 0, b = 0
      await expect(getAvmResult<bigint>(appClient, 'verify_uint64_pow', a, b)).rejects.toThrow('0^0 is undefined')
      expect(() => asUint64(a) ** asUint64(b)).toThrow('0 ** 0 is undefined')
    })
  })

  describe.each([
    [MAX_UINT64, 2],
    [2, 64],
    [2 ** 32, 32]
  ])('pow overflow', async (a, b) => {
    it(`${a} ** ${b}`, async () => {
      await expect(getAvmResult<bigint>(appClient, 'verify_uint64_pow', a, b)).rejects.toThrow(/\d+\^\d+ overflow/)

      expect(() => asUint64(a) ** asUint64(b)).toThrow('Uint64 over or underflow')

      if (typeof a === 'number') {
        expect(() => a ** asUint64(b)).toThrow('Uint64 over or underflow')
      }

      if (typeof b === 'number') {
        expect(() => asUint64(a) ** b).toThrow('Uint64 over or underflow')
      }
    })
  })

  describe.each([
    [0, 0],
    [MAX_UINT64, MAX_UINT64],
    [0, MAX_UINT64],
    [MAX_UINT64, 0],
    [42, MAX_UINT64],
    [MAX_UINT64, 42]
  ])('bitwise operations', async (a, b) => {
    const uintA = asUint64(a)
    const uintB = asUint64(b)
    it(`${a} & ${b}`, async () => {
      const avmResult = await getAvmResult<bigint>(appClient, 'verify_uint64_and', a, b)
      let result = uintA & uintB
      expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)

      if (typeof a === 'number') {
        result = a & uintB
        expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)
      }

      if (typeof b === 'number') {
        result = uintA & b
        expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)
      }
    })

    it(`${a} | ${b}`, async () => {
      const avmResult = await getAvmResult<bigint>(appClient, 'verify_uint64_or', a, b)
      let result = uintA | uintB
      expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)

      if (typeof a === 'number') {
        result = a | uintB
        expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)
      }

      if (typeof b === 'number') {
        result = uintA | b
        expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)
      }
    })

    it(`${a} ^ ${b}`, async () => {
      const avmResult = await getAvmResult<bigint>(appClient, 'verify_uint64_xor', a, b)
      let result = uintA ^ uintB
      expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)

      if (typeof a === 'number') {
        result = a ^ uintB
        expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)
      }

      if (typeof b === 'number') {
        result = uintA ^ b
        expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)
      }
    })
  })

  describe.each([
    0,
    1,
    42,
    MAX_UINT64
  ])('bitwise not', async (a) => {
    it(`~${a}`, async () => {
      const avmResult = await getAvmResult<bigint>(appClient, 'verify_uint64_not', a)
      let result = ~asUint64(a)
      expect(result.valueOf(), `for value: ${a}`).toBe(avmResult)
    })
  })

  describe.each([
    [0, 0],
    [1, 0],
    [1, 1],
    [1, 63],
    [42, 42],
    [MAX_UINT64, 0],
    [MAX_UINT64, 1],
    [MAX_UINT64, 63],
  ])('shift operations', async (a, b) => {
    const uintA = asUint64(a)
    const uintB = asUint64(b)
    it(`${a} << ${b}`, async () => {
      const avmResult = await getAvmResult<bigint>(appClient, 'verify_uint64_lshift', a, b)
      let result = uintA << uintB
      expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)

      if (typeof a === 'number') {
        result = a << uintB
        expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)
      }

      if (typeof b === 'number') {
        result = uintA << b
        expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)
      }
    })

    it(`${a} >> ${b}`, async () => {
      const avmResult = await getAvmResult<bigint>(appClient, 'verify_uint64_rshift', a, b)
      let result = uintA >> uintB
      expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)

      if (typeof a === 'number') {
        result = a >> uintB
        expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)
      }

      if (typeof b === 'number') {
        result = uintA >> b
        expect(result.valueOf(), `for values: ${a}, ${b}`).toBe(avmResult)
      }
    })
  })

  describe('invalid shift operations', async () => {
    const a = 0, b = 64
    const uintA = asUint64(a)
    const uintB = asUint64(b)
    it('0 << 64', async () => {
      await expect(getAvmResult<bigint>(appClient, 'verify_uint64_lshift', a, b)).rejects.toThrow('arg too big, (64)')
      expect(() => uintA << uintB).toThrow('expected shift <= 63')
      expect(() => a << uintB).toThrow('expected shift <= 63')
      expect(() => uintA << b).toThrow('expected shift <= 63')
      expect(() => Uint64(MAX_UINT64 + 1n) << Uint64(1n)).toThrow('Uint64 over or underflow')
    })

    it('0 >> 64', async () => {
      await expect(getAvmResult<bigint>(appClient, 'verify_uint64_rshift', a, b)).rejects.toThrow('arg too big, (64)')
      expect(() => uintA >> uintB).toThrow('expected shift <= 63')
      expect(() => a >> uintB).toThrow('expected shift <= 63')
      expect(() => uintA >> b).toThrow('expected shift <= 63')
      expect(() => Uint64(MAX_UINT64 + 1n) >> Uint64(1n)).toThrow('Uint64 over or underflow')
    })
  })

  describe.each([
    MAX_UINT64 + 1n,
    MAX_UINT64 * 2n,
  ])('value too big', (a) => {
    it(`${a}`, () => {
      expect(() => Uint64(a)).toThrow('Uint64 over or underflow')
    })
  })

  describe.each([
    -1,
    -MAX_UINT64,
    -MAX_UINT64 * 2n
  ])('value too small', (a) => {
    it(`${a}`, () => {
      expect(() => asUint64(a)).toThrow('Uint64 over or underflow')
    })
  })
})