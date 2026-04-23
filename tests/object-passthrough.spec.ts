import { mkdtempSync, readFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { describe, expect, it } from 'vitest'
import { compile, CompileOptions, processInputPaths } from '../src'
import { LoggingContext } from '../src/logger'

describe('object-passthrough: interfaces differing only in description', async () => {
  it('produces identical approval bytecode for mismatched and same return-type contracts', async () => {
    const tempOut = mkdtempSync(join(tmpdir(), 'op-passthrough-'))
    const logCtx = LoggingContext.create()
    await logCtx.run(() => {
      const filePaths = processInputPaths({ paths: ['tests/approvals/object-passthrough.algo.ts'], outDir: tempOut })
      return compile(
        new CompileOptions({
          filePaths,
          skipVersionCheck: true,
          outputBytecode: true,
        }),
      )
    })

    const sameBin = new Uint8Array(readFileSync(join(tempOut, 'DescSameContract.approval.bin')))
    const fieldDocMismatchBin = new Uint8Array(readFileSync(join(tempOut, 'FieldDocMismatchContract.approval.bin')))
    const typeLevelDocMismatchBin = new Uint8Array(readFileSync(join(tempOut, 'TypeLevelDocMismatchContract.approval.bin')))

    expect(fieldDocMismatchBin).toEqual(sameBin)
    expect(typeLevelDocMismatchBin).toEqual(sameBin)
  })
})
