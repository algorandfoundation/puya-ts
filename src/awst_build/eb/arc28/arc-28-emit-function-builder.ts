import { nodeFactory } from '../../../awst/node-factory'
import type { Expression, StringConstant } from '../../../awst/nodes'
import { SourceLocation } from '../../../awst/source-location'
import { CodeError, InternalError } from '../../../errors'
import { logger } from '../../../logger'
import { codeInvariant, instanceOfAny, invariant } from '../../../util'
import { Arc4ParseError, parseArc4Type } from '../../../util/arc4-signature-parser'
import { ptypeToArc4EncodedType } from '../../arc4-util'
import type { PType } from '../../ptypes'
import { arc28EmitFunction, ArrayLiteralPType, ImmutableObjectPType, MutableObjectPType, stringPType, voidPType } from '../../ptypes'
import { ARC4EncodedType, ARC4StructType, ARC4TupleType } from '../../ptypes/arc4-types'
import { instanceEb } from '../../type-registry'
import type { InstanceBuilder, NodeBuilder } from '../index'
import { FunctionBuilder } from '../index'
import { requireStringConstant } from '../util'
import { parseFunctionArgs } from '../util/arg-parsing'

export class Arc28EmitFunctionBuilder extends FunctionBuilder {
  readonly ptype = arc28EmitFunction

  private encode(builder: InstanceBuilder, encodedType: ARC4EncodedType) {
    return nodeFactory.aRC4Encode({
      value: builder.resolve(),
      sourceLocation: builder.sourceLocation,
      wtype: encodedType.wtype,
    })
  }

  private resolvePropertyValue(builder: InstanceBuilder, expectedType?: ARC4EncodedType): [Expression, ARC4EncodedType] {
    if (builder.ptype instanceof ARC4EncodedType) {
      if (expectedType) {
        codeInvariant(
          expectedType.wtype.equals(builder.ptype.wtype),
          `Expected type ${expectedType} does not match actual type ${builder.ptype}`,
          builder.sourceLocation,
        )
      }

      return [builder.resolve(), builder.ptype]
    }

    if (builder.ptype instanceof ArrayLiteralPType) {
      if (!expectedType) {
        expectedType = ptypeToArc4EncodedType(builder.ptype.getArrayType(), builder.sourceLocation)
      }
      return [this.encode(builder.resolveToPType(builder.ptype.getReadonlyTupleType()), expectedType), expectedType]
    }
    const inferredEncodedType = ptypeToArc4EncodedType(builder.ptype, builder.sourceLocation)
    if (expectedType) {
      codeInvariant(
        expectedType.wtype.equals(inferredEncodedType.wtype),
        `Expected type ${expectedType} does not match actual type ${inferredEncodedType}`,
        builder.sourceLocation,
      )
    }
    return [this.encode(builder, inferredEncodedType), inferredEncodedType]
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [nameOrObj, ...props],
      ptypes: [genericArg],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 1,
      callLocation: sourceLocation,
      funcName: this.typeDescription,
      argSpec: (a) => [a.required(), ...args.slice(1).map(() => a.required())],
    })

    if (nameOrObj.ptype.equals(stringPType)) {
      const thisModule = nameOrObj.sourceLocation.file ?? ''

      const fields: Record<string, ARC4EncodedType> = {}
      const values = new Map<string, Expression>()

      const { name, propTypes } = parseEventName(nameOrObj)

      for (const [index, prop] of props.entries()) {
        const [encodedExpr, exprType] = this.resolvePropertyValue(prop, propTypes?.[index])

        fields[index] = exprType
        values.set(index.toString(), encodedExpr)
      }
      if (propTypes && propTypes.length !== values.size) {
        throw new CodeError(`Event signature length (${propTypes.length}) does not match number of provided values (${values.size}).`, {
          sourceLocation: sourceLocation,
        })
      }

      const structType = new ARC4StructType({
        name: name.value,
        module: thisModule,
        fields,
        description: undefined,
        sourceLocation,
        frozen: true,
      })
      const structExpression = nodeFactory.newStruct({
        wtype: structType.wtype,
        values,
        sourceLocation,
      })

      return emitStruct(structType, structExpression, sourceLocation)
    }
    codeInvariant(props.length === 0, 'Unexpected args', props[0]?.sourceLocation)

    const eventBuilder = nameOrObj.resolveToPType(genericArg)

    const eventType = eventBuilder.ptype
    if (eventType instanceof ARC4StructType) {
      return emitStruct(eventType, nameOrObj.resolve(), sourceLocation)
    } else if (instanceOfAny(eventType, ImmutableObjectPType, MutableObjectPType)) {
      if (!eventType.alias) {
        logger.error(
          eventBuilder.sourceLocation,
          'Event cannot be an anonymous type. If a named type exists, try specifying it explicitly via the generic parameter. Eg. `emit<YourType>({...})`',
        )
      }
      const arc4Equivalent = ptypeToArc4EncodedType(eventType, sourceLocation)
      invariant(arc4Equivalent instanceof ARC4StructType, 'Equivalent type for object should be arc4 struct')
      return emitStruct(
        arc4Equivalent,
        nodeFactory.aRC4Encode({
          wtype: arc4Equivalent.wtype,
          sourceLocation: eventBuilder.sourceLocation,
          value: eventBuilder.resolve(),
        }),
        sourceLocation,
      )
    }
    throw new InternalError('Unexpected type for arg 0 of emit', { sourceLocation })
  }
}

function emitStruct(ptype: ARC4StructType, expression: Expression, sourceLocation: SourceLocation) {
  return instanceEb(
    nodeFactory.emit({
      signature: ptype.name + ptype.abiTypeSignature,
      value: expression,
      wtype: voidPType.wtype,
      sourceLocation,
    }),
    voidPType,
  )
}

function parseEventName(nameBuilder: InstanceBuilder): {
  name: StringConstant
  propTypes?: ARC4EncodedType[]
} {
  const name = requireStringConstant(nameBuilder)
  const parenthesisIndex = name.value.indexOf('(')
  if (parenthesisIndex === -1) {
    return {
      name,
    }
  }
  const signature = name.value.substring(parenthesisIndex)

  try {
    const signatureType = parseArc4Type(signature)
    codeInvariant(signatureType instanceof ARC4TupleType, 'Event signature must be a tuple type', name.sourceLocation)
    return {
      name: nodeFactory.stringConstant({
        value: name.value.substring(0, parenthesisIndex),
        sourceLocation: name.sourceLocation,
      }),
      propTypes: signatureType.items,
    }
  } catch (e) {
    if (e instanceof Arc4ParseError) {
      // Source location adjustment assumes StringConstant is all on one line
      throw new CodeError(`Invalid signature: ${e.message}`, {
        sourceLocation: new SourceLocation({
          ...name.sourceLocation,
          column: name.sourceLocation.column + parenthesisIndex + e.index,
        }),
      })
    } else {
      throw e
    }
  }
}
