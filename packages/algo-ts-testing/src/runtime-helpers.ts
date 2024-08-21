import { internal } from '@algorandfoundation/algo-ts'
import { MAX_UINT64 } from './constants'
import { DeliberateAny } from './typescript-helpers'
import { nameOfType } from './util'
export { attachAbiMetadata } from './abi-metadata'

export function switchableValue(x: unknown): bigint | string | boolean {
  if (typeof x === 'boolean') return x
  if (typeof x === 'bigint') return x
  if (typeof x === 'string') return x
  if (x instanceof internal.primitives.AlgoTsPrimitiveCls) return x.valueOf()
  internal.errors.internalError(`Cannot convert ${nameOfType(x)} to switchable value`)
}
// export function wrapLiteral(x: unknown) {
//   if (typeof x === 'boolean') return x
//   if (isBytes(x)) return makeBytes(x)
//   if (isUint64(x)) return makeUint64(x)
//   internalError(`Cannot wrap ${nameOfType(x)}`)
// }

type BinaryOps = '+' | '-' | '*' | '**' | '/' | '%' | '>' | '>=' | '<' | '<=' | '===' | '!==' | '<<' | '>>' | '&' | '|' | '^'
type UnaryOps = '~'

function tryGetBigInt(value: unknown): bigint | undefined {
  if (typeof value == 'bigint') return value
  if (typeof value == 'number') return BigInt(value)
  if (value instanceof internal.primitives.Uint64Cls) return value.valueOf()
  if (value instanceof internal.primitives.BigUintCls) return internal.primitives.checkBigUint(value.valueOf())
  return undefined
}

export function binaryOp(left: unknown, right: unknown, op: BinaryOps) {
  if (left instanceof internal.primitives.BigUintCls || right instanceof internal.primitives.BigUintCls) {
    return bigUintBinaryOp(left, right, op)
  }
  if (left instanceof internal.primitives.Uint64Cls || right instanceof internal.primitives.Uint64Cls) {
    return uint64BinaryOp(left, right, op)
  }
  const lbi = tryGetBigInt(left)
  const rbi = tryGetBigInt(right)
  if (lbi !== undefined && rbi !== undefined) {
    const result = defaultBinaryOp(lbi, rbi, op)

    if (typeof result === 'boolean') {
      return result
    }

    if (typeof left === 'number' && typeof right === 'number' && result <= Number.MAX_SAFE_INTEGER) {
      return Number(result)
    }

    return result
  }
  return defaultBinaryOp(left, right, op)
}

function uint64BinaryOp(left: DeliberateAny, right: DeliberateAny, op: BinaryOps): DeliberateAny {
  const lbi = internal.primitives.checkUint64(internal.primitives.Uint64Cls.fromCompat(left).value)
  const rbi = internal.primitives.checkUint64(internal.primitives.Uint64Cls.fromCompat(right).value)
  const result = (function () {
    switch (op) {
      case '+':
        return lbi + rbi
      case '-':
        return lbi - rbi
      case '*':
        return lbi * rbi
      case '**':
        if (lbi === 0n && rbi === 0n) {
          throw new internal.errors.CodeError('0 ** 0 is undefined')
        }
        return lbi ** rbi
      case '/':
        if (rbi === 0n) {
          throw new internal.errors.CodeError('Division by zero')
        }
        return lbi / rbi
      case '%':
        if (rbi === 0n) {
          throw new internal.errors.CodeError('Modulo by zero')
        }
        return lbi % rbi
      case '>>':
        if (rbi > 63n) {
          throw new internal.errors.CodeError('expected shift <= 63')
        }
        return (lbi >> rbi) & MAX_UINT64
      case '<<':
        if (rbi > 63n) {
          throw new internal.errors.CodeError('expected shift <= 63')
        }
        return (lbi << rbi) & MAX_UINT64
      case '>':
        return lbi > rbi
      case '<':
        return lbi < rbi
      case '>=':
        return lbi >= rbi
      case '<=':
        return lbi <= rbi
      case '===':
        return lbi === rbi
      case '!==':
        return lbi !== rbi
      case '&':
        return lbi & rbi
      case '|':
        return lbi | rbi
      case '^':
        return lbi ^ rbi
      default:
        internal.errors.internalError(`Unsupported operator ${op}`)
    }
  })()
  return typeof result === 'boolean' ? result : new internal.primitives.Uint64Cls(result)
}

function bigUintBinaryOp(left: DeliberateAny, right: DeliberateAny, op: BinaryOps): DeliberateAny {
  const lbi = internal.primitives.checkBigUint(internal.primitives.BigUintCls.fromCompat(left).value)
  const rbi = internal.primitives.checkBigUint(internal.primitives.BigUintCls.fromCompat(right).value)
  const result = (function () {
    switch (op) {
      case '+':
        return lbi + rbi
      case '-':
        return lbi - rbi
      case '*':
        return lbi * rbi
      case '**':
        if (lbi === 0n && rbi === 0n) {
          throw new internal.errors.CodeError('0 ** 0 is undefined')
        }
        return lbi ** rbi
      case '/':
        if (rbi === 0n) {
          throw new internal.errors.CodeError('Division by zero')
        }
        return lbi / rbi
      case '%':
        if (rbi === 0n) {
          throw new internal.errors.CodeError('Modulo by zero')
        }
        return lbi % rbi
      case '>>':
        throw new internal.errors.CodeError('BigUint does not support >> operator')
      case '<<':
        throw new internal.errors.CodeError('BigUint does not support << operator')
      case '>':
        return lbi > rbi
      case '<':
        return lbi < rbi
      case '>=':
        return lbi >= rbi
      case '<=':
        return lbi <= rbi
      case '===':
        return lbi === rbi
      case '!==':
        return lbi !== rbi
      case '&':
        return lbi & rbi
      case '|':
        return lbi | rbi
      case '^':
        return lbi ^ rbi
      default:
        internal.errors.internalError(`Unsupported operator ${op}`)
    }
  })()
  return typeof result === 'boolean' ? result : new internal.primitives.BigUintCls(internal.primitives.checkBigUint(result))
}

export function unaryOp(operand: unknown, op: UnaryOps) {
  const bi = tryGetBigInt(operand)
  if (bi !== undefined) {
    const result = defaultUnaryOp(bi, op)

    // if result is not a number (e.g. a boolean), return as it is
    if (!tryGetBigInt(result)) return result
    if (operand instanceof internal.primitives.BigUintCls) {
      return new internal.primitives.BigUintCls(result)
    } else if (operand instanceof internal.primitives.Uint64Cls) {
      return new internal.primitives.Uint64Cls(result)
    } else if (typeof operand === 'number' && result <= Number.MAX_SAFE_INTEGER) {
      return Number(result)
    }
    return result
  }
  return defaultUnaryOp(operand, op)
}

function defaultBinaryOp(left: DeliberateAny, right: DeliberateAny, op: BinaryOps): DeliberateAny {
  switch (op) {
    case '+':
      return left + right
    case '-':
      return left - right
    case '*':
      return left * right
    case '**':
      if (left === 0n && right === 0n) {
        throw new internal.errors.CodeError('0 ** 0 is undefined')
      }
      return left ** right
    case '/':
      return left / right
    case '%':
      return left % right
    case '>>':
      if (typeof left === 'bigint' && typeof right === 'bigint') {
        if (right > 63n) {
          throw new internal.errors.CodeError('expected shift <= 63')
        }
        return (left >> right) & MAX_UINT64
      }
      return left >> right
    case '<<':
      if (typeof left === 'bigint' && typeof right === 'bigint') {
        if (right > 63n) {
          throw new internal.errors.CodeError('expected shift <= 63')
        }
        return (left << right) & MAX_UINT64
      }
      return left << right
    case '>':
      return left > right
    case '<':
      return left < right
    case '>=':
      return left >= right
    case '<=':
      return left <= right
    case '===':
      return left === right
    case '!==':
      return left !== right
    case '&':
      return left & right
    case '|':
      return left | right
    case '^':
      return left ^ right
    default:
      internal.errors.internalError(`Unsupported operator ${op}`)
  }
}

function defaultUnaryOp(operand: DeliberateAny, op: UnaryOps): DeliberateAny {
  switch (op) {
    case '~':
      if (typeof operand === 'bigint') {
        return ~operand & MAX_UINT64
      }
      return ~operand
    default:
      internal.errors.internalError(`Unsupported operator ${op}`)
  }
}

const genericTypeMap = new Map<DeliberateAny, string>()
export function captureGenericTypeInfo(target: DeliberateAny, t: string) {
  genericTypeMap.set(target, t)
  return target
}

export function getGenericTypeInfo(target: DeliberateAny): string | undefined {
  return genericTypeMap.get(target)
}
