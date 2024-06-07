import { BigUintCls, isBigUint, isBytes, isUint64, makeBigInt, makeBytes, makeHex, makeUint64, Uint64Cls } from './primitives'
import { codeError, internalError } from './errors'
import { nameOfType } from './util'
import { DeliberateAny } from './typescript-helpers'

export function switchableValue(x: unknown): bigint | string | boolean {
  if (typeof x === 'boolean') return x
  if (typeof x === 'bigint') return x
  if (typeof x === 'string') return x
  if (isBytes(x)) return makeHex(x)
  if (isUint64(x)) return makeBigInt(x)
  if (isBigUint(x)) return makeBigInt(x)
  internalError(`Cannot convert ${nameOfType(x)} to switchable value`)
}

export function wrapLiteral(x: unknown) {
  if (typeof x === 'boolean') return x
  if (isBytes(x)) return makeBytes(x)
  if (isUint64(x)) return makeUint64(x)
  internalError(`Cannot wrap ${nameOfType(x)}`)
}

type BinaryOps = '+' | '-' | '*' | '**' | '/' | '>' | '>=' | '<' | '<=' | '===' | '!==' | '<<' | '>>'

function uint64BinaryOp(left: bigint, right: bigint, op: BinaryOps) {
  switch (op) {
    case '+':
      return new Uint64Cls(left + right)
    case '-':
      return new Uint64Cls(left - right)
    case '*':
      return new Uint64Cls(left * right)
    case '**':
      return new Uint64Cls(left ** right)
    case '/':
      return new Uint64Cls(left / right)
    case '>>':
      return new Uint64Cls(left >> right)
    case '<<':
      return new Uint64Cls(left << right)
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
    default:
      codeError(`Unsupported operator ${op}`)
  }
}
function biguintBinaryOp(left: bigint, right: bigint, op: BinaryOps) {
  switch (op) {
    case '+':
      return new BigUintCls(left + right)
    case '-':
      return new BigUintCls(left - right)
    case '*':
      return new BigUintCls(left * right)
    case '**':
      return new BigUintCls(left ** right)
    case '/':
      return new BigUintCls(left / right)
    case '>>':
      return new BigUintCls(left >> right)
    case '<<':
      return new BigUintCls(left << right)
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
    default:
      codeError(`Unsupported operator ${op}`)
  }
}

function tryGetBigInt(value: unknown): bigint | undefined {
  if (typeof value == 'bigint') return value
  if (typeof value == 'number') return BigInt(value)
  if (value instanceof Uint64Cls) return value.valueOf()
  if (value instanceof BigUintCls) return value.valueOf()
  return undefined
}

export function binaryOp(left: unknown, right: unknown, op: BinaryOps) {
  if (left instanceof BigUintCls) {
    const rbi = tryGetBigInt(right)
    if (rbi !== undefined) {
      return biguintBinaryOp(left.valueOf(), rbi, op)
    }
  }
  if (right instanceof BigUintCls) {
    const lbi = tryGetBigInt(right)
    if (lbi !== undefined) {
      return biguintBinaryOp(lbi, right.valueOf(), op)
    }
  }
  if (left instanceof Uint64Cls) {
    const rbi = tryGetBigInt(right)
    if (rbi !== undefined) {
      return uint64BinaryOp(left.valueOf(), rbi, op)
    }
  }
  if (right instanceof Uint64Cls) {
    const lbi = tryGetBigInt(right)
    if (lbi !== undefined) {
      return uint64BinaryOp(lbi, right.valueOf(), op)
    }
  }
  return defaultBinaryOp(left, right, op)
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
      return left ** right
    case '/':
      return left / right
    case '>>':
      return left >> right
    case '<<':
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
    default:
      internalError(`Unsupported operator ${op}`)
  }
}
