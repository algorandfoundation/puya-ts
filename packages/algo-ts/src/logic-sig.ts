import { uint64 } from './primitives'

export abstract class LogicSig {
  abstract program(): boolean | uint64
}
