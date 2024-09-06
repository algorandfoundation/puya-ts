import type { InstanceBuilder } from '../index'
import { NodeBuilder } from '../index'
import { InstanceExpressionBuilder } from '../index'
import type { PType } from '../../ptypes'
import { NumberPType } from '../../ptypes'
import { biguintPType } from '../../ptypes'
import { uint64PType } from '../../ptypes'
import { UintNType } from '../../ptypes'
import type { SourceLocation } from '../../../awst/source-location'
import type { Expression } from '../../../awst/nodes'
import { IntegerConstant } from '../../../awst/nodes'
import { bigIntToUint8Array, codeInvariant, invariant } from '../../../util'
import { parseFunctionArgs } from '../util/arg-parsing'
import { isValidLiteralForPType } from '../util'
import { nodeFactory } from '../../../awst/node-factory'
import { instanceEb } from '../../type-registry'
import { intrinsicFactory } from '../../../awst/intrinsic-factory'

export class UintNConstructorBuilder extends NodeBuilder {
  get ptype(): undefined {
    return undefined
  }
  newCall(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const {
      ptypes: [size],
      args: [initialValueBuilder],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 1,
      funcName: 'UintN constructor',
      argMap: [['*', undefined]],
      callLocation: sourceLocation,
    })
    codeInvariant(
      size instanceof NumberPType && size.literalValue !== undefined,
      `Generic type of ${this.typeDescription} must be a literal number. Inferred type is ${size.name}`,
    )
    const ptype = new UintNType({ n: size.literalValue })

    if (initialValueBuilder === undefined) {
      return new UintNExpressionBuilder(
        nodeFactory.bytesConstant({
          value: new Uint8Array([0]),
          wtype: ptype.wtypeOrThrow,
          sourceLocation: sourceLocation,
        }),
        ptype,
      )
    }
    if (initialValueBuilder.resolvableToPType(uint64PType, sourceLocation)) {
      const initialValue = initialValueBuilder.resolveToPType(uint64PType, sourceLocation).resolve()
      if (initialValue instanceof IntegerConstant) {
        codeInvariant(isValidLiteralForPType(initialValue.value, ptype), `${initialValue.value} cannot be converted to ${ptype}`)
        return new UintNExpressionBuilder(
          nodeFactory.bytesConstant({
            value: bigIntToUint8Array(initialValue.value),
            wtype: ptype.wtypeOrThrow,
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

    if (initialValueBuilder.resolvableToPType(biguintPType, sourceLocation)) {
      const initialValue = initialValueBuilder.resolveToPType(biguintPType, sourceLocation).resolve()
      if (initialValue instanceof IntegerConstant) {
        codeInvariant(isValidLiteralForPType(initialValue.value, ptype), `${initialValue.value} cannot be converted to ${ptype}`)
        return new UintNExpressionBuilder(
          nodeFactory.bytesConstant({
            value: bigIntToUint8Array(initialValue.value),
            wtype: ptype.wtypeOrThrow,
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

    return super.newCall(args, typeArgs, sourceLocation)
  }
}
export class UintNExpressionBuilder extends InstanceExpressionBuilder<UintNType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof UintNType, 'ptype must be instance of UIntNType')
    super(expr, ptype)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'native':
        if (this.ptype.n <= 64) {
          return instanceEb(intrinsicFactory.btoi({ value: this._expr, sourceLocation }), uint64PType)
        } else {
          return instanceEb(nodeFactory.reinterpretCast({ expr: this._expr, sourceLocation, wtype: biguintPType.wtype }), biguintPType)
        }
    }

    return super.memberAccess(name, sourceLocation)
  }
}
