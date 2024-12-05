import type { SourceLocation } from '../../../awst/source-location'
import { CodeError } from '../../../errors'

export function stringToBigint({ value, sourceLocation }: { value: string; sourceLocation: SourceLocation }): bigint {
  try {
    return BigInt(value)
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new CodeError(`Cannot convert ${value} to an integer`, { sourceLocation })
    }
    throw e
  }
}
