import { nodeFactory } from '../../../awst/node-factory'
import type { BytesConstant, Expression } from '../../../awst/nodes'
import { EqualityComparison } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { wtypes } from '../../../awst/wtypes'
import { Constants } from '../../../constants'
import { CodeError } from '../../../errors'
import { logger } from '../../../logger'
import { codeInvariant, hexToUint8Array } from '../../../util'
import { isArc4EncodableType, ptypeToArc4EncodedType } from '../../arc4-util'
import type { PType } from '../../ptypes'
import { BytesPType, bytesPType, stringPType, uint64PType } from '../../ptypes'
import {
  ARC4EncodedType,
  decodeArc4Function,
  encodeArc4Function,
  interpretAsArc4Function,
  methodSelectorFunction,
  sizeOfFunction,
} from '../../ptypes/arc4-types'
import { instanceEb } from '../../type-registry'
import { ContractMethodExpressionBuilder, SubroutineExpressionBuilder } from '../free-subroutine-expression-builder'
import type { InstanceBuilder, NodeBuilder } from '../index'
import { FunctionBuilder } from '../index'
import { requireStringConstant } from '../util'
import { parseFunctionArgs } from '../util/arg-parsing'

export class InterpretAsArc4FunctionBuilder extends FunctionBuilder {
  readonly ptype = interpretAsArc4Function

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      ptypes: [ptype],
      args: [theBytes, prefixType],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 1,
      funcName: this.typeDescription,
      argSpec: (a) => [a.required(bytesPType), a.optional(stringPType)],
      callLocation: sourceLocation,
    })
    codeInvariant(ptype instanceof ARC4EncodedType, 'Generic type must be an ARC4 encoded type')

    const prefixBytes = getPrefixValue(prefixType)

    return instanceEb(
      nodeFactory.reinterpretCast({
        expr: validatePrefix(theBytes, prefixBytes, sourceLocation),
        wtype: ptype.wtype,
        sourceLocation,
      }),
      ptype,
    )
  }
}
export class EncodeArc4FunctionBuilder extends FunctionBuilder {
  readonly ptype = encodeArc4Function

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [valueToEncode],
      ptypes: [valueType],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 1,
      funcName: this.typeDescription,
      argSpec: (a) => [a.required()],
      callLocation: sourceLocation,
    })
    if (valueType instanceof ARC4EncodedType) {
      // Already encoded, just reinterpret as bytes
      return instanceEb(
        nodeFactory.reinterpretCast({
          expr: valueToEncode.resolve(),
          wtype: wtypes.bytesWType,
          sourceLocation,
        }),
        bytesPType,
      )
    }

    const encodedType = ptypeToArc4EncodedType(valueType, sourceLocation)

    return instanceEb(
      nodeFactory.reinterpretCast({
        expr: nodeFactory.aRC4Encode({
          value: valueToEncode.resolveToPType(valueType).resolve(),
          wtype: encodedType.wtype,
          sourceLocation,
        }),
        sourceLocation,
        wtype: bytesPType.wtype,
      }),
      bytesPType,
    )
  }
}
export class DecodeArc4FunctionBuilder extends FunctionBuilder {
  readonly ptype = decodeArc4Function

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      ptypes: [ptype],
      args: [theBytes, prefixType],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 1,
      funcName: this.typeDescription,
      argSpec: (a) => [a.required(bytesPType), a.optional(stringPType)],
      callLocation: sourceLocation,
    })
    codeInvariant(
      !(ptype instanceof ARC4EncodedType),
      `Cannot decode to ${ptype} as it is an ARC4 type. Use \`interpretAsArc4<${ptype}>\` instead`,
      sourceLocation,
    )

    codeInvariant(isArc4EncodableType(ptype), `Cannot determine ARC4 encoding for ${ptype}`, sourceLocation)

    const arc4Encoded = ptypeToArc4EncodedType(ptype, sourceLocation)

    const prefixBytes = getPrefixValue(prefixType)

    return instanceEb(
      nodeFactory.aRC4Decode({
        value: nodeFactory.reinterpretCast({
          expr: validatePrefix(theBytes, prefixBytes, sourceLocation),
          sourceLocation,
          wtype: arc4Encoded.wtype,
        }),
        wtype: ptype.wtypeOrThrow,
        sourceLocation,
      }),
      ptype,
    )
  }
}
export function validatePrefix(
  base: InstanceBuilder,
  expectedPrefix: BytesConstant | undefined,
  sourceLocation: SourceLocation,
): Expression {
  if (expectedPrefix === undefined) return base.resolve()

  const baseSingle = base.singleEvaluation().resolve()

  const baseNoPrefix = nodeFactory.intrinsicCall({
    opCode: 'extract',
    immediates: [4n, 0n],
    wtype: bytesPType.wtype,
    stackArgs: [baseSingle],
    sourceLocation,
  })
  const observedPrefix = nodeFactory.intrinsicCall({
    opCode: 'extract',
    immediates: [0n, 4n],
    wtype: bytesPType.wtype,
    stackArgs: [baseSingle],
    sourceLocation,
  })
  const prefixIsValid = nodeFactory.bytesComparisonExpression({
    operator: EqualityComparison.eq,
    lhs: observedPrefix,
    rhs: expectedPrefix,
    sourceLocation,
  })

  return nodeFactory.checkedMaybe({
    expr: nodeFactory.tupleExpression({ items: [baseNoPrefix, prefixIsValid], sourceLocation }),
    comment: 'Bytes has valid prefix',
  })
}

function getPrefixValue(arg: InstanceBuilder | undefined): BytesConstant | undefined {
  if (arg === undefined) return undefined
  const value = requireStringConstant(arg).value
  switch (value) {
    case 'log':
      return nodeFactory.bytesConstant({ value: hexToUint8Array(Constants.algo.arc4.logPrefixHex), sourceLocation: arg.sourceLocation })
    case 'none':
      return undefined
    default:
      logger.error(arg.sourceLocation, `Expected literal string: 'none' | 'log'`)
  }
}

export class MethodSelectorFunctionBuilder extends FunctionBuilder {
  readonly ptype = methodSelectorFunction

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [methodSignature],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: this.typeDescription,
      argSpec: (a) => [a.passthrough()],
    })
    const methodConstantType = new BytesPType({ length: 4n })
    if (methodSignature instanceof SubroutineExpressionBuilder) {
      codeInvariant(
        methodSignature instanceof ContractMethodExpressionBuilder,
        `Expected contract instance method, found ${methodSignature.typeDescription}`,
      )
      return instanceEb(methodSignature.getMethodSelector(sourceLocation), methodConstantType)
    } else {
      if (methodSignature === undefined) {
        throw new CodeError(
          `${this.typeDescription} expects exactly 1 argument that is either a string literal, or a contract function reference`,
          { sourceLocation },
        )
      }
      return instanceEb(
        nodeFactory.methodConstant({
          value: requireStringConstant(methodSignature).value,
          wtype: methodConstantType.wtype,
          sourceLocation,
        }),
        methodConstantType,
      )
    }
  }
}

export class SizeOfFunctionBuilder extends FunctionBuilder {
  readonly ptype = sizeOfFunction

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      ptypes: [typeToEncode],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 1,
      funcName: this.typeDescription,
      argSpec: (a) => [],
      callLocation: sourceLocation,
    })

    const arc4Type = ptypeToArc4EncodedType(typeToEncode, sourceLocation)

    return instanceEb(nodeFactory.sizeOf({ sizeWtype: arc4Type.wtype, wtype: wtypes.uint64WType, sourceLocation }), uint64PType)
  }
}
