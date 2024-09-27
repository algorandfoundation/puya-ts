import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Uint64 } from '@algorandfoundation/algorand-typescript'

function test_for_loop(start: uint64, stop: uint64, step: uint64) {
  let total = Uint64(0)
  for (let i = start; i < stop; i += step) {
    total += i
  }
  return total
}

function test_for_loop_break(start: uint64, stop: uint64, step: uint64) {
  let total = Uint64(0)
  for (let i = start; i < stop; i += step) {
    total += i
    if (total > 10) {
      break
    }
  }
  return total
}

function test_for_loop_continue(start: uint64, stop: uint64, step: uint64) {
  let total = Uint64(0)
  for (let i = start; i < stop; i += step) {
    if (i % 5 === 0) continue
    total += i
  }
  return total
}

function test_for_loop_labelled(start: uint64, stop: uint64, step: uint64) {
  let total = Uint64(0)
  outer: for (let i = start; i < stop; i += step) {
    for (let j = start; j < stop; j += step) {
      total += j + j
      break outer
    }
  }
  return total
}
