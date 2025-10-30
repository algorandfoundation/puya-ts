import pathe from 'pathe'
import { describe, expect, it } from 'vitest'
import { files } from '../scripts/code-gen'
import { invokeCli } from '../src/util/invoke-cli'

describe('code generated files', () => {
  it('should be not have uncommitted changes', async () => {
    const filePaths = Object.values(files).flatMap((f) => (f.disabled ? [] : pathe.join(f.projectRoot, f.outPath)))

    const result = await invokeCli({
      command: 'git',
      args: ['status', ...filePaths, '--porcelain'],
    })
    const diffs = result.lines

    if (diffs.length) {
      expect.fail(`There are uncommitted changes. Check you have not manually edited a code generated file: \n\n${diffs.join('\n')}`)
    }
  })
})
