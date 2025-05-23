import type { ConstantValue } from '../../../awst'
import { isConstant } from '../../../awst'
import type { SourceLocation } from '../../../awst/source-location'
import { codeInvariant } from '../../../util'
import type { NodeBuilder } from '../index'
import { BigIntLiteralExpressionBuilder } from '../literal/big-int-literal-expression-builder'
import { requireInstanceBuilder } from './index'

export function requireConstantValue(builder: NodeBuilder, sourceLocation: SourceLocation): ConstantValue {
  if (builder instanceof BigIntLiteralExpressionBuilder) {
    return builder.value
  }
  const value = requireInstanceBuilder(builder).resolve()
  codeInvariant(isConstant(value), 'Expected compile time constant')
  return value.value
}
