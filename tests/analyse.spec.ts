import { describe, expect, it } from 'vitest'
import { AbsolutePath, processInputPaths } from '../src'
import { analyse } from '../src/language-server/analyse'
import { PuyaService } from '../src/puya/puya-service'
import { resolvePuyaPath } from '../src/puya/resolve-puya-path'

describe('analyse', async () => {
  const puyaService = new PuyaService({ puyaPath: await resolvePuyaPath({}) })
  describe('when analysing a directory', () => {
    it('an accurate dependency graph is constructed', async () => {
      const dir = AbsolutePath.resolve({ path: 'tests/other/analyse' })
      const algoFiles = processInputPaths({ paths: [dir.toString()] })

      expect(algoFiles.length).toBe(2)

      const result = await analyse({ puyaService, filePaths: algoFiles })

      expect(result.graph).toBeDefined()

      const aFile = dir.resolve('./a.algo.ts').toString()
      const bFile = dir.resolve('./b.algo.ts').toString()
      const g = result.graph!

      expect(g.getDependants(aFile)).all.members([aFile])
      expect(g.getDependants(bFile)).all.members([aFile, bFile])
    })
  })
})
