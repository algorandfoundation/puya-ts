import { internal } from '@algorandfoundation/algo-ts'
import { DeliberateAny } from './typescript-helpers'
import { nameOfType } from './util'
export { attachAbiMetadata } from './abi-metadata'

export function switchableValue(x: unknown): bigint | string | boolean {
  if (typeof x === 'boolean') return x
  if (typeof x === 'bigint') return x
  if (typeof x === 'string') return x
  if (internal.primitives.AlgoTsPrimitiveCls.isClassOf(x)) return x.valueOf()
  internal.errors.internalError(`Cannot convert ${nameOfType(x)} to switchable value`)
}
// export function wrapLiteral(x: unknown) {
//   if (typeof x === 'boolean') return x
//   if (isBytes(x)) return makeBytes(x)
//   if (isUint64(x)) return makeUint64(x)
//   internalError(`Cannot wrap ${nameOfType(x)}`)
// }

type BinaryOps = '+' | '-' | '*' | '**' | '/' | '>' | '>=' | '<' | '<=' | '===' | '!==' | '<<' | '>>'

function tryGetBigInt(value: unknown): bigint | undefined {
  if (typeof value == 'bigint') return value
  if (typeof value == 'number') return BigInt(value)
  if (internal.primitives.Uint64Cls.isClassOf(value)) return (value as internal.primitives.Uint64Cls).valueOf()
  if (internal.primitives.BigUintCls.isClassOf(value)) return (value as internal.primitives.BigUintCls).valueOf()
  return undefined
}

export function binaryOp(left: unknown, right: unknown, op: BinaryOps) {
  const lbi = tryGetBigInt(left)
  const rbi = tryGetBigInt(right)
  if (lbi !== undefined && rbi !== undefined) {
    const result = defaultBinaryOp(lbi, rbi, op)
    // if result is not a number (e.g. a boolean), return as it is
    if (!tryGetBigInt(result)) return result
    if (internal.primitives.BigUintCls.isClassOf(left) || internal.primitives.BigUintCls.isClassOf(right)) {
      return new internal.primitives.BigUintCls(result)
    } else if (internal.primitives.Uint64Cls.isClassOf(left) || internal.primitives.Uint64Cls.isClassOf(right)) {
      return new internal.primitives.Uint64Cls(result)
    }
    return result
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
      internal.errors.internalError(`Unsupported operator ${op}`)
  }
}
