import os from 'os'
import fs from 'fs'
import { randomUUID } from 'crypto'
import type { WriteFileOptions } from 'node:fs'
import path from 'node:path'

export type TempFile = {
  writeFileSync(data: NodeJS.ArrayBufferView, options?: WriteFileOptions): void
  writeFileSync(data: string, options?: WriteFileOptions): void
  readonly filePath: string
} & Disposable

function ensureTempDir(): string {
  const tempDir = path.join(os.tmpdir(), 'puya-ts')
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)
  return tempDir
}

export function generateTempFile(options?: { ext?: string }): TempFile {
  const { ext = 'tmp' } = options ?? {}
  const filePath = path.join(ensureTempDir(), `${randomUUID()}.${ext}`)

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
