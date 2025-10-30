import type { Constant, Expression } from './nodes'
import {
  AddressConstant,
  BoolConstant,
  BytesConstant,
  DecimalConstant,
  IntegerConstant,
  MethodConstant,
  StringConstant,
  TemplateVar,
} from './nodes'

export function isConstant(expr: Expression): expr is Constant {
  return (
    expr instanceof StringConstant ||
    expr instanceof BytesConstant ||
    expr instanceof IntegerConstant ||
    expr instanceof BoolConstant ||
    expr instanceof AddressConstant ||
    expr instanceof MethodConstant ||
    expr instanceof DecimalConstant
  )
}

export function isConstantOrTemplateVar(expr: Expression): expr is Constant | TemplateVar {
  return isConstant(expr) || expr instanceof TemplateVar
}

export class SymbolToNumber {
  #symbols = new Map<symbol, number>()

  forSymbol(sym: symbol): { id: number; isNew: boolean } {
    let val = this.#symbols.get(sym)
    if (val !== undefined) {
      return { id: val, isNew: false }
    }
    val = this.#symbols.size
    this.#symbols.set(sym, val)
    return { id: val, isNew: true }
  }
}
