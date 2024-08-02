import type { Constant, Expression } from './nodes'
import { BoolConstant, BytesConstant, IntegerConstant, StringConstant } from './nodes'

export function isConstant(expr: Expression): expr is Constant {
  return expr instanceof StringConstant || expr instanceof BytesConstant || expr instanceof IntegerConstant || expr instanceof BoolConstant
}
