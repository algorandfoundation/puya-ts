import { beforeEach, describe, expect } from 'vitest'
import { uint8ArrayToHex } from '../../../src/util'
import { createArc4TestFixture } from '../util/test-fixture'

// Behaviour tests for examples/devportal/arc4_types.
describe('devportal arc4_types example', () => {
  const test = createArc4TestFixture({
    paths: 'examples/devportal/arc4_types/contract.algo.ts',
    contracts: {
      Arc4Types: {},
      Arc4StaticArray: {},
      Arc4DynamicArray: {},
      Arc4Struct: {},
      Arc4Tuple: {},
      Arc4Codec: {},
    },
    // Fresh deploy per test so global-state contracts start clean each time.
    newScopeAt: beforeEach,
  })

  // Arc4Types --------------------------------------------------------------
  test('adds two arc4 Uint64 values', async ({ appClientArc4Types }) => {
    const result = await appClientArc4Types.send.call({ method: 'addArc4Uint64', args: [10, 32] })
    expect(result.return).toBe(42n)
  })

  test('adds mixed-width arc4 uints', async ({ appClientArc4Types }) => {
    const result = await appClientArc4Types.send.call({ method: 'addArc4UintN', args: [1, 2, 3, 4] })
    expect(result.return).toBe(10n)
  })

  test('adds biguint-width arc4 uints', async ({ appClientArc4Types }) => {
    const result = await appClientArc4Types.send.call({ method: 'addArc4BiguintN', args: [100n, 200n, 300n] })
    expect(result.return).toBe(600n)
  })

  test('increments an arc4 Byte', async ({ appClientArc4Types }) => {
    const result = await appClientArc4Types.send.call({ method: 'arc4Byte', args: [41] })
    // arc4.Byte (a single uint8) decodes to a plain number
    expect(result.return).toBe(42)
  })

  test('reads the balance behind an arc4 Address', async ({ appClientArc4Types, testAccount }) => {
    const result = await appClientArc4Types.send.call({ method: 'arc4AddressBalance', args: [testAccount.addr.toString()] })
    expect(typeof result.return).toBe('bigint')
    expect(result.return).toBeGreaterThan(0n)
  })

  test('roundtrips an arc4 Address', async ({ appClientArc4Types, testAccount }) => {
    const result = await appClientArc4Types.send.call({ method: 'arc4AddressRoundtrip', args: [testAccount.addr.toString()] })
    expect(result.return).toBe(testAccount.addr.toString())
  })

  // Arc4StaticArray --------------------------------------------------------
  test('exercises arc4 static arrays', async ({ appClientArc4StaticArray }) => {
    // Method asserts internally and returns void; success means all asserts passed.
    const result = await appClientArc4StaticArray.send.call({ method: 'arc4StaticArray' })
    expect(result.return).toBeUndefined()
  })

  // Arc4DynamicArray -------------------------------------------------------
  test('builds a dynamic array of arc4 strings', async ({ appClientArc4DynamicArray }) => {
    const result = await appClientArc4DynamicArray.send.call({ method: 'goodbye', args: ['Alice'] })
    expect(result.return).toStrictEqual(['Good bye ', 'Alice'])
  })

  test('concatenates the greeting parts into a native string', async ({ appClientArc4DynamicArray }) => {
    // dynamicStringArray = ['Hello '] then extended with [name, '!']
    const result = await appClientArc4DynamicArray.send.call({ method: 'hello', args: ['world'] })
    expect(result.return).toBe('Hello world!')
  })

  test('concatenates arc4 dynamic bytes', async ({ appClientArc4DynamicArray }) => {
    // start b'\xff\xff\xff' then concat b'\xaa\xbb\xcc'
    const result = await appClientArc4DynamicArray.send.call({ method: 'arc4DynamicBytes' })
    expect(uint8ArrayToHex(result.return as Uint8Array).toLowerCase()).toBe('ffffffaabbcc')
  })

  // Arc4Struct -------------------------------------------------------------
  test('adds todos and completes one, leaving the other untouched', async ({ appClientArc4Struct }) => {
    // structs nested inside an array return decode as positional tuples of their field values
    let result = await appClientArc4Struct.send.call({ method: 'addTodo', args: ['buy milk'] })
    expect(result.return).toStrictEqual([['buy milk', false]])

    result = await appClientArc4Struct.send.call({ method: 'addTodo', args: ['walk dog'] })
    expect(result.return).toStrictEqual([
      ['buy milk', false],
      ['walk dog', false],
    ])

    const completed = await appClientArc4Struct.send.call({ method: 'completeTodo', args: ['buy milk'] })
    expect(completed.return).toBeUndefined()

    // a single arc4.Struct return decodes as a named object of field name -> value
    const returned = await appClientArc4Struct.send.call({ method: 'returnTodo', args: ['buy milk'] })
    expect(returned.return).toStrictEqual({ task: 'buy milk', completed: true })

    // untouched todo stays incomplete
    const walkDog = await appClientArc4Struct.send.call({ method: 'returnTodo', args: ['walk dog'] })
    expect(walkDog.return).toStrictEqual({ task: 'walk dog', completed: false })
  })

  test('returnTodo rejects when the task is missing', async ({ appClientArc4Struct }) => {
    await expect(appClientArc4Struct.send.call({ method: 'returnTodo', args: ['nonexistent'] })).rejects.toThrow(/todo not found/)
  })

  test('completeTodo on a missing task is a no-op', async ({ appClientArc4Struct }) => {
    await appClientArc4Struct.send.call({ method: 'addTodo', args: ['buy milk'] })

    // completing a task that is not in the list succeeds without changes
    const noop = await appClientArc4Struct.send.call({ method: 'completeTodo', args: ['nonexistent'] })
    expect(noop.return).toBeUndefined()

    const existing = await appClientArc4Struct.send.call({ method: 'returnTodo', args: ['buy milk'] })
    expect(existing.return).toStrictEqual({ task: 'buy milk', completed: false })
  })

  // Arc4Tuple --------------------------------------------------------------
  test('stores contact info tuple and returns the phone number', async ({ appClientArc4Tuple }) => {
    const contact: [string, string, bigint] = ['Alice', 'alice@something.com', 555_555_555n]
    const result = await appClientArc4Tuple.send.call({ method: 'addContactInfo', args: [contact] })
    expect(result.return).toBe(555_555_555n)

    const stored = await appClientArc4Tuple.send.call({ method: 'returnContact' })
    expect(stored.return).toStrictEqual(['Alice', 'alice@something.com', 555_555_555n])
  })

  test('addContactInfo rejects a contact with the wrong values', async ({ appClientArc4Tuple }) => {
    const contact: [string, string, bigint] = ['Bob', 'alice@something.com', 555_555_555n]
    await expect(appClientArc4Tuple.send.call({ method: 'addContactInfo', args: [contact] })).rejects.toThrow(/unexpected name/)
  })

  // Arc4Codec --------------------------------------------------------------
  test('encodes then decodes a uint64 roundtrip', async ({ appClientArc4Codec }) => {
    const result = await appClientArc4Codec.send.call({ method: 'encodeDecode', args: [123456789] })
    expect(result.return).toBe(123456789n)
  })

  test('decodes raw bytes into an arc4 Uint64', async ({ appClientArc4Codec }) => {
    // 8-byte big-endian encoding of 42
    const raw = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 42])
    const result = await appClientArc4Codec.send.call({ method: 'decodeUnvalidated', args: [raw] })
    expect(result.return).toBe(42n)
  })
})
