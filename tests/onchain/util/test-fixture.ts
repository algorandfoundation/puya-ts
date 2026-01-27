import type { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { Config, microAlgos } from '@algorandfoundation/algokit-utils'
import type { Arc56Contract } from '@algorandfoundation/algokit-utils/abi'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { OnApplicationComplete } from '@algorandfoundation/algokit-utils/transact'
import type { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'
import type { AppState, SendAppTransactionResult } from '@algorandfoundation/algokit-utils/types/app'
import type { AppClient } from '@algorandfoundation/algokit-utils/types/app-client'
import type { AppFactory, AppFactoryDeployParams } from '@algorandfoundation/algokit-utils/types/app-factory'
import type { AppCallParams, AssetCreateParams } from '@algorandfoundation/algokit-utils/types/composer'
import { nullLogger } from '@algorandfoundation/algokit-utils/types/logging'
import type { AlgorandFixture } from '@algorandfoundation/algokit-utils/types/testing'
import type { Use } from '@vitest/runner/types'
import fs from 'fs'
import type { beforeEach, ExpectStatic } from 'vitest'
import { beforeAll, test } from 'vitest'
import { compile, CompileOptions, processInputPaths } from '../../../src'
import { LoggingContext, LogLevel } from '../../../src/logger'
import type { PuyaService } from '../../../src/puya/puya-service'
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

function createLazyCompiler(
  paths: string[],
  options: { outputBytecode: boolean; outputArc56: boolean },
  puyaService: PuyaService | undefined,
) {
  let result: CompilationArtifacts | undefined = undefined
  return {
    async getCompileResult(expect: ExpectStatic) {
      if (!result) result = await compilePath(paths, expect, options, puyaService)
      return result
    },
  }
}

type ProgramInvokeOptions = {
  appId?: bigint
  sender?: AppCallParams['sender']
  approvalProgram?: Uint8Array

  clearStateProgram?: Uint8Array
  onComplete?:
    | OnApplicationComplete.NoOp
    | OnApplicationComplete.OptIn
    | OnApplicationComplete.CloseOut
    | OnApplicationComplete.ClearState
    | OnApplicationComplete.UpdateApplication
    | OnApplicationComplete.DeleteApplication
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
} & Omit<AppCallParams, 'onComplete' | 'sender' | 'appId'>

type ProgramInvoker = {
  globalState(appId: bigint): Promise<AppState>
  send(options?: ProgramInvokeOptions): Promise<SendAppTransactionResult>
}

function promoteToArray<T>(arg: T | T[]) {
  return Array.isArray(arg) ? arg : [arg]
}

type BaseFixtureContextFor<T extends string> = {
  [key in T as `${key}Invoker`]: ProgramInvoker
}
/**
 * Creates a base test fixture for testing compiled Algorand smart contracts.
 *
 * @param options - Configuration options for the test fixture
 * @param options.path - Path to the TypeScript file containing the contracts
 * @param options.contracts - Array of contract names to create fixtures for
 * @param options.newScopeAt - When to create a new test scope. Defaults to `beforeAll` for shared state across tests.
 *                              Use `beforeEach` to create a fresh state for each test.
 */
export function createBaseTestFixture<TContracts extends string = ''>(options: {
  paths: string[] | string
  contracts: TContracts[]
  /** When to create a new test scope. Defaults to `beforeAll`. Use `beforeEach` for fresh state per test. */
  newScopeAt?: typeof beforeAll | typeof beforeEach
  /**
   * Optionally provide a puya service to be used for compilation. If none provided a new instance will be created per compilation
   */
  puyaService?: PuyaService
}) {
  const { paths, contracts, newScopeAt = beforeAll, puyaService } = options
  const lazyCompile = createLazyCompiler(promoteToArray(paths), { outputArc56: false, outputBytecode: true }, puyaService)
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

      await use({
        async globalState(appId: bigint) {
          return localnet.algorand.app.getGlobalState(appId)
        },

        async send(options?: ProgramInvokeOptions) {
          const common = {
            ...options,
            schema: undefined,
            appId: options?.appId ?? 0n,
            sender: options?.sender ?? localnet.context.testAccount.addr,
          }
          const group = localnet.algorand.send.newGroup()

          if (common.appId === 0n) {
            invariant(common.onComplete !== OnApplicationComplete.UpdateApplication, 'Cannot update appId 0')
            invariant(common.onComplete !== OnApplicationComplete.ClearState, 'Cannot clear state of appId 0')
            const { appId, ...rest } = common
            group.addAppCreate({
              ...rest,
              onComplete: common?.onComplete ?? OnApplicationComplete.NoOp,
              approvalProgram,
              clearStateProgram,
              schema: {
                localInts: options?.schema?.localInts ?? 0,
                localByteSlices: options?.schema?.localByteSlices ?? 0,
                globalInts: options?.schema?.globalInts ?? 0,
                globalByteSlices: options?.schema?.globalByteSlices ?? 0,
              },
            })
          } else if (common.onComplete === OnApplicationComplete.UpdateApplication) {
            group.addAppUpdate({
              ...common,
              onComplete: OnApplicationComplete.UpdateApplication,
              approvalProgram,
              clearStateProgram,
            })
          } else {
            group.addAppCall({
              ...common,
              onComplete: common?.onComplete ?? OnApplicationComplete.NoOp,
            })
          }

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
  const fixture = algorandTestFixture(localnet).extend<BaseFixtureContextFor<TContracts>>(ctx)
  newScopeAt(localnet.newScope)
  return fixture
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

/**
 * Creates an ARC-4 test fixture for testing Algorand ARC-4 smart contracts.
 *
 * @param options - Configuration options for the test fixture
 * @param options.path - Path to the TypeScript file containing the ARC-4 contracts
 * @param options.contracts - Contract configuration as either an array of names or pairs of name with deployment config
 * @param options.newScopeAt - When to create a new test scope. Defaults to `beforeAll` for shared state across tests.
 *                              Use `beforeEach` to create a fresh state for each test.
 */
export function createArc4TestFixture<TContracts extends string = ''>(options: {
  paths: string | string[]
  contracts: Record<TContracts, ContractConfig> | TContracts[]
  /** When to create a new test scope. Defaults to `beforeAll`. Use `beforeEach` for fresh state per test. */
  newScopeAt?: typeof beforeAll | typeof beforeEach
  /**
   * Optionally provide a puya service to be used for compilation. If none provided a new instance will be created per compilation
   */
  puyaService?: PuyaService
}) {
  const { paths, contracts, newScopeAt = beforeAll, puyaService } = options
  const lazyCompile = createLazyCompiler(promoteToArray(paths), { outputArc56: true, outputBytecode: false }, puyaService)
  const localnet = algorandFixture({
    testAccountFunding: microAlgos(100_000_000_000),
  })

  Config.configure({
    logger: nullLogger,
  })

  async function getAppSpec(expect: ExpectStatic, contractName: string) {
    const appSpec = (await lazyCompile.getCompileResult(expect)).appSpecs.find((s) => s.name === contractName)
    if (appSpec === undefined) {
      expect.fail(`${paths} does not contain an ARC4 contract "${contractName}"`)
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
  const fixture = algorandTestFixture(localnet).extend<Arc4FixtureContextFor<TContracts>>(ctx)
  newScopeAt(localnet.newScope)
  return fixture
}

type CompilationArtifacts = {
  appSpecs: Arc56Contract[]
  approvalBinaries: Record<string, Uint8Array>
  clearStateBinaries: Record<string, Uint8Array>
}

async function compilePath(
  paths: string[],
  expect: ExpectStatic,
  options: { outputBytecode: boolean; outputArc56: boolean },
  puyaService: PuyaService | undefined,
): Promise<CompilationArtifacts> {
  using tempDir = generateTempDir()
  const logCtx = LoggingContext.create()

  return await logCtx.run(async () => {
    const filePaths = processInputPaths({ paths, outDir: tempDir.dirPath })
    await compile(
      new CompileOptions({
        filePaths,
        logLevel: LogLevel.Error,
        skipVersionCheck: true,
        outputArc32: false,
        outputTeal: false,
        outputSourceMap: true,
        optimizationLevel: 1,
        ...options,
      }),
      puyaService,
    )
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
