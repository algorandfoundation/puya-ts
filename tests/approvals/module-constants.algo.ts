import type { biguint, uint64 } from '@algorandfoundation/algorand-typescript'
import { BigUint, Contract, Uint64 } from '@algorandfoundation/algorand-typescript'

const b_a = true
const b_b = false

const b_and = b_a && b_b
const b_or = b_a || b_b

const u_a = Uint64(10)
const u_b = Uint64(2)

const u_add: uint64 = u_a + u_b
const u_sub: uint64 = u_a - u_b
const u_mul: uint64 = u_a * u_b
const u_div: uint64 = u_a / u_b
const u_mod: uint64 = u_a % u_b
const u_pow: uint64 = u_a ** u_b
const u_lshift: uint64 = u_a << u_b
const u_rshift: uint64 = u_a >> u_b
const u_bitOr: uint64 = u_a | u_b
const u_bitXor: uint64 = u_a ^ u_b
const u_bitAnd: uint64 = u_a & u_b

const bu_a = BigUint(10)
const bu_b = BigUint(2)

const bu_add: biguint = bu_a + bu_b
const bu_sub: biguint = bu_a - bu_b
const bu_mul: biguint = bu_a * bu_b
const bu_div: biguint = bu_a / bu_b
const bu_mod: biguint = bu_a % bu_b
const bu_bitOr: biguint = bu_a | bu_b
const bu_bitXor: biguint = bu_a ^ bu_b
const bu_bitAnd: biguint = bu_a & bu_b

const s_a = 'a'
const s_b = 'b'

const s_add = s_a + s_b

class ModuleConstantsAlgo extends Contract {
  getBoolConstants() {
    return [b_and, b_or] as const
  }
  getUintConstants() {
    return [u_add, u_sub, u_mul, u_div, u_mod, u_pow, u_lshift, u_rshift, u_bitOr, u_bitXor, u_bitAnd] as const
  }
  getBigUintConstants() {
    return [bu_add, bu_sub, bu_mul, bu_div, bu_mod, bu_bitOr, bu_bitXor, bu_bitAnd] as const
  }
  getStringConstants() {
    return [s_add]
  }
}
