import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { TemplateVar } from '@algorandfoundation/algorand-typescript'

function test() {
  // @expect-error Invalid name. Template variable names must only contain capital letters A-Z, numbers 0-9, and underscores
  const invalidName = TemplateVar<uint64>('hmm')
}
