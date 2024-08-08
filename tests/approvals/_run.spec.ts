import { describe, expect, it } from 'vitest'
import { compile } from '../../src'
import { buildCompileOptions } from '../../src/compile-options'
import { invariant } from '../../src/util'
import { logger } from '../../src/logger'

describe('Approvals', () => {
  const result = compile(
    buildCompileOptions({
      outputAwstJson: false,
      outputAwst: false,
      paths: ['tests/approvals'],
      outDir: '',
    }),
  )
  invariant(result.ast, 'Compilation must result in ast')
  const paths = Object.entries(result.ast ?? {}).map(([path, ast]) => ({
    path,
    ast,
    logs: result.logs.filter((l) => l.sourceLocation?.file === path && ['error', 'fatal'].includes(l.level)),
  }))

  describe.each(paths)('$path', ({ logs }) => {
    it('compiles without errors', () => {
      if (logs.length) {
        expect.fail(`${logs.length} errors during compilation`)
      }
    })
  })
})
