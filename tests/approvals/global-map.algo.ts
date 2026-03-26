import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, Bytes, contract, Contract, GlobalMap } from '@algorandfoundation/algorand-typescript'

@contract({ stateTotals: { globalUints: 10, globalBytes: 10 } })
export class TestGlobalMap extends Contract {
  uintMap = GlobalMap<string, uint64>()
  bytesMap = GlobalMap<string, bytes>()
  stringMap = GlobalMap<string, string>()
  prefixedMap = GlobalMap<string, uint64>({ keyPrefix: 'p/' })

  setAndGetUint(key: string, value: uint64) {
    this.uintMap(key).value = value
    assert(this.uintMap(key).value === value, 'uint value should match')
  }

  setAndGetBytes(key: string, value: bytes) {
    this.bytesMap(key).value = value
    assert(this.bytesMap(key).value === value, 'bytes value should match')
  }

  setAndGetString(key: string, value: string) {
    this.stringMap(key).value = value
    assert(this.stringMap(key).value === value, 'string value should match')
  }

  deleteValue(key: string) {
    this.uintMap(key).value = 123
    assert(this.uintMap(key).hasValue, 'should have value before delete')
    this.uintMap(key).delete()
    assert(!this.uintMap(key).hasValue, 'should not have value after delete')
  }

  hasValue(key: string): boolean {
    return this.uintMap(key).hasValue
  }

  testKeyPrefix() {
    assert(this.uintMap.keyPrefix === Bytes('uintMap'), 'default key prefix should be property name')
    assert(this.prefixedMap.keyPrefix === Bytes('p/'), 'explicit key prefix should match')
  }

  testPrefixedMap(key: string, value: uint64) {
    this.prefixedMap(key).value = value
    assert(this.prefixedMap(key).value === value, 'prefixed map value should match')
  }
}

@contract({ stateTotals: { globalBytes: 5, globalUints: 5 } })
export class TestGlobalMapTuple extends Contract {
  mapOfTuples = GlobalMap<string, [string, uint64, boolean]>()
  mapOfObjects = GlobalMap<string, { a: string; b: uint64 }>()

  tupleMap = GlobalMap<[string, uint64, boolean], uint64>()
  objectMap = GlobalMap<{ a: string; b: uint64 }, uint64>()

  testMapOfTuples(a: string, b: uint64, c: boolean) {
    this.mapOfTuples('k1').value = [a, b, c]
    assert(this.mapOfTuples('k1').value[0] === a, 'tuple[0] should match')
    assert(this.mapOfTuples('k1').value[1] === b, 'tuple[1] should match')
    assert(this.mapOfTuples('k1').value[2] === c, 'tuple[2] should match')
  }

  testMapOfObjects(a: string, b: uint64) {
    this.mapOfObjects('k1').value = { a, b }
    assert(this.mapOfObjects('k1').value.a === a, 'object.a should match')
    assert(this.mapOfObjects('k1').value.b === b, 'object.b should match')
  }

  testTupleMap(a: string, b: uint64, c: boolean) {
    this.tupleMap([a, b, c]).value = 99
    assert(this.tupleMap([a, b, c]).value === 99, 'tuple value should match')
  }

  testObjectMap(a: string, b: uint64) {
    this.objectMap({ a, b }).value = 99
    assert(this.objectMap({ a, b }).value === 99, 'object value should match')
  }
}
