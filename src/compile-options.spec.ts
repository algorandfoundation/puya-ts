import os from 'os'
import { describe, expect, it } from 'vitest'
import { determineOutDir } from './compile-options'

describe('determineOutDir', () => {
  const isWindows = os.platform() === 'win32'
  it.each([
    // Relative outDir
    ['examples/*', 'examples/hello/contract.algo.ts', 'out', 'examples/hello/out'],
    ['examples/*', 'examples/hello/nested/contract.algo.ts', 'out', 'examples/hello/out/nested'],
    ['examples/**', 'examples/hello/nested/contract.algo.ts', 'out', 'examples/hello/nested/out'],
    ['examples', 'examples/hello/contract.algo.ts', 'out', 'examples/out/hello'],
    ['examples/hello', 'examples/hello/contract.algo.ts', 'out', 'examples/hello/out'],
    ['examples/hello/contract.algo.ts', 'examples/hello/contract.algo.ts', 'out', 'examples/hello/out'],
    // Alternative relative outDir
    ['examples/*', 'examples/hello/contract.algo.ts', './out', 'examples/hello/out'],
    ['examples/*', 'examples/hello/nested/contract.algo.ts', './out', 'examples/hello/out/nested'],
    ['examples/**', 'examples/hello/nested/contract.algo.ts', './out', 'examples/hello/nested/out'],
    ['examples', 'examples/hello/contract.algo.ts', './out', 'examples/out/hello'],
    ['examples/hello', 'examples/hello/contract.algo.ts', './out', 'examples/hello/out'],
    ['examples/hello/contract.algo.ts', 'examples/hello/contract.algo.ts', './out', 'examples/hello/out'],
    // Windows absolute outDir
    ['examples/*', 'examples/hello/contract.algo.ts', 'c:/out', isWindows ? 'c:/out' : 'examples/hello/c:/out'],
    ['examples/*', 'examples/hello/nested/contract.algo.ts', 'c:/out', isWindows ? 'c:/out/nested' : 'examples/hello/c:/out/nested'],
    ['examples/**', 'examples/hello/nested/contract.algo.ts', 'c:/out', isWindows ? 'c:/out' : 'examples/hello/nested/c:/out'],
    ['examples', 'examples/hello/contract.algo.ts', 'c:/out', isWindows ? 'c:/out/hello' : 'examples/c:/out/hello'],
    ['examples/hello', 'examples/hello/contract.algo.ts', 'c:/out', isWindows ? 'c:/out' : 'examples/hello/c:/out'],
    ['examples/hello/contract.algo.ts', 'examples/hello/contract.algo.ts', 'c:/out', isWindows ? 'c:/out' : 'examples/hello/c:/out'],
    // Unix absolute outDir
    ['examples/*', 'examples/hello/contract.algo.ts', '/out', '/out'],
    ['examples/*', 'examples/hello/nested/contract.algo.ts', '/out', '/out/nested'],
    ['examples/**', 'examples/hello/nested/contract.algo.ts', '/out', '/out'],
    ['examples', 'examples/hello/contract.algo.ts', '/out', '/out/hello'],
    ['examples/hello', 'examples/hello/contract.algo.ts', '/out', '/out'],
    ['examples/hello/contract.algo.ts', 'examples/hello/contract.algo.ts', '/out', '/out'],
  ])('returns the correct out dir', (inputPath, sourceFile, outDir, result) => {
    const calculatedOutDir = determineOutDir(inputPath, sourceFile, outDir)
    expect(calculatedOutDir).toBe(result)
  })
})
