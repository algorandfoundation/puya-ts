import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, assert, Bytes, contract, Contract, LocalMap, Txn } from '@algorandfoundation/algorand-typescript'

@contract({ stateTotals: { localUints: 8, localBytes: 8 } })
export class TestLocalMap extends Contract {
  uintMap = LocalMap<string, uint64>()
  bytesMap = LocalMap<string, bytes>()
  stringMap = LocalMap<string, string>()
  prefixedMap = LocalMap<string, uint64>({ keyPrefix: 'p/' })

  @abimethod({ allowActions: 'OptIn' })
  optIn() {}

  setAndGetUint(key: string, value: uint64) {
    this.uintMap(key, Txn.sender).value = value
    assert(this.uintMap(key, Txn.sender).value === value, 'uint value should match')
  }

  setAndGetBytes(key: string, value: bytes) {
    this.bytesMap(key, Txn.sender).value = value
    assert(this.bytesMap(key, Txn.sender).value === value, 'bytes value should match')
  }

  setAndGetString(key: string, value: string) {
    this.stringMap(key, Txn.sender).value = value
    assert(this.stringMap(key, Txn.sender).value === value, 'string value should match')
  }

  deleteValue(key: string) {
    this.uintMap(key, Txn.sender).value = 123
    assert(this.uintMap(key, Txn.sender).hasValue, 'should have value before delete')
    this.uintMap(key, Txn.sender).delete()
    assert(!this.uintMap(key, Txn.sender).hasValue, 'should not have value after delete')
  }

  hasValue(key: string): boolean {
    return this.uintMap(key, Txn.sender).hasValue
  }

  testKeyPrefix() {
    assert(this.uintMap.keyPrefix === Bytes('uintMap'), 'default key prefix should be property name')
    assert(this.prefixedMap.keyPrefix === Bytes('p/'), 'explicit key prefix should match')
  }

  testPrefixedMap(key: string, value: uint64) {
    this.prefixedMap(key, Txn.sender).value = value
    assert(this.prefixedMap(key, Txn.sender).value === value, 'prefixed map value should match')
  }

  setAndGetUintViaLocalState(key: string, value: uint64) {
    this.uintMap(key)(Txn.sender).value = value
    assert(this.uintMap(key)(Txn.sender).value === value, 'uint value via LocalState should match')
  }
}

@contract({ stateTotals: { localBytes: 5, localUints: 5 } })
export class TestLocalMapTuple extends Contract {
  mapOfTuples = LocalMap<string, [string, uint64, boolean]>()
  mapOfObjects = LocalMap<string, { a: string; b: uint64 }>()

  tupleMap = LocalMap<[string, uint64, boolean], uint64>()
  objectMap = LocalMap<{ a: string; b: uint64 }, uint64>()

  @abimethod({ allowActions: 'OptIn' })
  optIn() {}

  testMapOfTuples(a: string, b: uint64, c: boolean) {
    this.mapOfTuples('k1', Txn.sender).value = [a, b, c]
    assert(this.mapOfTuples('k1', Txn.sender).value[0] === a, 'tuple[0] should match')
    assert(this.mapOfTuples('k1', Txn.sender).value[1] === b, 'tuple[1] should match')
    assert(this.mapOfTuples('k1')(Txn.sender).value[2] === c, 'tuple[2] should match')
  }

  testMapOfObjects(a: string, b: uint64) {
    this.mapOfObjects('k1', Txn.sender).value = { a, b }
    assert(this.mapOfObjects('k1')(Txn.sender).value.a === a, 'object.a should match')
    assert(this.mapOfObjects('k1', Txn.sender).value.b === b, 'object.b should match')
  }

  testTupleMap(a: string, b: uint64, c: boolean) {
    this.tupleMap([a, b, c])(Txn.sender).value = 99
    assert(this.tupleMap([a, b, c], Txn.sender).value === 99, 'tuple value should match')
  }

  testObjectMap(a: string, b: uint64) {
    this.objectMap({ a, b }, Txn.sender).value = 99
    assert(this.objectMap({ a, b }, Txn.sender).value === 99, 'object value should match')
  }
}
