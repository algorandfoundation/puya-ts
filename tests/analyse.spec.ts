import { describe, expect, it } from 'vitest'
import { AbsolutePath, processInputPaths } from '../src'
import { analyse } from '../src/language-server/analyse'
import { createAnalyserService } from '../src/language-server/analyser-service'
import { normalisedUri } from '../src/language-server/util/uris'
import { logger, LogLevel } from '../src/logger'
import { ConsoleLogSink } from '../src/logger/sinks/console-log-sink'
import { PuyaService } from '../src/puya/puya-service'
import { resolvePuyaPath } from '../src/puya/resolve-puya-path'
import { testInvariant } from './util'

describe('analyse', async () => {
  logger.configure([new ConsoleLogSink(LogLevel.Error)])
  const puyaService = new PuyaService({ puyaPath: await resolvePuyaPath({}) })
  const dir = AbsolutePath.resolve({ path: 'tests/other/analyse' })
  const dirUri = normalisedUri({ fsPath: dir.toString() }).toString()

  const aFile = dir.resolve('./a.algo.ts').toString()
  const aUri = normalisedUri({ fsPath: aFile }).toString()
  const bFile = dir.resolve('./b.algo.ts').toString()
  const bUri = normalisedUri({ fsPath: bFile }).toString()

  describe('when analysing a directory', () => {
    it('an accurate dependency graph is constructed', async () => {
      const algoFiles = processInputPaths({ paths: [dir.toString()] })

      expect(algoFiles.length).toBe(2)

      const result = await analyse({ puyaService, filePaths: algoFiles })

      expect(result.graph).toBeDefined()

      const g = result.graph!

      expect(g.getDependants(aFile)).all.members([aFile])
      expect(g.getDependants(bFile)).all.members([aFile, bFile])
    })
  })
  describe('when called as a service', () => {
    it('returns diagnostics', async () => {
      const service = createAnalyserService({ puyaPath: await resolvePuyaPath({}) })
      const ab = new AbortController()
      const result = await service.analyse({ uris: [dirUri], openDocuments: {} }, ab.signal)

      testInvariant(result.length === 2, 'There must be 2 results')

      const aDiag = result.find((a) => a.uri === aUri)
      const bDiag = result.find((a) => a.uri === bUri)

      expect(aDiag).toBeDefined()
      expect(bDiag).toBeDefined()
    })
    it('returns diagnostics for open files', async () => {
      const service = createAnalyserService({ puyaPath: await resolvePuyaPath({}) })
      const ab = new AbortController()

      const result = await service.analyse(
        {
          uris: [dirUri],
          openDocuments: {
            [bUri]: {
              contents: `import { Contract } from '@algorandfoundation/algorand-typescript'

export class ContractB extends Contract {
  helloFromB(): any {
    return 'Hello from b'
  }
}`,
              version: 1,
            },
          },
        },
        ab.signal,
      )
      expect(result.length).toBe(2)

      const aDiag = result.find((a) => a.uri === aUri)
      const bDiag = result.find((a) => a.uri === bUri)

      expect(aDiag).toBeDefined()
      expect(bDiag).toBeDefined()
      expect(bDiag?.diagnostics[0].message).toBe('any cannot be used as an ABI return type')
      expect(bDiag?.version).toBe(1)
    })
  })
})
