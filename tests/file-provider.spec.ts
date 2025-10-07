import { describe, expect, it } from 'vitest'
import { compile, CompileOptions, LoggingContext } from '../src'
import { Contract } from '../src/awst/nodes'
import { invariant } from '../src/util'
import { AbsolutePath } from '../src/util/absolute-path'

describe('File provider', () => {
  const contractVirtualFile = `
import { Contract } from '@algorandfoundation/algorand-typescript'

class TestContract extends Contract {
  sayHello() {
    return 'Hello'
  }
}
  `

  it('can be overridden to support virtual files', async () => {
    const logging = LoggingContext.create().enterContext()

    const sourceFile = AbsolutePath.resolve({ path: 'tests/virtual-file/test-contract.algo.ts' })

    const result = await compile(
      new CompileOptions({
        filePaths: [
          {
            sourceFile,
            outDir: AbsolutePath.resolve({ path: 'tests/virtual-file/out' }),
          },
        ],
        dryRun: true,
        sourceFileProvider({ readFile, fileExists }) {
          return {
            readFile(fileName) {
              if (fileName === sourceFile.toString()) {
                return contractVirtualFile
              }
              return readFile(fileName)
            },
            fileExists(fileName) {
              return fileName === sourceFile.toString() || fileExists(fileName)
            },
          }
        },
      }),
    )
    expect(logging.hasErrors()).toBeFalsy()
    expect(result.awst?.length).toBe(2)
    const [, contract] = result.awst!
    invariant(contract instanceof Contract, 'AWST should be a contract node')

    expect(contract.name).toBe('TestContract')
  })
})
