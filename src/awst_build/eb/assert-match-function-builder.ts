import { intrinsicFactory } from '../../awst/intrinsic-factory'
import type { SourceLocation } from '../../awst/source-location'
import { codeInvariant } from '../../util'
import type { PType } from '../ptypes'
import { assertMatchFunction, stringPType } from '../ptypes'
import { NodeBuilder } from './index'
import { buildComparisons } from './match-function-builder'
import { requireStringConstant } from './util'
import { parseFunctionArgs } from './util/arg-parsing'
import { VoidExpressionBuilder } from './void-expression-builder'

export class AssertMatchFunctionBuilder extends NodeBuilder {
  readonly ptype = assertMatchFunction

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [subject, tests, comment],
    } = parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      genericTypeArgs: 1,
      funcName: 'assertMatch',
      argSpec: (a) => [a.passthrough(), a.required(), a.optional(stringPType)],
    })
    codeInvariant(subject, 'subject parameter is missing', sourceLocation)

    const condition = buildComparisons(subject, tests, this.typeDescription, sourceLocation).resolve()

    codeInvariant(condition, 'assertMatch must have at least 1 condition', sourceLocation)
    const commentStr = comment ? requireStringConstant(comment).value : 'assert target is match for conditions'
    return new VoidExpressionBuilder(
      intrinsicFactory.assert({
        condition,
        comment: commentStr,
        sourceLocation,
      }),
    )
  }
}
