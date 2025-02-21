import { globSync } from 'glob'
import { rimraf } from 'rimraf'
import { beforeAll, describe, expect, it } from 'vitest'
import { normalisePath } from '../src/util'
import { invokeCli } from '../src/util/invoke-cli'

describe('Approvals', async () => {
  beforeAll(async () => {
    await rimraf('tests/approvals/out')
  })

  const contractFiles = globSync('tests/approvals/*.algo.ts')
    .map((p) => normalisePath(p, process.cwd()))
    .toSorted()

  describe.concurrent.each(contractFiles)('%s', (contractFile) => {
    it.each([
      [
        'Unoptimized',
        [
          '--out-dir',
          'out/[name]/unoptimized',
          '--optimization-level=0',
          '--output-awst-json',
          '--output-awst',
          '--output-arc32',
          '--output-arc56',
        ],
      ],
      ['O1', ['--out-dir', 'out/[name]/o1', '--optimization-level=1', '--no-output-arc32', '--no-output-arc56']],
      ['02', ['--out-dir', 'out/[name]/o2', '--optimization-level=2', '--no-output-arc32', '--no-output-arc56']],
    ])('compiles %s', async (desc, args) => {
      const result = await invokeCli({
        command: 'node_modules/.bin/tsx',
        args: [
          'src/cli.ts',
          'build',
          contractFile,
          '--no-output-source-map',
          '--skip-version-check',
          '--log-level=error',
          '--output-teal',
          '--output-ssa-ir',
          ...args,
        ],
        dontThrowOnNonZeroCode: true,
      })
      if (result.outputLines.length > 0) {
        expect.fail(result.outputLines.join('\n'))
      }
      expect(result.code, 'Response code should be 0').toBe(0)
    })
  })

  it('There should be no differences to committed changes', async () => {
    const result = await invokeCli({
      command: 'git',
      args: ['status', '--porcelain'],
    })
    const diffs = result.outputLines

    if (diffs.length) {
      expect.fail(
        `There are uncommitted changes: \n\n${diffs.slice(0, 5).join('\n')}${diffs.length > 5 ? `\n +${diffs.length - 5} more` : ''}`,
      )
    }
  })
})
