import algosdk from 'algosdk'
import { describe, expect } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

// Constants for test data
const VALID_DYNAMIC_STRUCT_BYTES = new Uint8Array([...Array(9).fill(0), 0, 11, 0, 0])
const INVALID_DYNAMIC_STRUCT_BYTES = new Uint8Array([...Array(9).fill(0), 0, 11, 0, 1])

// Helper function to convert size or bytes value to Uint8Array
function convertToBytes(sizeOrBytesValue: Uint8Array | number | (number | Uint8Array)[]): Uint8Array {
  if (sizeOrBytesValue instanceof Uint8Array) {
    return sizeOrBytesValue
  }
  if (typeof sizeOrBytesValue === 'number') {
    return new Uint8Array(sizeOrBytesValue).fill(0)
  }

  // Handle tuple case: (int | bytes)[]
  const totalLength = sizeOrBytesValue.reduce<number>((acc, item) => {
    if (typeof item === 'number') {
      return acc + 2 // numbers are encoded as 2 bytes
    }
    return acc + item.length
  }, 0)

  const result = new Uint8Array(totalLength)
  let offset = 0
  for (const item of sizeOrBytesValue) {
    if (typeof item === 'number') {
      // Convert number to 2-byte big-endian
      const view = new DataView(result.buffer)
      view.setUint16(offset, item, false) // false = big-endian
      offset += 2
    } else {
      result.set(item, offset)
      offset += item.length
    }
  }
  return result
}

describe('abi validation exhaustive', () => {
  const test = createArc4TestFixture('tests/approvals/abi-validation-exhaustive.algo.ts', { AbiValidationExhaustive: {} })
  test.for<[string, number | Uint8Array | (number | Uint8Array)[]]>([
    ['uint64', 8],
    ['ufixed64', 8],
    ['uint8', 1],
    ['bool', 1],
    ['byte', 1],
    ['string', 2],
    ['string', new Uint8Array([0, 4, 0, 0, 0, 0])],
    ['bytes', 2],
    ['bytes', [4, new Uint8Array(4).fill(0)]],
    ['address', 32],
    ['account', 32],
    ['uint512', 64],
    ['uint8_arr', 2],
    ['uint8_arr', new Uint8Array([0, 1, 0])],
    ['uint8_arr3', 3],
    ['bool_arr', new Uint8Array([0, 0])],
    ['bool_arr', new Uint8Array([0, 1, 0])],
    ['bool_arr', new Uint8Array([0, 8, 0])],
    ['bool_arr', new Uint8Array([0, 10, 0, 0])],
    ['static_struct', 9],
    ['dynamic_struct', VALID_DYNAMIC_STRUCT_BYTES],
    ['static_tuple', 9],
    ['dynamic_tuple', VALID_DYNAMIC_STRUCT_BYTES],
    ['static_struct_arr', new Uint8Array([0, 3, ...Array(27).fill(0)])],
    ['static_struct_arr3', 27],
    ['dynamic_struct_arr', 2],
    [
      'dynamic_struct_arr',
      [
        2, // len
        4, // ptr 1
        4 + VALID_DYNAMIC_STRUCT_BYTES.length, // ptr 2
        VALID_DYNAMIC_STRUCT_BYTES,
        VALID_DYNAMIC_STRUCT_BYTES,
      ],
    ],
    [
      'dynamic_struct_arr3',
      [
        6,
        6 + VALID_DYNAMIC_STRUCT_BYTES.length,
        6 + VALID_DYNAMIC_STRUCT_BYTES.length * 2,
        VALID_DYNAMIC_STRUCT_BYTES,
        VALID_DYNAMIC_STRUCT_BYTES,
        VALID_DYNAMIC_STRUCT_BYTES,
      ],
    ],
  ])('%s is valid', async ([typeName, sizeOrBytesValue], { appClientAbiValidationExhaustive }) => {
    const bytesValue = convertToBytes(sizeOrBytesValue)
    const methodName = `validate_${typeName}`
    const method = appClientAbiValidationExhaustive.appSpec.methods.find((m) => m.name === methodName)
    expect(method).toBeDefined()
    const selector = new algosdk.ABIMethod(method!).getSelector()
    await appClientAbiValidationExhaustive.send.bare.call({
      args: [selector, bytesValue],
    })
  })
  test.for<[string, number | Uint8Array | (number | Uint8Array)[], string]>([
    ['uint64', 7, 'invalid number of bytes'],
    ['ufixed64', 7, 'invalid number of bytes'],
    ['uint8', 2, 'invalid number of bytes'],
    ['bool', 2, 'invalid number of bytes'],
    ['byte', 2, 'invalid number of bytes'],
    ['string', 5, 'invalid number of bytes'],
    ['bytes', 5, 'invalid number of bytes'],
    ['address', 0, 'invalid number of bytes'],
    ['address', 33, 'invalid number of bytes'],
    ['account', 0, 'invalid number of bytes'],
    ['account', 33, 'invalid number of bytes'],
    ['uint512', 63, 'invalid number of bytes'],
    ['uint8_arr', 1, 'invalid array length header'],
    ['uint8_arr', 3, 'invalid number of bytes'],
    ['uint8_arr3', 1, 'invalid number of bytes'],
    ['uint8_arr3', 4, 'invalid number of bytes'],
    ['bool_arr', new Uint8Array([0, 1]), 'invalid number of bytes'],
    ['bool_arr', new Uint8Array([0, 9, 0]), 'invalid number of bytes'],
    ['static_struct', 8, 'invalid number of bytes'],
    ['dynamic_struct', 0, 'invalid tuple encoding'],
    ['dynamic_struct', 11, 'invalid tail pointer'],
    ['dynamic_struct', INVALID_DYNAMIC_STRUCT_BYTES, 'invalid number of bytes'],
    ['static_tuple', 8, 'invalid number of bytes'],
    ['dynamic_tuple', 0, 'invalid tuple encoding'],
    ['dynamic_tuple', 11, 'invalid tail pointer'],
    ['dynamic_tuple', INVALID_DYNAMIC_STRUCT_BYTES, 'invalid number of bytes'],
    ['static_struct_arr', 0, 'invalid array length header'],
    ['static_struct_arr', 1, 'invalid array length header'],
    ['static_struct_arr', 29, 'invalid number of bytes'],
    ['static_struct_arr3', 26, 'invalid number of bytes'],
    ['dynamic_struct_arr', 0, 'invalid array length header'],
    ['dynamic_struct_arr', 1, 'invalid array length header'],
    ['dynamic_struct_arr', 29, 'invalid number of bytes'],
    ['dynamic_struct_arr3', 27, 'invalid tail pointer'],
    [
      'dynamic_struct_arr3',
      [6, 6, 6, VALID_DYNAMIC_STRUCT_BYTES, VALID_DYNAMIC_STRUCT_BYTES, VALID_DYNAMIC_STRUCT_BYTES],
      'invalid tail pointer',
    ],
    ['dynamic_struct_arr3', 0, 'invalid array encoding'],
    [
      'dynamic_struct_arr3',
      [
        6,
        6 + VALID_DYNAMIC_STRUCT_BYTES.length,
        6 + VALID_DYNAMIC_STRUCT_BYTES.length * 2,
        VALID_DYNAMIC_STRUCT_BYTES,
        VALID_DYNAMIC_STRUCT_BYTES,
        INVALID_DYNAMIC_STRUCT_BYTES,
      ],
      'invalid number of bytes',
    ],
  ])('%s with %s raises %s', async ([typeName, sizeOrBytesValue, expectedError], { appClientAbiValidationExhaustive }) => {
    const bytesValue = convertToBytes(sizeOrBytesValue)
    const methodName = `validate_${typeName}`
    const method = appClientAbiValidationExhaustive.appSpec.methods.find((m) => m.name === methodName)
    expect(method).toBeDefined()
    const selector = new algosdk.ABIMethod(method!).getSelector()
    await expect(
      appClientAbiValidationExhaustive.send.bare.call({
        args: [selector, bytesValue],
      }),
    ).rejects.toThrow(expectedError)
  })

  test.for<[string, number | Uint8Array | (number | Uint8Array)[]]>([
    ['static_struct', 9],
    ['dynamic_struct', VALID_DYNAMIC_STRUCT_BYTES],
    ['static_struct_arr', new Uint8Array([0, 3, ...Array(27).fill(0)])],
    ['static_struct_arr3', 27],
    ['dynamic_struct_arr', 2],
    [
      'dynamic_struct_arr',
      [
        2, // len
        4, // ptr 1
        4 + VALID_DYNAMIC_STRUCT_BYTES.length, // ptr 2
        VALID_DYNAMIC_STRUCT_BYTES,
        VALID_DYNAMIC_STRUCT_BYTES,
      ],
    ],
    [
      'dynamic_struct_arr3',
      [
        6,
        6 + VALID_DYNAMIC_STRUCT_BYTES.length,
        6 + VALID_DYNAMIC_STRUCT_BYTES.length * 2,
        VALID_DYNAMIC_STRUCT_BYTES,
        VALID_DYNAMIC_STRUCT_BYTES,
        VALID_DYNAMIC_STRUCT_BYTES,
      ],
    ],
  ])('native %s is valid', async ([typeName, sizeOrBytesValue], { appClientAbiValidationExhaustive }) => {
    const bytesValue = convertToBytes(sizeOrBytesValue)
    const methodName = `validate_native_${typeName}`
    const method = appClientAbiValidationExhaustive.appSpec.methods.find((m) => m.name === methodName)
    expect(method).toBeDefined()
    const selector = new algosdk.ABIMethod(method!).getSelector()
    await appClientAbiValidationExhaustive.send.bare.call({
      args: [selector, bytesValue],
    })
  })
  test.for<[string, number | Uint8Array | (number | Uint8Array)[], string]>([
    ['static_struct', 8, 'invalid number of bytes'],
    ['dynamic_struct', 0, 'invalid tuple encoding'],
    ['dynamic_struct', 11, 'invalid tail pointer'],
    ['dynamic_struct', INVALID_DYNAMIC_STRUCT_BYTES, 'invalid number of bytes'],
    ['static_struct_arr', 0, 'invalid array length header'],
    ['static_struct_arr', 1, 'invalid array length header'],
    ['static_struct_arr', 29, 'invalid number of bytes'],
    ['static_struct_arr3', 26, 'invalid number of bytes'],
    ['dynamic_struct_arr', 0, 'invalid array length header'],
    ['dynamic_struct_arr', 1, 'invalid array length header'],
    ['dynamic_struct_arr', 29, 'invalid number of bytes'],
    ['dynamic_struct_arr3', 27, 'invalid tail pointer'],
    [
      'dynamic_struct_arr3',
      [6, 6, 6, VALID_DYNAMIC_STRUCT_BYTES, VALID_DYNAMIC_STRUCT_BYTES, VALID_DYNAMIC_STRUCT_BYTES],
      'invalid tail pointer',
    ],
    [
      'dynamic_struct_arr3',
      [
        6,
        6 + VALID_DYNAMIC_STRUCT_BYTES.length,
        6 + VALID_DYNAMIC_STRUCT_BYTES.length * 2,
        VALID_DYNAMIC_STRUCT_BYTES,
        VALID_DYNAMIC_STRUCT_BYTES,
        INVALID_DYNAMIC_STRUCT_BYTES,
      ],
      'invalid number of bytes',
    ],
  ])('%s with %s raises %s', async ([typeName, sizeOrBytesValue, expectedError], { appClientAbiValidationExhaustive }) => {
    const bytesValue = convertToBytes(sizeOrBytesValue)
    const methodName = `validate_native_${typeName}`
    const method = appClientAbiValidationExhaustive.appSpec.methods.find((m) => m.name === methodName)
    expect(method).toBeDefined()
    const selector = new algosdk.ABIMethod(method!).getSelector()
    await expect(
      appClientAbiValidationExhaustive.send.bare.call({
        args: [selector, bytesValue],
      }),
    ).rejects.toThrow(expectedError)
  })
})
