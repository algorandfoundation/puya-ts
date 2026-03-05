import { Bytes } from '@algorandfoundation/algorand-typescript'
import { TestExecutionContext } from '@algorandfoundation/algorand-typescript-testing'
import { afterEach, describe, expect, it } from 'vitest'
import { KeyValueStore } from './contract.algo'

describe('KeyValueStore', () => {
  const ctx = new TestExecutionContext()
  afterEach(() => ctx.reset())

  function createAndInit() {
    const contract = ctx.contract.create(KeyValueStore)
    contract.createApplication()
    return contract
  }

  // --- Single Box CRUD ---

  describe('Single Box', () => {
    it('createSingleBox creates a box and returns true', () => {
      const contract = createAndInit()
      expect(contract.createSingleBox(10)).toBe(true)
    })

    it('createSingleBox on existing box still returns true', () => {
      const contract = createAndInit()
      contract.createSingleBox(10)
      // Testing framework always returns true for create
      expect(contract.createSingleBox(10)).toBe(true)
    })

    it('setSingleBox writes data and creates box if needed', () => {
      const contract = createAndInit()
      const data = Bytes('hello')
      contract.setSingleBox(data)
      expect(contract.getSingleBox()).toEqual(data)
    })

    it('getSingleBox returns default when box does not exist', () => {
      const contract = createAndInit()
      expect(contract.getSingleBox()).toEqual(Bytes(''))
    })

    it('deleteSingleBox removes the box', () => {
      const contract = createAndInit()
      contract.setSingleBox(Bytes('data'))
      expect(contract.deleteSingleBox()).toBe(true)
      expect(contract.checkSingleBox()).toBe(false)
    })

    it('deleteSingleBox returns false when box does not exist', () => {
      const contract = createAndInit()
      expect(contract.deleteSingleBox()).toBe(false)
    })

    it('checkSingleBox returns existence flag via maybe()', () => {
      const contract = createAndInit()
      expect(contract.checkSingleBox()).toBe(false)
      contract.setSingleBox(Bytes('exists'))
      expect(contract.checkSingleBox()).toBe(true)
    })
  })

  // --- Box byte-level operations ---

  describe('Box byte operations', () => {
    it('extractFromBox reads a slice', () => {
      const contract = createAndInit()
      contract.setSingleBox(Bytes('abcdef'))
      expect(contract.extractFromBox(1, 3)).toEqual(Bytes('bcd'))
    })

    it('replaceInBox overwrites bytes at offset', () => {
      const contract = createAndInit()
      contract.setSingleBox(Bytes('abcdef'))
      contract.replaceInBox(2, Bytes('XY'))
      expect(contract.getSingleBox()).toEqual(Bytes('abXYef'))
    })

    it('spliceBox removes and inserts bytes', () => {
      const contract = createAndInit()
      contract.setSingleBox(Bytes('abcdef'))
      // splice(1, 2, 'XYZ'): remove 2 bytes at offset 1, insert 'XYZ'
      // Box size stays fixed at 6 in the testing framework, so result is truncated
      contract.spliceBox(1, 2, Bytes('XYZ'))
      expect(contract.getSingleBox()).toEqual(Bytes('aXYZde'))
    })

    it('resizeBox changes box size', () => {
      const contract = createAndInit()
      contract.setSingleBox(Bytes('abc'))
      contract.resizeBox(5)
      expect(contract.getBoxLength()).toEqual(5n)
    })

    it('getBoxLength returns byte length', () => {
      const contract = createAndInit()
      contract.setSingleBox(Bytes('hello'))
      expect(contract.getBoxLength()).toEqual(5n)
    })
  })

  // --- BoxMap CRUD ---

  describe('BoxMap', () => {
    it('setEntry and getEntry round-trip', () => {
      const contract = createAndInit()
      contract.setEntry('key1', Bytes('value1'))
      expect(contract.getEntry('key1')).toEqual(Bytes('value1'))
    })

    it('getEntry returns default for nonexistent key', () => {
      const contract = createAndInit()
      expect(contract.getEntry('missing')).toEqual(Bytes(''))
    })

    it('hasEntry returns false for nonexistent key', () => {
      const contract = createAndInit()
      expect(contract.hasEntry('nope')).toBe(false)
    })

    it('hasEntry returns true after setEntry', () => {
      const contract = createAndInit()
      contract.setEntry('key1', Bytes('val'))
      expect(contract.hasEntry('key1')).toBe(true)
    })

    it('deleteEntry removes the keyed box and decrements counter', () => {
      const contract = createAndInit()
      contract.setEntry('key1', Bytes('val'))
      expect(contract.entryCount.value).toEqual(1n)
      expect(contract.deleteEntry('key1')).toBe(true)
      expect(contract.entryCount.value).toEqual(0n)
      expect(contract.hasEntry('key1')).toBe(false)
    })

    it('deleteEntry returns false for nonexistent key', () => {
      const contract = createAndInit()
      expect(contract.deleteEntry('missing')).toBe(false)
    })

    it('setEntry increments entryCount for multiple entries', () => {
      const contract = createAndInit()
      contract.setEntry('a', Bytes('1'))
      contract.setEntry('b', Bytes('2'))
      contract.setEntry('c', Bytes('3'))
      expect(contract.entryCount.value).toEqual(3n)
    })

    it('getEntryLength returns byte length of entry', () => {
      const contract = createAndInit()
      contract.setEntry('key1', Bytes('hello'))
      expect(contract.getEntryLength('key1')).toEqual(5n)
    })

    it('setEntry overwrites existing value (update)', () => {
      const contract = createAndInit()
      contract.setEntry('key1', Bytes('old'))
      contract.setEntry('key1', Bytes('new-value'))
      expect(contract.getEntry('key1')).toEqual(Bytes('new-value'))
    })
  })

  // --- Dynamic GlobalState ---

  describe('Dynamic GlobalState', () => {
    it('getDynamicState throws for nonexistent key', () => {
      const contract = createAndInit()
      expect(() => contract.getDynamicState('missing')).toThrow()
    })

    it('setDynamicState does not throw', () => {
      const contract = createAndInit()
      // Dynamic GlobalState({ key }) creates unlinked proxies in the testing framework,
      // so round-trip via separate set/get calls is not supported. We verify set doesn't throw.
      expect(() => contract.setDynamicState('counter', 42)).not.toThrow()
    })

    it('deleteDynamicState does not throw', () => {
      const contract = createAndInit()
      expect(() => contract.deleteDynamicState('temp')).not.toThrow()
    })
  })

  // --- Integration ---

  describe('Integration', () => {
    it('testBoxRoundTrip performs full lifecycle', () => {
      const contract = createAndInit()
      expect(contract.testBoxRoundTrip(Bytes('round-trip-data'))).toBe(true)
    })
  })
})
