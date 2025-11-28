import { expect } from 'vitest'

export function testInvariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    expect.fail(message)
  }
}
