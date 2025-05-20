import { describe, expect, it } from 'vitest'
import { invokeCli } from '../src/util/invoke-cli'

describe('code generated files', () => {
  it('should be not have uncommitted changes', async () => {
    const result = await invokeCli({
      command: 'git',
      args: ['status', 'src', 'packages', '--porcelain'],
    })
    const diffs = result.lines

    if (diffs.length) {
      expect.fail(`There are uncommitted changes. Check you have not manually edited a code generated file: \n\n${diffs.join('\n')}`)
    }
  })
})
