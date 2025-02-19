import { CodeError } from '../../../errors'
import { codeInvariant } from '../../../util'
import { numberPType } from '../../ptypes'
import type { NodeBuilder } from '../index'
import { ArrayLiteralExpressionBuilder } from '../literal/array-literal-expression-builder'
import { StaticIterator } from '../traits/static-iterator'
import { requireLiteralNumber } from './index'

export function processScratchRanges(builder: NodeBuilder): Set<bigint> {
  codeInvariant(
    builder instanceof ArrayLiteralExpressionBuilder,
    'Scratch ranges should be specified in an array literal',
    builder.sourceLocation,
  )
  const slots = new Set<bigint>()
  for (const item of builder[StaticIterator]()) {
    if (item.resolvableToPType(numberPType)) {
      slots.add(requireLiteralNumber(item))
    } else {
      const from = getRangeProp(item, 'from')
      const to = getRangeProp(item, 'to')
      for (let i = from; i <= to; i++) {
        slots.add(i)
      }
    }
  }

  return slots
}

function getRangeProp(builder: NodeBuilder, name: string): bigint {
  if (builder.hasProperty(name)) {
    return requireLiteralNumber(builder.memberAccess(name, builder.sourceLocation))
  }
  throw new CodeError('Scratch slot reservations should be either a single slot or an object containing a from and to property', {
    sourceLocation: builder.sourceLocation,
  })
}
