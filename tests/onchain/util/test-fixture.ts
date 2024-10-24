import { microAlgos } from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import type { AppClient } from '@algorandfoundation/algokit-utils/types/app-client'
import type { AppFactory, AppFactoryDeployParams } from '@algorandfoundation/algokit-utils/types/app-factory'
import type { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import type { AssetCreateParams } from '@algorandfoundation/algokit-utils/types/composer'
import type { AlgorandFixture } from '@algorandfoundation/algokit-utils/types/testing'
import fs from 'fs'
import { test } from 'vitest'
import { compile } from '../../../src'
import { buildCompileOptions } from '../../../src/compile-options'
import { LoggingContext, LogLevel } from '../../../src/logger'
import { defaultPuyaOptions } from '../../../src/puya/options'
import { generateTempDir } from '../../../src/util/generate-temp-file'

export function createTestFixture(path: string, defaultDeployParams?: AppFactoryDeployParams) {
  const _localnet = algorandFixture({
    testAccountFunding: microAlgos(100_000_000_000),
  })

  return test.extend<{
    appFactory: AppFactory
    appClient: AppClient
    localnet: AlgorandFixture
    testAccount: typeof _localnet.context.testAccount
    assetFactory: (assetCreateParams: AssetCreateParams) => Promise<bigint>
  }>({
    localnet: async ({ expect }, use) => {
      await _localnet.beforeEach()
      await use(_localnet)
    },
    appFactory: async ({ expect, localnet }, use) => {
      const { appSpecs } = compilePath(path)
      if (appSpecs.length === 0) {
        expect.fail(`${path} does not contain any ARC4 contracts`)
      }
      if (appSpecs.length > 1) {
        expect.fail(`${path} contains multiple ARC4 contracts, please specify a contract name in the options`)
      }
      const appFactory = localnet.algorand.client.getAppFactory({ defaultSender: localnet.context.testAccount.addr, appSpec: appSpecs[0] })
      await use(appFactory)
    },
    appClient: async ({ appFactory }, use) => {
      const { appClient } = await appFactory.deploy(defaultDeployParams ?? {})
      await use(appClient)
    },
    testAccount: async ({ localnet }, use) => {
      await use(localnet.context.testAccount)
    },
    assetFactory: async ({ localnet }, use) => {
      use(async (assetCreateParams: AssetCreateParams) => {
        const { assetId } = await localnet.algorand.send.assetCreate(assetCreateParams)
        return assetId
      })
    },
  })
}

type CompilationArtifacts = {
  appSpecs: AppSpec[]
}

function compilePath(path: string): CompilationArtifacts {
  using tempDir = generateTempDir()
  using logCtx = LoggingContext.create()

  compile(
    buildCompileOptions({
      outputAwstJson: false,
      outputAwst: false,
      paths: [path],
      outDir: tempDir.dirPath,
      dryRun: false,
      logLevel: LogLevel.Error,
    }),
    {
      ...defaultPuyaOptions,
      outputTeal: false,
      outputArc32: true,
    },
  )
  const appSpecs = new Array<AppSpec>()
  for (const filePath of tempDir.files()) {
    if (filePath.endsWith('.arc32.json')) {
      appSpecs.push(JSON.parse(fs.readFileSync(filePath, 'utf-8')))
    }
  }

  //TODO: check log context for errors
  return {
    appSpecs,
  }
}
