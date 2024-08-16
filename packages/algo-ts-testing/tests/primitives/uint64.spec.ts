import { Uint64 } from '@algorandfoundation/algo-ts'
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import { describe, expect, test } from 'vitest'
import appSpecJson from '../artifacts/primitive-ops/data/PrimitiveOpsContract.arc32.json'
import { getAlgorandAppClient, getAvmResult } from '../avm-invoker'
import { MAX_UINT64 } from '../constants'

const logicalOperatorTestSet = [
  [0, 0],
  [0, 1],
  [0, MAX_UINT64],
  [1, 0],
  [1, 1],
  [1, MAX_UINT64],
  [MAX_UINT64, 0],
  [MAX_UINT64, MAX_UINT64]
]

describe('Unit64', async () => {
  const appClient = await getAlgorandAppClient(appSpecJson as AppSpec)

  test.each(logicalOperatorTestSet)('should work with === operator', async (a, b) => {
    const avmResult = await getAvmResult<boolean>(appClient, 'verify_uint64_eq', a, b)
    const result = Uint64(a as bigint) === Uint64(b as bigint)
    expect(result, `for values: ${a}, ${b}`).toBe(avmResult)
  })

  test.each(logicalOperatorTestSet)('should work with !== operator', async (a, b) => {
    const avmResult = await getAvmResult<boolean>(appClient, 'verify_uint64_ne', a, b)
    const result = Uint64(a as bigint) !== Uint64(b as bigint)
    expect(result, `for values: ${a}, ${b}`).toBe(avmResult)
  })

})
