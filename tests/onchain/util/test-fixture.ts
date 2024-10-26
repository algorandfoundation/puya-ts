import { Config, microAlgos } from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import type { AppClient } from '@algorandfoundation/algokit-utils/types/app-client'
import type { AppFactory, AppFactoryDeployParams } from '@algorandfoundation/algokit-utils/types/app-factory'
import type { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import type { AssetCreateParams } from '@algorandfoundation/algokit-utils/types/composer'
import { nullLogger } from '@algorandfoundation/algokit-utils/types/logging'
import type { AlgorandFixture } from '@algorandfoundation/algokit-utils/types/testing'
import type { Use } from '@vitest/runner/types'
import fs from 'fs'
import type { ExpectStatic } from 'vitest'
import { test } from 'vitest'
import { compile } from '../../../src'
import { buildCompileOptions } from '../../../src/compile-options'
import { LoggingContext, LogLevel } from '../../../src/logger'
import { defaultPuyaOptions } from '../../../src/puya/options'
import type { DeliberateAny } from '../../../src/typescript-helpers'
import { generateTempDir } from '../../../src/util/generate-temp-file'

const algorandTestFixture = (localnetFixture: AlgorandFixture) =>
  test.extend<{
    localnet: AlgorandFixture
    testAccount: AlgorandFixture['context']['testAccount']
    assetFactory: (assetCreateParams: AssetCreateParams) => Promise<bigint>
  }>({
    localnet: async ({ expect }, use) => {
      await localnetFixture.beforeEach()
      await use(localnetFixture)
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

type FixtureContextFor<T extends string> = {
  [key in T as `appFactory${key}`]: AppFactory
} & {
  [key in T as `appClient${key}`]: AppClient
}

type ContractConfig = {
  deployParams?: AppFactoryDeployParams
}

export function createTestFixture<TContracts extends string = ''>(path: string, contracts: Record<TContracts, ContractConfig>) {
  const lazyCompile = (() => {
    let result: CompilationArtifacts | undefined = undefined
    return {
      get compileResult() {
        if (!result) result = compilePath(path)
        return result
      },
    }
  })()
  const localnet = algorandFixture({
    testAccountFunding: microAlgos(100_000_000_000),
  })

  Config.configure({
    logger: nullLogger,
  })

  const ctx: DeliberateAny = {}
  for (const [contractName, config] of Object.entries(contracts) as Array<[TContracts, ContractConfig]>) {
    ctx[`appFactory${contractName}`] = async (
      { expect, localnet }: { expect: ExpectStatic; localnet: AlgorandFixture },
      use: Use<AppFactory>,
    ) => {
      const appSpec = lazyCompile.compileResult.appSpecs.find((s) => s.contract.name === contractName)
      if (appSpec === undefined) {
        expect.fail(`${path} does not contain an ARC4 contract "${contractName}"`)
      }
      await use(
        localnet.algorand.client.getAppFactory({
          defaultSender: localnet.context.testAccount.addr,
          appSpec: appSpec!,
        }),
      )
    }
    ctx[`appClient${contractName}`] = async (
      { expect, localnet }: { expect: ExpectStatic; localnet: AlgorandFixture },
      use: Use<AppClient>,
    ) => {
      const appSpec = lazyCompile.compileResult.appSpecs.find((s) => s.contract.name === contractName)
      if (appSpec === undefined) {
        expect.fail(`${path} does not contain an ARC4 contract "${contractName}"`)
      }
      const appFactory = localnet.algorand.client.getAppFactory({
        defaultSender: localnet.context.testAccount.addr,
        appSpec: appSpec!,
      })
      const { appClient } = await appFactory.deploy(config.deployParams ?? {})
      await use(appClient)
    }
  }
  return algorandTestFixture(localnet).extend<FixtureContextFor<TContracts>>(ctx)
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
