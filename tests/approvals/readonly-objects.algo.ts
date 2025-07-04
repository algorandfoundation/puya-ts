import type { uint64 } from '@algorandfoundation/algorand-typescript'

type Mutable = {
  a: uint64
}

type Immutable = Readonly<Mutable>

type MaybeImmutable = {
  readonly a: uint64
  readonly b: uint64
}

function receiveMaybe(mm: MaybeImmutable) {}

function receiveImmutable(i: Immutable) {}

function receiveMutable(m: Mutable) {
  m.a = 123
}

function test(m: Mutable, i: Immutable) {
  receiveImmutable(i)
  receiveImmutable(m)

  receiveMutable(m)
  //receiveMutable(i)
}
