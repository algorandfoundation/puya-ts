import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, Global } from '@algorandfoundation/algorand-typescript'

class Arc4BoolAlgo extends Contract {
  test({
    useRounds,
    lastValid,
    cooldown,
    lastCalled,
    exists,
    hasMethodRestrictions,
  }: {
    useRounds: boolean
    lastValid: uint64
    cooldown: uint64
    lastCalled: uint64
    exists: boolean
    hasMethodRestrictions: boolean
  }) {
    const epochRef = useRounds ? Global.round : Global.latestTimestamp

    return {
      exists,
      expired: epochRef > lastValid,
      hasCooldown: cooldown > 0,
      onCooldown: epochRef - lastCalled < cooldown,
      hasMethodRestrictions,
    }
  }
}
