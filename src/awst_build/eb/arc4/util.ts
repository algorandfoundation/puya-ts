import type ts from 'typescript'
import { nodeFactory } from '../../../awst/node-factory'
import type { BytesConstant, Expression } from '../../../awst/nodes'
import { EqualityComparison } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { wtypes } from '../../../awst/wtypes'
import { Constants } from '../../../constants'
import { CodeError } from '../../../errors'
import { logger } from '../../../logger'
import { codeInvariant, hexToUint8Array } from '../../../util'
import { arc4ConfigFromType } from '../../arc4-util'
import type { PType } from '../../ptypes'
import { BytesPType, bytesPType, FunctionPType, stringPType, uint64PType } from '../../ptypes'
import {
  ARC4EncodedType,
  convertBytesFunction,
  decodeArc4Function,
  encodeArc4Function,
  methodSelectorFunction,
  sizeOfFunction,
} from '../../ptypes/arc4-types'
import { instanceEb } from '../../type-registry'
import { ContractMethodExpressionBuilder, SubroutineExpressionBuilder } from '../free-subroutine-expression-builder'
import type { InstanceBuilder, NodeBuilder } from '../index'
import { FunctionBuilder } from '../index'
import { requireStringConstant } from '../util'
import { parseFunctionArgs } from '../util/arg-parsing'

export class ConvertBytesFunctionBuilder extends FunctionBuilder {
  readonly ptype = convertBytesFunction

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation<ts.CallExpression>): NodeBuilder {
    const {
      ptypes: [ptype],
      args: [theBytes, { prefix, strategy }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 1,
      funcName: this.typeDescription,
      argSpec: (a) => [
        a.required(bytesPType),
        a.obj({
          prefix: a.optional(stringPType),
          strategy: a.required(stringPType),
        }),
      ],

      callLocation: sourceLocation,
    })
    codeInvariant(ptype instanceof ARC4EncodedType, 'Generic type must be an ARC4 encoded type')

    const prefixBytes = getPrefixValue(prefix)
    const validate = requireStringConstant(strategy).value === 'validate'

    return instanceEb(
      nodeFactory.aRC4FromBytes({
        value: validatePrefix(theBytes, prefixBytes, sourceLocation),
        validate,
        wtype: ptype.wtype,
        sourceLocation,
      }),
      ptype,
    )
  }
}

export class EncodeArc4FunctionBuilder extends FunctionBuilder {
  readonly ptype = encodeArc4Function

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation<ts.CallExpression>): NodeBuilder {
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

    return instanceEb(
      nodeFactory.aRC4Encode({
        value: valueToEncode.resolveToPType(valueType).resolve(),
        wtype: wtypes.bytesWType,
        sourceLocation,
      }),
      bytesPType,
    )
  }
}
export class DecodeArc4FunctionBuilder extends FunctionBuilder {
  readonly ptype = decodeArc4Function

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation<ts.CallExpression>): NodeBuilder {
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
      `Cannot decode to ${ptype} as it is an ARC4 type. Use \`convertBytes<${ptype}>\` instead`,
      sourceLocation,
    )

    const prefixBytes = getPrefixValue(prefixType)

    return instanceEb(
      nodeFactory.aRC4FromBytes({
        value: validatePrefix(theBytes, prefixBytes, sourceLocation),
        validate: false,
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

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation<ts.CallExpression>): NodeBuilder {
    const methodConstantType = new BytesPType({ length: 4n })

    if (typeArgs.length === 1 && args.length === 0) {
      const [functionType] = typeArgs
      codeInvariant(
        functionType instanceof FunctionPType,
        'Generic type variable TMethod must be a contract method. eg. abiCall<typeof YourContract.prototype.yourMethod>',
        sourceLocation,
      )
      const { methodSelector } = arc4ConfigFromType(functionType, sourceLocation)
      return instanceEb(methodSelector, methodConstantType)
    } else {
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

      if (methodSignature instanceof SubroutineExpressionBuilder) {
        codeInvariant(
          methodSignature instanceof ContractMethodExpressionBuilder,
          `Expected contract instance method, found ${methodSignature.typeDescription}`,
          methodSignature.sourceLocation,
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
            value: nodeFactory.methodSignatureString({ value: requireStringConstant(methodSignature).value, sourceLocation }),
            wtype: methodConstantType.wtype,
            sourceLocation,
          }),
          methodConstantType,
        )
      }
    }
  }
}

export class SizeOfFunctionBuilder extends FunctionBuilder {
  readonly ptype = sizeOfFunction

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation<ts.CallExpression>): NodeBuilder {
    const {
      ptypes: [typeToEncode],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 1,
      funcName: this.typeDescription,
      argSpec: () => [],
      callLocation: sourceLocation,
    })

    return instanceEb(nodeFactory.sizeOf({ sizeWtype: typeToEncode.wtypeOrThrow, wtype: wtypes.uint64WType, sourceLocation }), uint64PType)
  }
}
