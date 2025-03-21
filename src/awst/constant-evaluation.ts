import { BigUIntBinaryOperator, BinaryBooleanOperator, UInt64BinaryOperator } from './nodes'

export const constantEvaluation = {
  booleanBinary(op: BinaryBooleanOperator, left: boolean, right: boolean) {
    switch (op) {
      case BinaryBooleanOperator.and:
        return left && right
      case BinaryBooleanOperator.or:
        return left || right
    }
  },
  uint64Binary(op: UInt64BinaryOperator, left: bigint, right: bigint) {
    switch (op) {
      case UInt64BinaryOperator.add:
        return left + right
      case UInt64BinaryOperator.sub:
        return left - right
      case UInt64BinaryOperator.mult:
        return left * right
      case UInt64BinaryOperator.floorDiv:
        return left / right
      case UInt64BinaryOperator.mod:
        return left % right
      case UInt64BinaryOperator.pow:
        return left ** right
      case UInt64BinaryOperator.lshift:
        return left << right
      case UInt64BinaryOperator.rshift:
        return left >> right
      case UInt64BinaryOperator.bitOr:
        return left | right
      case UInt64BinaryOperator.bitXor:
        return left ^ right
      case UInt64BinaryOperator.bitAnd:
        return left & right
    }
  },
  biguintBinary(op: BigUIntBinaryOperator, left: bigint, right: bigint) {
    switch (op) {
      case BigUIntBinaryOperator.add:
        return left + right
      case BigUIntBinaryOperator.sub:
        return left - right
      case BigUIntBinaryOperator.mult:
        return left * right
      case BigUIntBinaryOperator.floorDiv:
        return left / right
      case BigUIntBinaryOperator.mod:
        return left % right
      case BigUIntBinaryOperator.bitOr:
        return left | right
      case BigUIntBinaryOperator.bitXor:
        return left ^ right
      case BigUIntBinaryOperator.bitAnd:
        return left & right
    }
  },
}
