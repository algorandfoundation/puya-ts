import { nodeFactory } from '../../../awst/node-factory'
import type { BytesConstant, Expression } from '../../../awst/nodes'
import { EqualityComparison } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { logger } from '../../../logger'
import { codeInvariant, hexToUint8Array } from '../../../util'
import { isArc4EncodableType, ptypeToArc4EncodedType } from '../../arc4-util'
import type { PType } from '../../ptypes'
import { bytesPType, stringPType } from '../../ptypes'
import { ARC4EncodedType, decodeArc4Function, encodeArc4Function, interpretAsArc4Function } from '../../ptypes/arc4-types'
import { instanceEb } from '../../type-registry'
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
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 1,
      funcName: this.typeDescription,
      argSpec: (a) => [a.required()],
      callLocation: sourceLocation,
    })
    const encodedType = ptypeToArc4EncodedType(valueToEncode.ptype, sourceLocation)

    return instanceEb(
      nodeFactory.reinterpretCast({
        expr: nodeFactory.aRC4Encode({
          value: valueToEncode.resolve(),
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
function validatePrefix(base: InstanceBuilder, expectedPrefix: BytesConstant | undefined, sourceLocation: SourceLocation): Expression {
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
      return nodeFactory.bytesConstant({ value: hexToUint8Array('151F7C75'), sourceLocation: arg.sourceLocation })
    case 'none':
      return undefined
    default:
      logger.error(arg.sourceLocation, `Expected literal string: 'none' | 'log'`)
  }
}
