import type { Constant, Expression } from './nodes'
import { BoolConstant, BytesConstant, IntegerConstant, StringConstant } from './nodes'

export function isConstant(expr: Expression): expr is Constant {
  return expr instanceof StringConstant || expr instanceof BytesConstant || expr instanceof IntegerConstant || expr instanceof BoolConstant
}

export class SymbolToNumber {
  #symbols = new Map<symbol, number>()

  forSymbol(sym: symbol): [number, boolean] {
    let val = this.#symbols.get(sym)
    if (val !== undefined) {
      return [val, false]
    }
    val = this.#symbols.size
    this.#symbols.set(sym, val)
    return [val, true]
  }
}
