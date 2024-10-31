import { nodeFactory } from '../../../awst/node-factory'
import type { Expression, StringConstant } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { CodeError } from '../../../errors'
import { codeInvariant, invariant } from '../../../util'
import type { PType } from '../../ptypes'
import { numberPType, NumericLiteralPType, stringPType } from '../../ptypes'
import { UFixedNxMClass, UFixedNxMType } from '../../ptypes/arc4-types'
import { ClassBuilder, type InstanceBuilder, type NodeBuilder } from '../index'
import { isValidLiteralForPType, requireStringConstant } from '../util'
import { parseFunctionArgs } from '../util/arg-parsing'
import { Arc4EncodedBaseExpressionBuilder } from './base'

export class UFixedNxMClassBuilder extends ClassBuilder {
  readonly ptype = UFixedNxMClass

  newCall(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const {
      ptypes: [size, decimals],
      args: [initialValueBuilder],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 2,
      funcName: this.typeDescription,
      argSpec: (a) => [a.optional(stringPType), a.optional(numberPType), a.optional(numberPType)],
      callLocation: sourceLocation,
    })
    codeInvariant(
      size instanceof NumericLiteralPType,
      `Generic type N of ${this.typeDescription} must be a literal number. Inferred type is ${size.name}`,
      sourceLocation,
    )
    codeInvariant(
      decimals instanceof NumericLiteralPType,
      `Generic type M of ${this.typeDescription} must be a literal number. Inferred type is ${decimals.name}`,
      sourceLocation,
    )
    const ptype = new UFixedNxMType({ n: size.literalValue, m: decimals.literalValue })

    return newUFixedNxM(initialValueBuilder, ptype, sourceLocation)
  }
}

function newUFixedNxM(initialValue: InstanceBuilder | undefined, ptype: UFixedNxMType, sourceLocation: SourceLocation) {
  let expr: Expression
  if (initialValue === undefined) {
    expr = nodeFactory.decimalConstant({
      wtype: ptype.wtype,
      value: '0',
      sourceLocation,
    })
  } else if (initialValue.ptype.equals(stringPType)) {
    const strConstant = requireStringConstant(initialValue)
    expr = fromDecimalString(strConstant, ptype)
  } else {
    throw new CodeError(`Unsupported expression of type ${initialValue.ptype}`, { sourceLocation: initialValue.sourceLocation })
  }

  return new UFixedNxMExpressionBuilder(expr, ptype)
}

function fromDecimalString(strConst: StringConstant, ptype: UFixedNxMType) {
  const [integer, decimal, ...rest] = strConst.value.split('.') as [string, string | undefined, ...string[]]
  codeInvariant(rest.length === 0, 'Decimals should have at most 1 decimal point', strConst.sourceLocation)
  codeInvariant(decimal === undefined || decimal.length <= ptype.m, 'Number of decimal places cannot exceed M', strConst.sourceLocation)

  const d = decimal === undefined ? 0n : BigInt(decimal.padEnd(Number(ptype.m), '0'))
  const i = BigInt(integer)
  const val = i * 10n ** ptype.m + d
  codeInvariant(isValidLiteralForPType(val, ptype), `${strConst} is not a valid literal for ${ptype.name}`, strConst.sourceLocation)
  return nodeFactory.decimalConstant({
    wtype: ptype.wtype,
    value: strConst.value,
    sourceLocation: strConst.sourceLocation,
  })
}

export class UFixedNxMExpressionBuilder extends Arc4EncodedBaseExpressionBuilder<UFixedNxMType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof UFixedNxMType, 'ptype must be UFixedNxMType')
    super(expr, ptype)
  }
}
