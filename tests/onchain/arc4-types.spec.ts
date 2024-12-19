import { describe } from 'vitest'
import { bigIntToUint8Array, utf8ToUint8Array } from '../../src/util'
import { createArc4TestFixture, createBaseTestFixture } from './util/test-fixture'

describe('arc4-types', () => {
  const test = createBaseTestFixture('tests/approvals/arc4-types.algo.ts', ['Arc4TypesTestContract'])

  test('runs', async ({ Arc4TypesTestContractInvoker }) => {
    await Arc4TypesTestContractInvoker.send()
  })
})

describe('arc4-struct', () => {
  const test = createArc4TestFixture('tests/approvals/arc4-struct.algo.ts', { StructDemo: {} })

  test('testVectorCreationAndEquality', async ({ appClientStructDemo }) => {
    await appClientStructDemo.send.call({ method: 'testVectorCreationAndEquality' })
  })
  test('add vectors', async ({ appClientStructDemo, expect }) => {
    const v1 = { x: 100, y: 100 }
    const v2 = { x: 50, y: 50 }
    const result = await appClientStructDemo.send.call({ method: 'addVectors', args: [v1, v2] })
    expect(result.return).toStrictEqual({ x: 150n, y: 150n })
  })
  test('implicit casting and spreading', async ({ appClientStructDemo, expect }) => {
    const v1 = { x: 123, y: 456 }
    await appClientStructDemo.send.call({ method: 'implicitCastingAndSpreading', args: [v1] })
  })
})
describe('arc4-encode-decode', () => {
  const test = createArc4TestFixture('tests/approvals/arc4-encode-decode.algo.ts', { Arc4EncodeDecode: {} })
  test('encoding', async ({ appClientArc4EncodeDecode, expect }) => {
    await appClientArc4EncodeDecode.send.call({
      method: 'testEncoding',
      args: [234234, true, 340943934n, new Uint8Array([1, 2, 3, 4, 5]), 'hello world'],
    })
  })
  test('decoding', async ({ appClientArc4EncodeDecode, expect }) => {
    await appClientArc4EncodeDecode.send.call({
      method: 'testDecoding',
      args: [
        234234,
        bigIntToUint8Array(234234n, 8),
        true,
        bigIntToUint8Array(128n, 1),
        340943934n,
        bigIntToUint8Array(340943934n, 8),
        'hello world',
        new Uint8Array([...bigIntToUint8Array(BigInt('hello world'.length), 2), ...utf8ToUint8Array('hello world')]),
        { a: 50n, b: new Uint8Array([1, 2, 3, 4, 5]) },
        new Uint8Array([...bigIntToUint8Array(50n, 8), 0, 10, 0, 5, 1, 2, 3, 4, 5]),
      ],
    })
  })
})
