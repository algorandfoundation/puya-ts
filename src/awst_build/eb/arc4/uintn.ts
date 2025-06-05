import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import { IntegerConstant } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { CodeError } from '../../../errors'
import { codeInvariant, invariant } from '../../../util'
import type { LibClassType, PType } from '../../ptypes'
import { biguintPType, NumericLiteralPType, uint64PType } from '../../ptypes'
import { UintNGeneric, UintNType } from '../../ptypes/arc4-types'
import type { InstanceBuilder, NodeBuilder } from '../index'
import { ClassBuilder } from '../index'
import { parseFunctionArgs } from '../util/arg-parsing'
import { isValidLiteralForPType } from '../util/is-valid-literal-for-ptype'
import { Arc4EncodedBaseExpressionBuilder } from './base'

export class UintNClassBuilder extends ClassBuilder {
  readonly ptype = UintNGeneric

  newCall(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const {
      ptypes: [size],
      args: [initialValueBuilder],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 1,
      funcName: this.typeDescription,
      argSpec: (a) => [a.optional()],
      callLocation: sourceLocation,
    })
    codeInvariant(
      size instanceof NumericLiteralPType,
      `Generic type of ${this.typeDescription} must be a literal number. Inferred type is ${size.name}`,
      sourceLocation,
    )
    const ptype = this.ptype.parameterise([size])

    return newUintN(initialValueBuilder, ptype, sourceLocation)
  }
}
export const classBuilderForUintNAlias = (aliasClass: LibClassType, aliasInstance: UintNType) => {
  return class extends ClassBuilder {
    readonly ptype = aliasClass

    newCall(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
      const {
        args: [initialValueBuilder],
      } = parseFunctionArgs({
        args,
        typeArgs,
        genericTypeArgs: 1,
        funcName: `${this.typeDescription} constructor`,
        argSpec: (a) => [a.optional()],
        callLocation: sourceLocation,
      })

      return newUintN(initialValueBuilder, aliasInstance, sourceLocation)
    }
  }
}

function newUintN(initialValueBuilder: InstanceBuilder | undefined, ptype: UintNType, sourceLocation: SourceLocation) {
  if (initialValueBuilder === undefined) {
    return new UintNExpressionBuilder(
      nodeFactory.integerConstant({
        value: 0n,
        tealAlias: null,
        wtype: ptype.wtype,
        sourceLocation: sourceLocation,
      }),
      ptype,
    )
  }
  if (initialValueBuilder.resolvableToPType(uint64PType)) {
    const initialValue = initialValueBuilder.resolveToPType(uint64PType).resolve()
    if (initialValue instanceof IntegerConstant) {
      codeInvariant(isValidLiteralForPType(initialValue.value, ptype), `${initialValue.value} cannot be converted to ${ptype}`)
      return new UintNExpressionBuilder(
        nodeFactory.integerConstant({
          value: initialValue.value,
          wtype: ptype.wtype,
          tealAlias: null,
          sourceLocation: sourceLocation,
        }),
        ptype,
      )
    } else {
      return new UintNExpressionBuilder(
        nodeFactory.aRC4Encode({
          wtype: ptype.wtype,
          sourceLocation,
          value: initialValue,
        }),
        ptype,
      )
    }
  }

  if (initialValueBuilder.resolvableToPType(biguintPType)) {
    const initialValue = initialValueBuilder.resolveToPType(biguintPType).resolve()
    if (initialValue instanceof IntegerConstant) {
      codeInvariant(isValidLiteralForPType(initialValue.value, ptype), `${initialValue.value} cannot be converted to ${ptype}`)
      return new UintNExpressionBuilder(
        nodeFactory.integerConstant({
          value: initialValue.value,
          wtype: ptype.wtypeOrThrow,
          sourceLocation: sourceLocation,
          tealAlias: null,
        }),
        ptype,
      )
    } else {
      return new UintNExpressionBuilder(
        nodeFactory.aRC4Encode({
          wtype: ptype.wtype,
          sourceLocation,
          value: initialValue,
        }),
        ptype,
      )
    }
  }
  throw CodeError.unexpectedUnhandledArgs({ sourceLocation })
}

export class UintNExpressionBuilder extends Arc4EncodedBaseExpressionBuilder<UintNType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof UintNType, 'ptype must be instance of UIntNType')
    super(expr, ptype)
  }
}
