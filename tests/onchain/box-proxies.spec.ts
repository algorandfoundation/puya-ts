import { algos } from '@algorandfoundation/algokit-utils'
import type { arc4, uint64 } from '@algorandfoundation/algorand-typescript'
import { describe, expect } from 'vitest'
import { bigIntToUint8Array, invariant, uint8ArrayToUtf8, utf8ToUint8Array } from '../../src/util'
import { createArc4TestFixture, createBaseTestFixture } from './util/test-fixture'

describe('BoxProxies', () => {
  const test = createBaseTestFixture({
    paths: 'tests/approvals/box-proxies.algo.ts',
    contracts: ['BoxContract', 'BoxNotExist', 'LargeBox'],
  })

  test('Should run', async ({ BoxContractInvoker, algorand, testAccount }) => {
    const created = await BoxContractInvoker.send()

    invariant(created.confirmation.applicationIndex, 'There must be an application id')
    const appInfo = await algorand.app.getById(created.confirmation.applicationIndex)
    // Fund the app account
    await algorand.send.payment({
      receiver: appInfo.appAddress,
      sender: testAccount.addr,
      amount: algos(1),
    })
    await BoxContractInvoker.send({
      appId: created.confirmation.applicationIndex,
      boxReferences: ['A', 'one', 'abc', 'what?', 'twowhat?', 'three', 'what?x', 'twowhat?x'],
    })
  })

  test('Box that does not exist should fail when accessed', async ({ BoxNotExistInvoker, algorand, testAccount }) => {
    const created = await BoxNotExistInvoker.send()

    invariant(created.confirmation.applicationIndex, 'There must be an application id')
    const appInfo = await algorand.app.getById(created.confirmation.applicationIndex)
    // Fund the app account
    await algorand.send.payment({
      receiver: appInfo.appAddress,
      sender: testAccount.addr,
      amount: algos(1),
    })

    // Accessing box.value when the box doesn't exist fails
    await expect(
      BoxNotExistInvoker.send({
        appId: created.confirmation.applicationIndex,
        boxReferences: ['abc'],
        args: [utf8ToUint8Array('box')],
      }),
    ).rejects.toThrow(/assert failed/)
    await expect(
      BoxNotExistInvoker.send({
        appId: created.confirmation.applicationIndex,
        boxReferences: ['abc'],
        args: [utf8ToUint8Array('boxmap')],
      }),
    ).rejects.toThrow(/assert failed/)

    // Create the box
    await BoxNotExistInvoker.send({
      appId: created.confirmation.applicationIndex,
      boxReferences: ['abc'],
      args: [utf8ToUint8Array('createbox')],
    })

    // Should work fine now the box exists
    await BoxNotExistInvoker.send({
      appId: created.confirmation.applicationIndex,
      boxReferences: ['abc'],
      args: [utf8ToUint8Array('box')],
    })
    await BoxNotExistInvoker.send({
      appId: created.confirmation.applicationIndex,
      boxReferences: ['abc'],
      args: [utf8ToUint8Array('boxmap')],
    })
  })

  const it = createArc4TestFixture({
    paths: 'tests/approvals/box-proxies.algo.ts',
    contracts: {
      BoxCreate: { funding: algos(1) },
      Arc4BoxContract: { funding: algos(10) },
      TupleBox: { funding: algos(1) },
      BoxToRefTest: { funding: algos(1) },
      CompositeKeyTest: { funding: algos(1) },
    },
  })
  it('creates boxes of the min size', async ({ appClientBoxCreate }) => {
    await appClientBoxCreate.send.call({ method: 'createBoxes', boxReferences: ['bool', 'arc4b', 'a', 'b', 'c', 'd', 'e'] })
  })

  it('ref can be used to mutate box data directly', async ({ appClientBoxToRefTest, testAccount }) => {
    await appClientBoxToRefTest.send.call({ method: 'test', boxReferences: [testAccount.publicKey] })
  })
  it('should be able to store tuples in boxes', async ({ appClientTupleBox }) => {
    await appClientTupleBox.send.call({ method: 'testBox', boxReferences: ['t1', 't2'] })
    await appClientTupleBox.send.call({ method: 'testBoxMap', boxReferences: ['tm1', 'tm2'] })
  })
  it('should work with composite keys', async ({ appClientCompositeKeyTest }) => {
    await appClientCompositeKeyTest.send.call({
      method: 'test',
      args: [{ a: 1, b: 2 }, 'value'],
      boxReferences: [bigIntToUint8Array(1n << (8n + 2n), 16)],
    })
  })

  it('creates boxes of the min size', async ({ appClientBoxCreate }) => {
    await appClientBoxCreate.send.call({ method: 'createBoxes', boxReferences: ['bool', 'arc4b', 'a', 'b', 'c', 'd', 'e'] })
  })

  it('should work with box', async ({ appClientArc4BoxContract, algorand, testAccount }) => {
    const boxRefs = ['boxA', 'b', 'BOX_C', 'boxD', 'boxRef', 'boxLarge', 'manyInts', 'dynamicBox', 'dynamicArrStruct', 'tooManyBools']
    const result = await appClientArc4BoxContract.send.call({
      method: 'boxesExist',
      boxReferences: boxRefs.slice(0, 8),
    })
    const [aExist, bExist, cExist, largeExist] = result.return as unknown as readonly [boolean, boolean, boolean, boolean]
    expect(aExist).toBe(false)
    expect(bExist).toBe(false)
    expect(cExist).toBe(false)
    expect(largeExist).toBe(false)

    const call = await appClientArc4BoxContract.createTransaction.call({
      method: 'setBoxes',
      boxReferences: boxRefs.slice(0, 8),
      args: [56, utf8ToUint8Array('Hello'), 'World'],
    })
    await algorand
      .newGroup()
      .addAppCreate({
        approvalProgram: APPROVE,
        clearStateProgram: APPROVE,
        sender: testAccount.addr,
        boxReferences: boxRefs.slice(8),
      })
      .addTransaction(call.transactions[0])
      .send()

    const result2 = await appClientArc4BoxContract.send.call({
      method: 'boxesExist',
      boxReferences: boxRefs.slice(0, 8),
    })
    const [aExist2, bExist2, cExist2, largeExist2] = result2.return as unknown as readonly [boolean, boolean, boolean, boolean]
    expect(aExist2).toBe(true)
    expect(bExist2).toBe(true)
    expect(cExist2).toBe(true)
    expect(largeExist2).toBe(true)

    await appClientArc4BoxContract.send.call({
      method: 'checkKeys',
      boxReferences: boxRefs.slice(0, 8),
    })

    const result3 = await appClientArc4BoxContract.send.call({
      method: 'readBoxes',
      boxReferences: boxRefs.slice(0, 8),
    })

    const [a, b, c, large] = result3.return as unknown as readonly [uint64, Uint8Array, arc4.Str, uint64]
    expect(a).toBe(59n)
    expect(uint8ArrayToUtf8(b)).toBe('Hello')
    expect(c).toBe('World')
    expect(large).toBe(42n)

    await appClientArc4BoxContract.send.call({
      method: 'indirectExtractAndReplace',
      boxReferences: boxRefs.slice(0, 8),
    })

    await appClientArc4BoxContract.send.call({
      method: 'deleteBoxes',
      boxReferences: boxRefs.slice(0, 8),
    })

    const result4 = await appClientArc4BoxContract.send.call({
      method: 'boxesExist',
      boxReferences: boxRefs.slice(0, 8),
    })
    const [aExist4, bExist4, cExist4, largeExist4] = result4.return as unknown as readonly [boolean, boolean, boolean, boolean]
    expect(aExist4).toBe(false)
    expect(bExist4).toBe(false)
    expect(cExist4).toBe(false)
    expect(largeExist4).toBe(false)

    await appClientArc4BoxContract.send.call({
      method: 'sliceBox',
      boxReferences: ['0', 'boxC'],
    })

    await appClientArc4BoxContract.send.call({
      method: 'arc4Box',
      boxReferences: ['d'],
    })

    await appClientArc4BoxContract.send.call({
      method: 'createManyInts',
      boxReferences: ['manyInts', ...boxRefs.slice(0, 4)],
    })

    await appClientArc4BoxContract.send.call({
      method: 'setManyInts',
      args: [1n, 1n],
      boxReferences: ['manyInts', ...boxRefs.slice(0, 4)],
    })
    await appClientArc4BoxContract.send.call({
      method: 'setManyInts',
      args: [2n, 2n],
      boxReferences: ['manyInts', ...boxRefs.slice(0, 4)],
    })
    await appClientArc4BoxContract.send.call({
      method: 'setManyInts',
      args: [256n, 256n],
      boxReferences: ['manyInts', ...boxRefs.slice(0, 4)],
    })
    await appClientArc4BoxContract.send.call({
      method: 'setManyInts',
      args: [511n, 511n],
      boxReferences: ['manyInts', ...boxRefs.slice(0, 4)],
    })
    await appClientArc4BoxContract.send.call({
      method: 'setManyInts',
      args: [512n, 512n],
      boxReferences: ['manyInts', ...boxRefs.slice(0, 4)],
    })

    const sumManyInts = await appClientArc4BoxContract.send.call({
      method: 'sumManyInts',
      boxReferences: ['manyInts', ...boxRefs.slice(0, 4)],
      extraFee: algos(1),
    })
    expect(sumManyInts.return).toBe(1n + 2n + 256n + 511n + 512n)
  })

  it('should work with direct manipulation of box content bytes', async ({ appClientArc4BoxContract }) => {
    await appClientArc4BoxContract.send.call({
      method: 'testBoxRef',
      boxReferences: ['box_ref', 'blob'],
    })
  })

  it('should work with large boolean array in boxes', async ({ appClientArc4BoxContract, algorand, testAccount }) => {
    await appClientArc4BoxContract.send.call({
      method: 'createBools',
      boxReferences: ['tooManyBools', ...Array(7).fill('')],
    })

    await appClientArc4BoxContract.send.call({
      method: 'setBool',
      args: [0, true],
      boxReferences: ['tooManyBools', ...Array(7).fill('')],
    })
    await appClientArc4BoxContract.send.call({
      method: 'setBool',
      args: [42, true],
      boxReferences: ['tooManyBools', ...Array(7).fill('')],
    })
    await appClientArc4BoxContract.send.call({
      method: 'setBool',
      args: [500, true],
      boxReferences: ['tooManyBools', ...Array(7).fill('')],
    })
    await appClientArc4BoxContract.send.call({
      method: 'setBool',
      args: [32_999, true],
      boxReferences: ['tooManyBools', ...Array(7).fill('')],
    })

    const result = await appClientArc4BoxContract.send.call({
      method: 'sumBools',
      args: [3n],
      boxReferences: ['tooManyBools', ...Array(7).fill('')],
      extraFee: algos(1),
    })
    expect(result.return).toBe(3n)

    const boxResponse = await algorand.app.getBoxValue(appClientArc4BoxContract.appId, 'tooManyBools')

    expect(boxResponse.length).toBeGreaterThan(4096)

    const tooManyBools = Array(33_000).fill(false)
    tooManyBools[0] = true
    tooManyBools[42] = true
    tooManyBools[500] = true
    tooManyBools[32_999] = true

    const expectedBytes = new Uint8Array(
      Array.from({ length: Math.ceil(tooManyBools.length / 8) }, (_, index) =>
        tooManyBools
          .slice(index * 8, index * 8 + 8)
          .reverse()
          .reduce((sum, val, bit) => sum + (val ? 1 << bit : 0), 0),
      ),
    )

    expect(boxResponse).toEqual(expectedBytes)
  })
})

const APPROVE = new Uint8Array([0x09, 0x81, 0x01])

describe('LargeBox', () => {
  const test = createArc4TestFixture({ paths: 'tests/approvals/box-proxies.algo.ts', contracts: { LargeBox: { funding: algos(6) } } })

  test('should work with large boxes', async ({ appClientLargeBox, algorand, testAccount }) => {
    const call = await appClientLargeBox.createTransaction.call({
      method: 'test',
      boxReferences: ['large', ...Array(7).fill('')],
      extraFee: algos(1),
    })
    await algorand
      .newGroup()
      .addAppCreate({
        approvalProgram: APPROVE,
        clearStateProgram: APPROVE,
        sender: testAccount.addr,
        boxReferences: Array(5).fill(''),
      })
      .addTransaction(call.transactions[0])
      .send()
  })
})
