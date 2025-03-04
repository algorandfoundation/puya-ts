import { describe, expect, it } from 'vitest'
import { compile, LoggingContext } from '../src'
import { Contract } from '../src/awst/nodes'
import { CompileOptions } from '../src/options'
import { invariant } from '../src/util'

describe('Virtual files', () => {
  const contractVirtualFile = `
import { Contract } from '@algorandfoundation/algorand-typescript'

class TestContract extends Contract {
  sayHello() {
    return 'Hello'
  }
}
  `

  it('can be compiled as if they existed', async () => {
    const logging = LoggingContext.create().enterContext()

    const result = await compile(
      new CompileOptions({
        filePaths: [
          {
            sourceFile: 'tests/virtual-file/test-contract.algo.ts',
            outDir: 'tests/virtual-file/out',
            fileContents: contractVirtualFile,
          },
        ],
        dryRun: true,
      }),
    )
    expect(logging.hasErrors()).toBeFalsy()
    expect(result.awst?.length).toBe(1)
    const [contract] = result.awst!
    invariant(contract instanceof Contract, 'AWST should be a contract node')

    expect(contract.name).toBe('TestContract')
  })
})
