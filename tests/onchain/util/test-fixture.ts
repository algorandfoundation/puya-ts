import type { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { Config, microAlgos } from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import type { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'
import type { AppState, SendAppTransactionResult } from '@algorandfoundation/algokit-utils/types/app'
import type { Arc56Contract } from '@algorandfoundation/algokit-utils/types/app-arc56'
import type { AppClient } from '@algorandfoundation/algokit-utils/types/app-client'
import type { AppFactory, AppFactoryDeployParams } from '@algorandfoundation/algokit-utils/types/app-factory'
import type { AssetCreateParams } from '@algorandfoundation/algokit-utils/types/composer'
import { nullLogger } from '@algorandfoundation/algokit-utils/types/logging'
import type { AlgorandFixture } from '@algorandfoundation/algokit-utils/types/testing'
import type { Use } from '@vitest/runner/types'
import { OnApplicationComplete } from 'algosdk'
import fs from 'fs'
import type { ExpectStatic } from 'vitest'
import { test } from 'vitest'
import { compile } from '../../../src'
import { processInputPaths } from '../../../src/input-paths/process-input-paths'
import { LoggingContext, LogLevel } from '../../../src/logger'
import { defaultPuyaOptions } from '../../../src/puya/options'
import type { DeliberateAny } from '../../../src/typescript-helpers'
import { invariant } from '../../../src/util'
import { generateTempDir } from '../../../src/util/generate-temp-file'

const algorandTestFixture = (localnetFixture: AlgorandFixture) =>
  test.extend<{
    localnet: AlgorandFixture
    algorand: AlgorandClient
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
    algorand: async ({ localnet }, use) => {
      await use(localnet.context.algorand)
    },
    assetFactory: async ({ localnet }, use) => {
      use(async (assetCreateParams: AssetCreateParams) => {
        const { assetId } = await localnet.algorand.send.assetCreate(assetCreateParams)
        return assetId
      })
    },
  })

function createLazyCompiler(path: string, options: { outputBytecode: boolean; outputArc56: boolean }) {
  let result: CompilationArtifacts | undefined = undefined
  return {
    async getCompileResult(expect: ExpectStatic) {
      if (!result) result = await compilePath(path, expect, options)
      return result
    },
  }
}
type AlgoClientAppCallParams = Parameters<AlgorandClient['send']['appCall']>[0]

type ProgramInvokeOptions = {
  appId?: bigint
  sender?: AlgoClientAppCallParams['sender']
  approvalProgram?: Uint8Array

  clearStateProgram?: Uint8Array
  onComplete?:
    | OnApplicationComplete.NoOpOC
    | OnApplicationComplete.OptInOC
    | OnApplicationComplete.CloseOutOC
    | OnApplicationComplete.ClearStateOC
    | OnApplicationComplete.UpdateApplicationOC
    | OnApplicationComplete.DeleteApplicationOC
  schema?: {
    /** The number of integers saved in global state. */
    globalInts?: number
    /** The number of byte slices saved in global state. */
    globalByteSlices?: number
    /** The number of integers saved in local state. */
    localInts?: number
    /** The number of byte slices saved in local state. */
    localByteSlices?: number
  }
} & Omit<AlgoClientAppCallParams, 'onComplete' | 'sender' | 'appId'>

type ProgramInvoker = {
  globalState(appId: bigint): Promise<AppState>
  send(options?: ProgramInvokeOptions): Promise<SendAppTransactionResult>
}

type BaseFixtureContextFor<T extends string> = {
  [key in T as `${key}Invoker`]: ProgramInvoker
}
export function createBaseTestFixture<TContracts extends string = ''>(path: string, contracts: TContracts[]) {
  const lazyCompile = createLazyCompiler(path, { outputArc56: false, outputBytecode: true })
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
      const compiled = await lazyCompile.getCompileResult(expect)

      const approvalProgram = compiled.approvalBinaries[contractName]
      const clearStateProgram = compiled.clearStateBinaries[contractName]
      invariant(approvalProgram, `No approval program found for ${contractName}`)
      invariant(clearStateProgram, `No clear state program found for ${contractName}`)

      use({
        async globalState(appId: bigint) {
          return localnet.algorand.app.getGlobalState(appId)
        },

        async send(options?: ProgramInvokeOptions) {
          const common = {
            ...options,
            appId: options?.appId ?? 0n,
            onComplete: options?.onComplete ?? OnApplicationComplete.NoOpOC,
            sender: options?.sender ?? localnet.context.testAccount.addr,
          }
          if (common.appId === 0n || common.onComplete === OnApplicationComplete.UpdateApplicationOC) {
            common.approvalProgram = approvalProgram
            common.clearStateProgram = clearStateProgram
          }
          const group = localnet.algorand.send.newGroup()
          group.addAppCall(common as DeliberateAny)

          // TODO: Add simulate call to gather trace

          const result = await group.send()
          return {
            ...result,
            confirmation: result.confirmations[0],
            transaction: result.transactions[0],
          }
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
} & {
  [key in T as `appSpec${key}`]: Arc56Contract
}

type ContractConfig = {
  deployParams?: AppFactoryDeployParams
  funding?: AlgoAmount
}

export function createArc4TestFixture<TContracts extends string = ''>(
  path: string,
  contracts: Record<TContracts, ContractConfig> | TContracts[],
) {
  const lazyCompile = createLazyCompiler(path, { outputArc56: true, outputBytecode: false })
  const localnet = algorandFixture({
    testAccountFunding: microAlgos(100_000_000_000),
  })

  Config.configure({
    logger: nullLogger,
  })

  async function getAppSpec(expect: ExpectStatic, contractName: string) {
    const appSpec = (await lazyCompile.getCompileResult(expect)).appSpecs.find((s) => s.name === contractName)
    if (appSpec === undefined) {
      expect.fail(`${path} does not contain an ARC4 contract "${contractName}"`)
    } else {
      return appSpec
    }
  }

  function* getContracts(): Iterable<[name: TContracts, config: ContractConfig]> {
    if (Array.isArray(contracts)) {
      for (const c of contracts) {
        yield [c, {}]
      }
    } else {
      for (const [c, cfg] of Object.entries(contracts) as Array<[TContracts, ContractConfig]>) {
        yield [c, cfg]
      }
    }
  }

  const ctx: DeliberateAny = {}
  for (const [contractName, config] of getContracts()) {
    ctx[`appSpec${contractName}`] = async ({ expect }: { expect: ExpectStatic }, use: Use<Arc56Contract>) => {
      await use(await getAppSpec(expect, contractName))
    }

    ctx[`appFactory${contractName}`] = async (
      { expect, localnet }: { expect: ExpectStatic; localnet: AlgorandFixture },
      use: Use<AppFactory>,
    ) => {
      const appSpec = await getAppSpec(expect, contractName)
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
      const appSpec = await getAppSpec(expect, contractName)
      const appFactory = localnet.algorand.client.getAppFactory({
        defaultSender: localnet.context.testAccount.addr,
        appSpec: appSpec!,
      })
      const { appClient } = await appFactory.deploy(config.deployParams ?? {})
      if (config.funding) await appClient.fundAppAccount({ amount: config.funding })
      await use(appClient)
    }
  }
  return algorandTestFixture(localnet).extend<Arc4FixtureContextFor<TContracts>>(ctx)
}

type CompilationArtifacts = {
  appSpecs: Arc56Contract[]
  approvalBinaries: Record<string, Uint8Array>
  clearStateBinaries: Record<string, Uint8Array>
}

async function compilePath(
  path: string,
  expect: ExpectStatic,
  options: { outputBytecode: boolean; outputArc56: boolean },
): Promise<CompilationArtifacts> {
  using tempDir = generateTempDir()
  const logCtx = LoggingContext.create()

  return await logCtx.run(async () => {
    const filePaths = processInputPaths({ paths: [path], outDir: tempDir.dirPath })
    await compile({
      filePaths,
      outputAwstJson: false,
      outputAwst: false,
      dryRun: false,
      logLevel: LogLevel.Error,
      skipVersionCheck: true,
      ...defaultPuyaOptions,
      outputArc32: false,
      outputTeal: false,
      outputSourceMap: true,
      optimizationLevel: 0,
      ...options,
    })
    for (const log of logCtx.logEvents) {
      switch (log.level) {
        case LogLevel.Error:
        case LogLevel.Critical:
          expect.fail(`Compilation error ${log.sourceLocation} [${log.level}]: ${log.message}`)
      }
    }

    const matchBinary = /(?<appName>[^\\/]+)\.(?<programName>(approval)|(clear))\.bin$/
    const appSpecs = new Array<Arc56Contract>()
    const approvalBinaries: Record<string, Uint8Array> = {}
    const clearStateBinaries: Record<string, Uint8Array> = {}
    for (const filePath of tempDir.files()) {
      if (filePath.endsWith('.arc56.json')) {
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

    return {
      appSpecs,
      approvalBinaries,
      clearStateBinaries,
    }
  })
}
