import { nodeFactory } from '../../../awst/node-factory'
import type { BytesConstant, Expression } from '../../../awst/nodes'
import { ARC4ABIMethodConfig, EqualityComparison } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { wtypes } from '../../../awst/wtypes'
import { CodeError } from '../../../errors'
import { logger } from '../../../logger'
import { codeInvariant, hexToUint8Array } from '../../../util'
import { isArc4EncodableType, ptypeToArc4EncodedType, ptypeToArc4PType } from '../../arc4-util'
import { AwstBuildContext } from '../../context/awst-build-context'
import type { PType } from '../../ptypes'
import { bytesPType, stringPType } from '../../ptypes'
import {
  ARC4EncodedType,
  decodeArc4Function,
  encodeArc4Function,
  interpretAsArc4Function,
  methodSelectorFunction,
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

function getArc4TypeName(arg: PType, sourceLocation: SourceLocation): string {
  const arc4Type = ptypeToArc4PType(arg, sourceLocation)
  return arc4Type.wtype instanceof wtypes.ARC4Type ? arc4Type.wtype.arc4Name : (arc4Type.wtype?.name ?? arc4Type.name)
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

    let signature: string

    if (methodSignature instanceof SubroutineExpressionBuilder) {
      codeInvariant(
        methodSignature instanceof ContractMethodExpressionBuilder,
        `Expected contract instance method, found ${methodSignature.typeDescription}`,
      )

      const methodTarget = methodSignature.target
      const arc4Config = AwstBuildContext.current.getArc4Config(methodSignature.contractType, methodTarget.memberName)
      codeInvariant(
        arc4Config instanceof ARC4ABIMethodConfig,
        `${methodTarget.memberName} is not an ABI method`,
        methodSignature.sourceLocation,
      )
      const params = methodSignature.ptype.parameters.map(([_, ptype]) => getArc4TypeName(ptype, sourceLocation)).join(',')
      const returnType = getArc4TypeName(methodSignature.ptype.returnType, sourceLocation)
      signature = `${arc4Config.name}(${params})${returnType}`
    } else {
      if (methodSignature === undefined) {
        throw new CodeError(
          `${this.typeDescription} expects exactly 1 argument that is either a string literal, or a contract function reference`,
          { sourceLocation },
        )
      }
      signature = requireStringConstant(methodSignature).value
    }

    return instanceEb(
      nodeFactory.methodConstant({
        value: signature,
        wtype: wtypes.bytesWType,
        sourceLocation,
      }),
      bytesPType,
    )
  }
}
