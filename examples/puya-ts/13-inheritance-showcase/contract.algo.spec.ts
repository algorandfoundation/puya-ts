import { TestExecutionContext } from '@algorandfoundation/algorand-typescript-testing'
import { afterEach, describe, expect, it } from 'vitest'
import { InheritanceShowcase, MultiInheritanceShowcase } from './contract.algo'

const ctx = new TestExecutionContext()
afterEach(() => ctx.reset())

describe('InheritanceShowcase', () => {
  it('createApplication sets owner from base and label from derived', () => {
    const contract = ctx.contract.create(InheritanceShowcase)
    contract.createApplication()
    expect(contract.owner.value).toEqual('creator')
    expect(contract.label.value).toEqual('initialized')
  })

  it('getOwner returns inherited base class value', () => {
    const contract = ctx.contract.create(InheritanceShowcase)
    contract.createApplication()
    expect(contract.getOwner()).toEqual('creator')
  })

  it('getVersion returns base version + 100 (override adds offset)', () => {
    const contract = ctx.contract.create(InheritanceShowcase)
    contract.createApplication()
    // Versioned initialValue=1, InheritanceShowcase adds 100
    expect(contract.getVersion()).toEqual(101n)
  })

  it('getLabel returns level-3 state', () => {
    const contract = ctx.contract.create(InheritanceShowcase)
    contract.createApplication()
    expect(contract.getLabel()).toEqual('initialized')
  })

  it('bumpVersion increments inherited version state', () => {
    const contract = ctx.contract.create(InheritanceShowcase)
    contract.createApplication()
    // bumpVersion is inherited from Versioned (level 2)
    expect(contract.bumpVersion()).toEqual(2n)
    expect(contract.version.value).toEqual(2n)
  })

  it('bumpAndGetVersion bumps then returns overridden getVersion', () => {
    const contract = ctx.contract.create(InheritanceShowcase)
    contract.createApplication()
    // version starts at 1, bump to 2, getVersion returns 2 + 100 = 102
    expect(contract.bumpAndGetVersion()).toEqual(102n)
  })

  it('multiple bumps accumulate correctly', () => {
    const contract = ctx.contract.create(InheritanceShowcase)
    contract.createApplication()
    contract.bumpVersion() // 1 -> 2
    contract.bumpVersion() // 2 -> 3
    expect(contract.getVersion()).toEqual(103n) // 3 + 100
  })
})

describe('MultiInheritanceShowcase', () => {
  it('createApplication initializes both bases', () => {
    const contract = ctx.contract.create(MultiInheritanceShowcase)
    contract.createApplication()
    expect(contract.paused.value).toEqual(false)
    expect(contract.description.value).toEqual('multi-inherited')
  })

  it('pause and unpause work (inherited from Pausable)', () => {
    const contract = ctx.contract.create(MultiInheritanceShowcase)
    contract.createApplication()
    contract.pause()
    expect(contract.isPaused()).toEqual(true)
    contract.unpause()
    expect(contract.isPaused()).toEqual(false)
  })

  it('setDescription and getDescription work (inherited from Describable)', () => {
    const contract = ctx.contract.create(MultiInheritanceShowcase)
    contract.createApplication()
    contract.setDescription('updated')
    expect(contract.getDescription()).toEqual('updated')
  })

  it('getStatus returns description when not paused', () => {
    const contract = ctx.contract.create(MultiInheritanceShowcase)
    contract.createApplication()
    expect(contract.getStatus()).toEqual('multi-inherited')
  })

  it('getStatus returns paused when paused', () => {
    const contract = ctx.contract.create(MultiInheritanceShowcase)
    contract.createApplication()
    contract.pause()
    expect(contract.getStatus()).toEqual('paused')
  })
})
