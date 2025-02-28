import { randomUUID } from 'crypto'
import fs from 'fs'
import { globIterateSync } from 'glob'
import type { WriteFileOptions } from 'node:fs'
import os from 'os'
import upath from 'upath'
import { mkDirIfNotExists } from './index'

export type TempFile = {
  writeFileSync(data: NodeJS.ArrayBufferView, options?: WriteFileOptions): void
  writeFileSync(data: string, options?: WriteFileOptions): void
  readonly filePath: string
} & Disposable

function ensureTempDir(): string {
  const tempDir = upath.join(os.tmpdir(), 'puya-ts')
  mkDirIfNotExists(tempDir)
  return tempDir
}

export function generateTempFile(options?: { ext?: string }): TempFile {
  const { ext = 'tmp' } = options ?? {}
  const filePath = upath.join(ensureTempDir(), `${randomUUID()}.${ext}`)

  return {
    get filePath() {
      return filePath
    },
    writeFileSync(data: string | NodeJS.ArrayBufferView, options?: WriteFileOptions) {
      fs.writeFileSync(filePath, data, options)
    },
    [Symbol.dispose]() {
      fs.rmSync(filePath)
    },
  }
}
export type TempDir = {
  readonly dirPath: string
  files(): IterableIterator<string>
} & Disposable

export function generateTempDir(): TempDir {
  const dirPath = upath.join(ensureTempDir(), `${randomUUID()}`)
  mkDirIfNotExists(dirPath)

  return {
    get dirPath() {
      return dirPath
    },
    *files(): IterableIterator<string> {
      for (const p of globIterateSync(upath.join(dirPath, '**'), {
        nodir: true,
      })) {
        yield p
      }
    },
    [Symbol.dispose]() {
      fs.rmSync(dirPath, { recursive: true, force: true })
    },
  }
}
