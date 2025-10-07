import { describe, expect, it } from 'vitest'
import { determineOutDir } from './determine-out-dir'

describe('determineOutDir', () => {
  it.each([
    // Relative input path with explicit ./
    ['./examples/*', 'examples/hello/contract.algo.ts', 'out', 'examples/hello/out'],
    ['./examples/*', 'examples/hello/nested/contract.algo.ts', 'out', 'examples/hello/out/nested'],
    ['./examples/**', 'examples/hello/nested/contract.algo.ts', 'out', 'examples/hello/nested/out'],
    ['./examples', 'examples/hello/contract.algo.ts', 'out', 'examples/out/hello'],
    ['./examples/hello', 'examples/hello/contract.algo.ts', 'out', 'examples/hello/out'],
    ['./examples/hello/contract.algo.ts', 'examples/hello/contract.algo.ts', 'out', 'examples/hello/out'],
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
    ['examples/*', 'examples/hello/contract.algo.ts', 'c:/out', 'C:/out'],
    ['examples/*', 'examples/hello/nested/contract.algo.ts', 'c:/out', 'C:/out/nested'],
    ['examples/**', 'examples/hello/nested/contract.algo.ts', 'c:/out', 'C:/out'],
    ['examples', 'examples/hello/contract.algo.ts', 'c:/out', 'C:/out/hello'],
    ['examples/hello', 'examples/hello/contract.algo.ts', 'c:/out', 'C:/out'],
    ['examples/hello/contract.algo.ts', 'examples/hello/contract.algo.ts', 'c:/out', 'C:/out'],
    // Unix absolute outDir
    ['examples/*', 'examples/hello/contract.algo.ts', '/out', '/out'],
    ['examples/*', 'examples/hello/nested/contract.algo.ts', '/out', '/out/nested'],
    ['examples/**', 'examples/hello/nested/contract.algo.ts', '/out', '/out'],
    ['examples', 'examples/hello/contract.algo.ts', '/out', '/out/hello'],
    ['examples/hello', 'examples/hello/contract.algo.ts', '/out', '/out'],
    ['examples/hello/contract.algo.ts', 'examples/hello/contract.algo.ts', '/out', '/out'],

    // Dot paths
    ['.', 'examples/hello/contract.algo.ts', 'out', 'out/examples/hello'],
    ['./', 'examples/hello/contract.algo.ts', 'out', 'out/examples/hello'],

    // Unix Absolute inputs
    ['/users/bob/src/', '/users/bob/src/contract.algo.ts', 'out', '/users/bob/src/out'],
  ])('$2 relative to $0 given file $1 results in $3', (inputPath, sourceFile, outDir, result) => {
    const calculatedOutDir = determineOutDir(inputPath, sourceFile, outDir)
    expect(calculatedOutDir).toBe(result)
  })
})
