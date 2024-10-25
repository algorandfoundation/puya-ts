import { describe, expect } from 'vitest'
import { createTestFixture } from './util/test-fixture'

describe('implicit-create', () => {
  const test = createTestFixture('tests/approvals/implicit-create.algo.ts', {
    NoBare: {},
    NoNoOp: {},
    ExplicitBareCreateFromBase: {},
    ExplicitAbiCreateFromBase: {},
  })
  test('NoBare can be created', async ({ appFactoryNoBare }) => {
    await appFactoryNoBare.send.bare.create()
  })
  test('NoNoOp can be created', async ({ appFactoryNoNoOp }) => {
    await appFactoryNoNoOp.send.bare.create()
  })
  test('ExplicitBareCreateFromBase can be created', async ({ appFactoryExplicitBareCreateFromBase }) => {
    await appFactoryExplicitBareCreateFromBase.send.bare.create()
  })
  test("ExplicitAbiCreateFromBase can't be created with bare", async ({ appFactoryExplicitAbiCreateFromBase }) => {
    await expect(() => appFactoryExplicitAbiCreateFromBase.send.bare.create()).rejects.toThrowError()
  })
  test('ExplicitAbiCreateFromBase can be created with abi', async ({ appFactoryExplicitAbiCreateFromBase }) => {
    await appFactoryExplicitAbiCreateFromBase.send.create({ method: 'create' })
  })
})
