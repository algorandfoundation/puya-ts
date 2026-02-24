import { describe } from 'vitest'
import { createArc4TestFixture, createBaseTestFixture } from './util/test-fixture'

const abiCreate = { deployParams: { createParams: { method: 'createApplication' } } }

describe('01-counter', () => {
  const test = createArc4TestFixture({
    paths: 'examples/01-counter/contract.algo.ts',
    contracts: { Counter: abiCreate },
  })
  test('deploy', async ({ appClientCounter, expect }) => {
    expect(appClientCounter).toBeDefined()
  })
})

describe('02-greeter', () => {
  const test = createArc4TestFixture({
    paths: 'examples/02-greeter/contract.algo.ts',
    contracts: { Greeter: abiCreate },
  })
  test('deploy', async ({ appClientGreeter, expect }) => {
    expect(appClientGreeter).toBeDefined()
  })
})

describe('03-raw-calculator', () => {
  const test = createBaseTestFixture({
    paths: 'examples/03-raw-calculator/contract.algo.ts',
    contracts: ['RawCalculator'],
  })
  test('deploy', async ({ RawCalculatorInvoker }) => {
    await RawCalculatorInvoker.send({ schema: { globalInts: 1 } })
  })
})

// 04-logic-sig-gate: skipped — LogicSig, not an app

describe('05-type-explorer', () => {
  const test = createArc4TestFixture({
    paths: 'examples/05-type-explorer/contract.algo.ts',
    contracts: ['TypeExplorer'],
  })
  test('deploy', async ({ appClientTypeExplorer, expect }) => {
    expect(appClientTypeExplorer).toBeDefined()
  })
})

describe('06-membership-registry', () => {
  const test = createArc4TestFixture({
    paths: 'examples/06-membership-registry/contract.algo.ts',
    contracts: { MembershipRegistry: abiCreate },
  })
  test('deploy', async ({ appClientMembershipRegistry, expect }) => {
    expect(appClientMembershipRegistry).toBeDefined()
  })
})

describe('07-arc4-data-structures', () => {
  const test = createArc4TestFixture({
    paths: 'examples/07-arc4-data-structures/contract.algo.ts',
    contracts: ['Arc4DataStructures'],
  })
  test('deploy', async ({ appClientArc4DataStructures, expect }) => {
    expect(appClientArc4DataStructures).toBeDefined()
  })
})

describe('08-key-value-store', () => {
  const test = createArc4TestFixture({
    paths: 'examples/08-key-value-store/contract.algo.ts',
    contracts: { KeyValueStore: abiCreate },
  })
  test('deploy', async ({ appClientKeyValueStore, expect }) => {
    expect(appClientKeyValueStore).toBeDefined()
  })
})

describe('09-array-playground', () => {
  const test = createArc4TestFixture({
    paths: 'examples/09-array-playground/contract.algo.ts',
    contracts: ['ArrayPlayground'],
  })
  test('deploy', async ({ appClientArrayPlayground, expect }) => {
    expect(appClientArrayPlayground).toBeDefined()
  })
})

describe('10-object-tuples', () => {
  const test = createArc4TestFixture({
    paths: 'examples/10-object-tuples/contract.algo.ts',
    contracts: { ObjectTuples: abiCreate },
  })
  test('deploy', async ({ appClientObjectTuples, expect }) => {
    expect(appClientObjectTuples).toBeDefined()
  })
})

describe('11-token-manager', () => {
  const test = createArc4TestFixture({
    paths: 'examples/11-token-manager/contract.algo.ts',
    contracts: { TokenManager: abiCreate },
  })
  test('deploy', async ({ appClientTokenManager, expect }) => {
    expect(appClientTokenManager).toBeDefined()
  })
})

describe('12-multi-txn-distributor', () => {
  const test = createArc4TestFixture({
    paths: 'examples/12-multi-txn-distributor/contract.algo.ts',
    contracts: { MultiTxnDistributor: abiCreate },
  })
  test('deploy', async ({ appClientMultiTxnDistributor, expect }) => {
    expect(appClientMultiTxnDistributor).toBeDefined()
  })
})

describe('13-contract-factory', () => {
  const test = createArc4TestFixture({
    paths: 'examples/13-contract-factory/contract.algo.ts',
    contracts: { GreeterFactory: abiCreate },
  })
  test('deploy', async ({ appClientGreeterFactory, expect }) => {
    expect(appClientGreeterFactory).toBeDefined()
  })
})

describe('14-event-logger', () => {
  const test = createArc4TestFixture({
    paths: 'examples/14-event-logger/contract.algo.ts',
    contracts: { EventLogger: abiCreate },
  })
  test('deploy', async ({ appClientEventLogger, expect }) => {
    expect(appClientEventLogger).toBeDefined()
  })
})

describe('15-inheritance-showcase', () => {
  const test = createArc4TestFixture({
    paths: 'examples/15-inheritance-showcase/contract.algo.ts',
    contracts: { InheritanceShowcase: abiCreate },
  })
  test('deploy', async ({ appClientInheritanceShowcase, expect }) => {
    expect(appClientInheritanceShowcase).toBeDefined()
  })
})

describe('16-crypto-vault', () => {
  const test = createArc4TestFixture({
    paths: 'examples/16-crypto-vault/contract.algo.ts',
    contracts: {
      CryptoVault: {
        deployParams: {
          createParams: {
            method: 'createApplication',
            args: [new Uint8Array([1, 2, 3, 4])],
          },
        },
      },
    },
  })
  test('deploy', async ({ appClientCryptoVault, expect }) => {
    expect(appClientCryptoVault).toBeDefined()
  })
})

describe('17-dex-pool', () => {
  const test = createArc4TestFixture({
    paths: 'examples/17-dex-pool/contract.algo.ts',
    contracts: { DexPool: abiCreate },
  })
  test('deploy', async ({ appClientDexPool, expect }) => {
    expect(appClientDexPool).toBeDefined()
  })
})

describe('18-governance-dao', () => {
  const test = createArc4TestFixture({
    paths: 'examples/18-governance-dao/contract.algo.ts',
    contracts: { GovernanceDao: abiCreate },
  })
  test('deploy', async ({ appClientGovernanceDao, expect }) => {
    expect(appClientGovernanceDao).toBeDefined()
  })
})
