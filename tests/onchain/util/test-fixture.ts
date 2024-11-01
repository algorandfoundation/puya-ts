import { Config, microAlgos } from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import type { SendAppTransactionResult } from '@algorandfoundation/algokit-utils/types/app'
import type { AppClient } from '@algorandfoundation/algokit-utils/types/app-client'
import type { AppFactory, AppFactoryDeployParams } from '@algorandfoundation/algokit-utils/types/app-factory'
import type { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import type { AssetCreateParams } from '@algorandfoundation/algokit-utils/types/composer'
import { nullLogger } from '@algorandfoundation/algokit-utils/types/logging'
import type { AlgorandFixture } from '@algorandfoundation/algokit-utils/types/testing'
import type { Use } from '@vitest/runner/types'
import { OnApplicationComplete } from 'algosdk'
import fs from 'fs'
import type { ExpectStatic } from 'vitest'
import { test } from 'vitest'
import { compile } from '../../../src'
import { buildCompileOptions } from '../../../src/compile-options'
import { LoggingContext, LogLevel } from '../../../src/logger'
import { defaultPuyaOptions } from '../../../src/puya/options'
import type { DeliberateAny } from '../../../src/typescript-helpers'
import { invariant } from '../../../src/util'
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

function createLazyCompiler(path: string) {
  let result: CompilationArtifacts | undefined = undefined
  return {
    getCompileResult(expect: ExpectStatic) {
      if (!result) result = compilePath(path, expect)
      return result
    },
  }
}
type ProgramInvokeOptions = {
  appId?: bigint
  onComplete?:
    | OnApplicationComplete.NoOpOC
    | OnApplicationComplete.OptInOC
    | OnApplicationComplete.CloseOutOC
    | OnApplicationComplete.ClearStateOC
    | OnApplicationComplete.UpdateApplicationOC
    | OnApplicationComplete.DeleteApplicationOC
  senderAddr?: string
  args?: Uint8Array[]
}

type ProgramInvoker = {
  send(options?: ProgramInvokeOptions): Promise<SendAppTransactionResult>
}

type BaseFixtureContextFor<T extends string> = {
  [key in T as `${key}Invoker`]: ProgramInvoker
}
export function createBaseTestFixture<TContracts extends string = ''>(path: string, contracts: TContracts[]) {
  const lazyCompile = createLazyCompiler(path)
  const localnet = algorandFixture({
    testAccountFunding: microAlgos(100_000_000_000),
  })

  Config.configure({
    logger: nullLogger,
  })

  const ctx: DeliberateAny = {}
  for (const contractName of contracts) {
    ctx[`${contractName}Invoker`] = async (
      { expect, localnet }: { expect: ExpectStatic; localnet: AlgorandFixture },
      use: Use<ProgramInvoker>,
    ) => {
      const compiled = lazyCompile.getCompileResult(expect)

      const approvalProgram = compiled.approvalBinaries[contractName]
      const clearStateProgram = compiled.clearStateBinaries[contractName]
      invariant(approvalProgram, `No approval program found for ${contractName}`)
      invariant(clearStateProgram, `No clear state program found for ${contractName}`)

      use({
        async send(options?: ProgramInvokeOptions) {
          const common = {
            onComplete: options?.onComplete ?? OnApplicationComplete.NoOpOC,
            appId: options?.appId ?? 0n,
            approvalProgram,
            clearStateProgram,
            sender: options?.senderAddr ?? localnet.context.testAccount.addr,
            args: options?.args ?? [],
          }
          return localnet.algorand.send.appCall(common as DeliberateAny)
        },
      })
    }
  }
  return algorandTestFixture(localnet).extend<BaseFixtureContextFor<TContracts>>(ctx)
}

type Arc4FixtureContextFor<T extends string> = {
  [key in T as `appFactory${key}`]: AppFactory
} & {
  [key in T as `appClient${key}`]: AppClient
}

type ContractConfig = {
  deployParams?: AppFactoryDeployParams
}

export function createArc4TestFixture<TContracts extends string = ''>(path: string, contracts: Record<TContracts, ContractConfig>) {
  const lazyCompile = createLazyCompiler(path)
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
      const appSpec = lazyCompile.getCompileResult(expect).appSpecs.find((s) => s.contract.name === contractName)
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
      const appSpec = lazyCompile.getCompileResult(expect).appSpecs.find((s) => s.contract.name === contractName)
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
  return algorandTestFixture(localnet).extend<Arc4FixtureContextFor<TContracts>>(ctx)
}

type CompilationArtifacts = {
  appSpecs: AppSpec[]
  approvalBinaries: Record<string, Uint8Array>
  clearStateBinaries: Record<string, Uint8Array>
}

function compilePath(path: string, expect: ExpectStatic): CompilationArtifacts {
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
      outputBytecode: true,
    },
  )
  for (const log of logCtx.logEvents) {
    switch (log.level) {
      case LogLevel.Error:
      case LogLevel.Critical:
        expect.fail(`Compilation error ${log.sourceLocation} [${log.level}]: ${log.message}`)
    }
  }

  const matchBinary = /(?<appName>[^\\/]+)\.(?<programName>(approval)|(clear))\.bin$/
  const appSpecs = new Array<AppSpec>()
  const approvalBinaries: Record<string, Uint8Array> = {}
  const clearStateBinaries: Record<string, Uint8Array> = {}
  for (const filePath of tempDir.files()) {
    if (filePath.endsWith('.arc32.json')) {
      appSpecs.push(JSON.parse(fs.readFileSync(filePath, 'utf-8')))
    } else {
      const m = matchBinary.exec(filePath)
      if (m?.groups) {
        const { appName, programName } = m.groups
        const binary = new Uint8Array(fs.readFileSync(filePath))
        if (programName === 'approval') {
          approvalBinaries[appName] = binary
        } else {
          clearStateBinaries[appName] = binary
        }
      }
    }
  }

  //TODO: check log context for errors
  return {
    appSpecs,
    approvalBinaries,
    clearStateBinaries,
  }
}
