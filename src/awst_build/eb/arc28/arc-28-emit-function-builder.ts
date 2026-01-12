import type ts from 'typescript'
import { nodeFactory } from '../../../awst/node-factory'
import type { Expression, StringConstant } from '../../../awst/nodes'
import { SourceLocation } from '../../../awst/source-location'
import { CodeError, InternalError } from '../../../errors'
import { logger } from '../../../logger'
import { codeInvariant, instanceOfAny } from '../../../util'
import { Arc4ParseError, parseArc4Type } from '../../../util/arc4-signature-parser'
import type { PType } from '../../ptypes'
import { arc28EmitFunction, ArrayLiteralPType, ImmutableObjectPType, MutableObjectPType, stringPType, voidPType } from '../../ptypes'
import type { ARC4EncodedType } from '../../ptypes/arc4-types'
import { ARC4StructType, ARC4TupleType } from '../../ptypes/arc4-types'
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

  private resolvePropertyValue(builder: InstanceBuilder, expectedType?: ARC4EncodedType): [Expression, PType] {
    if (builder.ptype instanceof ArrayLiteralPType && expectedType) {
      return [this.encode(builder.resolveToPType(builder.ptype.getReadonlyTupleType()), expectedType), expectedType]
    }
    return [builder.resolve(), builder.ptype]
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation<ts.CallExpression>): NodeBuilder {
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
      const signature = requireStringConstant(nameOrObj)
      const { name: _, propTypes } = parseEventName(nameOrObj)

      const values: Expression[] = []
      for (const [index, prop] of props.entries()) {
        const [encodedExpr, _] = this.resolvePropertyValue(prop, propTypes?.[index])
        values.push(encodedExpr)
      }

      if (propTypes && propTypes.length !== values.length) {
        throw new CodeError(`Event signature length (${propTypes.length}) does not match number of provided values (${values.length}).`, {
          sourceLocation: sourceLocation,
        })
      }

      return instanceEb(
        nodeFactory.emitFields({
          signature: signature.value,
          values: Array.from(values.values()),
          wtype: voidPType.wtype,
          sourceLocation,
        }),
        voidPType,
      )
    }
    codeInvariant(props.length === 0, 'Unexpected args', props[0]?.sourceLocation)

    const eventBuilder = nameOrObj.resolveToPType(genericArg)

    const eventType = eventBuilder.ptype

    if (eventType instanceof ARC4StructType) {
      return emitStruct(eventBuilder.resolve(), sourceLocation)
    } else if (instanceOfAny(eventType, ImmutableObjectPType, MutableObjectPType)) {
      if (!eventType.alias) {
        logger.error(
          eventBuilder.sourceLocation,
          'Event cannot be an anonymous type. If a named type exists, try specifying it explicitly via the generic parameter. Eg. `emit<YourType>({...})`',
        )
      }
      return emitStruct(eventBuilder.resolve(), sourceLocation)
    }
    throw new InternalError('Unexpected type for arg 0 of emit', { sourceLocation })
  }
}

function emitStruct(expression: Expression, sourceLocation: SourceLocation) {
  return instanceEb(
    nodeFactory.emit({
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
