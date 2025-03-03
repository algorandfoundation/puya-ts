import { describe, expect, test } from 'vitest'
import { comparePuyaVersion, VersionCompareVerdict } from '../src/puya/check-puya-version'

describe('The puya version available for testing', () => {
  test('must match the target version', async () => {
    const result = await comparePuyaVersion('puya', false)

    expect(result.found).toBe(result.target)
    expect(result.verdict, 'Compare version must be exact match').toBe(VersionCompareVerdict.ExactMatch)
  })
})
