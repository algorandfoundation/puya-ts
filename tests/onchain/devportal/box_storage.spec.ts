import { microAlgos } from '@algorandfoundation/algokit-utils'
import { beforeEach, describe, expect } from 'vitest'
import { bigIntToUint8Array, utf8ToUint8Array } from '../../../src/util'
import { createArc4TestFixture } from '../util/test-fixture'

// Behaviour tests for examples/devportal/box_storage.
// Box storage needs the app funded for the box min-balance requirement (MBR), and each box a
// call touches must be declared in `boxReferences`.
describe('devportal box_storage example', () => {
  const test = createArc4TestFixture({
    paths: 'examples/devportal/box_storage/contract.algo.ts',
    contracts: { BoxStorage: { funding: microAlgos(10_000_000) } },
    // Several tests assert on box absence/defaults, so each test needs a fresh app.
    newScopeAt: beforeEach,
  })

  // boxMap has an empty key prefix, so its box name is the 8-byte big-endian key.
  const boxMapRef = (key: bigint) => bigIntToUint8Array(key, 8)
  // boxMapStruct has the 'users' prefix.
  const boxMapStructRef = (key: bigint) => new Uint8Array([...utf8ToUint8Array('users'), ...bigIntToUint8Array(key, 8)])

  test('sets and gets a uint64 box', async ({ appClientBoxStorage }) => {
    await appClientBoxStorage.send.call({ method: 'setBox', args: [42], boxReferences: ['boxInt'] })

    const get = await appClientBoxStorage.send.call({ method: 'getBox', boxReferences: ['boxInt'] })
    expect(get.return).toBe(42n)

    const length = await appClientBoxStorage.send.call({ method: 'boxIntLength', boxReferences: ['boxInt'] })
    expect(length.return).toBe(8n)

    const key = await appClientBoxStorage.send.call({ method: 'keyBox', boxReferences: ['boxInt'] })
    expect(key.return).toStrictEqual(utf8ToUint8Array('boxInt'))
  })

  test('maybeBox reports presence and absence', async ({ appClientBoxStorage }) => {
    const absent = await appClientBoxStorage.send.call({ method: 'maybeBox', boxReferences: ['boxInt'] })
    expect(absent.return).toStrictEqual([0n, false])

    await appClientBoxStorage.send.call({ method: 'setBox', args: [7], boxReferences: ['boxInt'] })

    const present = await appClientBoxStorage.send.call({ method: 'maybeBox', boxReferences: ['boxInt'] })
    expect(present.return).toStrictEqual([7n, true])
  })

  test('sets and gets a box map value', async ({ appClientBoxStorage }) => {
    await appClientBoxStorage.send.call({ method: 'setBoxMap', args: [1, 'hello'], boxReferences: [boxMapRef(1n)] })

    const get = await appClientBoxStorage.send.call({ method: 'getItemBoxMap', args: [1], boxReferences: [boxMapRef(1n)] })
    expect(get.return).toBe('hello')

    const exists = await appClientBoxStorage.send.call({ method: 'boxMapExists', args: [1], boxReferences: [boxMapRef(1n)] })
    expect(exists.return).toBe(true)

    const length = await appClientBoxStorage.send.call({ method: 'boxMapLength', args: [1], boxReferences: [boxMapRef(1n)] })
    expect(length.return).toBe(5n)
  })

  test('getBoxMap returns the default when missing, else the value', async ({ appClientBoxStorage }) => {
    const absent = await appClientBoxStorage.send.call({ method: 'getBoxMap', boxReferences: [boxMapRef(1n)] })
    expect(absent.return).toBe('default')

    await appClientBoxStorage.send.call({ method: 'setBoxMap', args: [1, 'one'], boxReferences: [boxMapRef(1n)] })

    const present = await appClientBoxStorage.send.call({ method: 'getBoxMap', boxReferences: [boxMapRef(1n)] })
    expect(present.return).toBe('one')
  })

  test('maybeBoxMap reports presence and absence', async ({ appClientBoxStorage }) => {
    const absent = await appClientBoxStorage.send.call({ method: 'maybeBoxMap', boxReferences: [boxMapRef(1n)] })
    expect(absent.return).toStrictEqual(['', false])

    await appClientBoxStorage.send.call({ method: 'setBoxMap', args: [1, 'hello'], boxReferences: [boxMapRef(1n)] })

    const present = await appClientBoxStorage.send.call({ method: 'maybeBoxMap', boxReferences: [boxMapRef(1n)] })
    expect(present.return).toStrictEqual(['hello', true])
  })

  test('reading a missing uint64 box fails on-chain', async ({ appClientBoxStorage }) => {
    await expect(appClientBoxStorage.send.call({ method: 'getBox', boxReferences: ['boxInt'] })).rejects.toThrow()
  })

  test('reading a missing box map key fails on-chain', async ({ appClientBoxStorage }) => {
    await expect(
      appClientBoxStorage.send.call({ method: 'getItemBoxMap', args: [404], boxReferences: [boxMapRef(404n)] }),
    ).rejects.toThrow()
  })

  test('a subroutine reading a missing box map key fails on-chain', async ({ appClientBoxStorage }) => {
    // the subroutine indexes boxMap(key + 1), which was never written
    await expect(
      appClientBoxStorage.send.call({
        method: 'readBoxPassedToSubroutine',
        args: [500],
        boxReferences: [boxMapRef(500n), boxMapRef(501n)],
      }),
    ).rejects.toThrow()
  })

  test('reads a box passed to a subroutine', async ({ appClientBoxStorage }) => {
    // getBoxMapValueFromKeyPlus1 reads boxMap(key + 1).
    await appClientBoxStorage.send.call({ method: 'setBoxMap', args: [3, 'world'], boxReferences: [boxMapRef(3n)] })

    const get = await appClientBoxStorage.send.call({
      method: 'readBoxPassedToSubroutine',
      args: [2],
      boxReferences: [boxMapRef(3n)],
    })
    expect(get.return).toBe('world')
  })

  test('sets, reads and measures a struct box map', async ({ appClientBoxStorage }) => {
    const value = { name: 'testName', id: 70n, asset: 2n }

    const set = await appClientBoxStorage.send.call({
      method: 'setBoxMapStruct',
      args: [5, value],
      boxReferences: [boxMapStructRef(5n)],
    })
    expect(set.return).toBe(true)

    const get = await appClientBoxStorage.send.call({
      method: 'getBoxMapStruct',
      args: [5],
      boxReferences: [boxMapStructRef(5n)],
    })
    expect(get.return).toStrictEqual({ name: 'testName', id: 70n, asset: 2n })

    const exists = await appClientBoxStorage.send.call({
      method: 'boxMapStructExists',
      args: [5],
      boxReferences: [boxMapStructRef(5n)],
    })
    expect(exists.return).toBe(true)
  })

  test('reports struct box map existence flags', async ({ appClientBoxStorage }) => {
    const absent = await appClientBoxStorage.send.call({
      method: 'boxMapStructExists',
      args: [2],
      boxReferences: [boxMapStructRef(2n)],
    })
    expect(absent.return).toBe(false)

    await appClientBoxStorage.send.call({
      method: 'setBoxMapStruct',
      args: [2, { name: 'bob', id: 9n, asset: 3n }],
      boxReferences: [boxMapStructRef(2n)],
    })

    const present = await appClientBoxStorage.send.call({
      method: 'boxMapStructExists',
      args: [2],
      boxReferences: [boxMapStructRef(2n)],
    })
    expect(present.return).toBe(true)
  })

  test('measures a struct box map length', async ({ appClientBoxStorage }) => {
    // boxMapStructLength writes to key 0 internally and asserts the on-chain length.
    const length = await appClientBoxStorage.send.call({
      method: 'boxMapStructLength',
      boxReferences: [boxMapStructRef(0n)],
    })
    expect(length.return).toBe(true)
  })

  test('reading a missing struct box map key fails on-chain', async ({ appClientBoxStorage }) => {
    await expect(
      appClientBoxStorage.send.call({ method: 'getBoxMapStruct', args: [404], boxReferences: [boxMapStructRef(404n)] }),
    ).rejects.toThrow()
  })

  test('sets a heterogeneous set of boxes and reads them', async ({ appClientBoxStorage }) => {
    await appClientBoxStorage.send.call({
      method: 'setBoxExample',
      args: [5, utf8ToUint8Array('dyn'), 'str'],
      boxReferences: ['boxInt', 'b', 'BOX_STRING', 'BOX_BYTES'],
    })

    const get = await appClientBoxStorage.send.call({
      method: 'getBoxExample',
      boxReferences: ['boxInt', 'b', 'BOX_STRING'],
    })
    // setBoxExample writes 5 then adds 3 in place.
    expect(get.return).toStrictEqual([8n, utf8ToUint8Array('dyn'), 'str'])
  })

  test('reports box existence flags', async ({ appClientBoxStorage }) => {
    const before = await appClientBoxStorage.send.call({
      method: 'existBox',
      boxReferences: ['boxInt', 'b', 'BOX_STRING', 'BOX_BYTES'],
    })
    expect(before.return).toStrictEqual([false, false, false, false])

    await appClientBoxStorage.send.call({
      method: 'setBoxExample',
      args: [5, utf8ToUint8Array('dyn'), 'str'],
      boxReferences: ['boxInt', 'b', 'BOX_STRING', 'BOX_BYTES'],
    })

    const after = await appClientBoxStorage.send.call({
      method: 'existBox',
      boxReferences: ['boxInt', 'b', 'BOX_STRING', 'BOX_BYTES'],
    })
    expect(after.return).toStrictEqual([true, true, true, true])
  })

  test('deletes boxes', async ({ appClientBoxStorage }) => {
    await appClientBoxStorage.send.call({
      method: 'setBoxExample',
      args: [5, utf8ToUint8Array('dyn'), 'str'],
      boxReferences: ['boxInt', 'b', 'BOX_STRING', 'BOX_BYTES'],
    })

    await appClientBoxStorage.send.call({
      method: 'deleteBox',
      boxReferences: ['boxInt', 'b', 'BOX_STRING'],
    })

    const exists = await appClientBoxStorage.send.call({
      method: 'existBox',
      boxReferences: ['boxInt', 'b', 'BOX_STRING', 'BOX_BYTES'],
    })
    expect(exists.return).toStrictEqual([false, false, false, true])
  })

  test('deletes a box map entry', async ({ appClientBoxStorage }) => {
    await appClientBoxStorage.send.call({ method: 'setBoxMap', args: [8, 'gone'], boxReferences: [boxMapRef(8n)] })
    await appClientBoxStorage.send.call({ method: 'deleteBoxMap', args: [8], boxReferences: [boxMapRef(8n)] })

    const exists = await appClientBoxStorage.send.call({ method: 'boxMapExists', args: [8], boxReferences: [boxMapRef(8n)] })
    expect(exists.return).toBe(false)
  })

  test('exposes box map key prefix', async ({ appClientBoxStorage }) => {
    const prefix = await appClientBoxStorage.send.call({ method: 'keyPrefixBoxMap' })
    expect(prefix.return).toStrictEqual(new Uint8Array([]))
  })

  test('checks declared box keys', async ({ appClientBoxStorage }) => {
    await appClientBoxStorage.send.call({ method: 'keyBoxExample' })
  })

  test('extracts and splices bytes within a fixed-size box', async ({ appClientBoxStorage }) => {
    await appClientBoxStorage.send.call({ method: 'extractBox', boxReferences: ['blob'] })
  })

  test('slices bytes out of boxes', async ({ appClientBoxStorage }) => {
    await appClientBoxStorage.send.call({ method: 'sliceBox', boxReferences: ['scratch', 'BOX_STRING'] })
  })

  test('reads an arc4 static array box', async ({ appClientBoxStorage }) => {
    await appClientBoxStorage.send.call({ method: 'arc4Box', boxReferences: ['d'] })
  })

  test('writes and sums a nested struct box', async ({ appClientBoxStorage }) => {
    await appClientBoxStorage.send.call({ method: 'nestedStructWrite', args: [10], boxReferences: ['boxNested'] })

    const sum = await appClientBoxStorage.send.call({ method: 'nestedStructSum', boxReferences: ['boxNested'] })
    // a=10, b=13, inner.c=11, inner.d=12, arr=[0,1,2] -> 10+13+11+12+0+1+2
    expect(sum.return).toBe(49n)
  })

  test('summing a nested struct box before any write fails on-chain', async ({ appClientBoxStorage }) => {
    await expect(appClientBoxStorage.send.call({ method: 'nestedStructSum', boxReferences: ['boxNested'] })).rejects.toThrow()
  })
})
