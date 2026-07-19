import type ts from 'typescript'
import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { InternalError } from '../../../errors'
import { logger } from '../../../logger'
import { codeInvariant, instanceOfAny } from '../../../util'
import type { PType } from '../../ptypes'
import { arc28EmitFunction, ArrayLiteralPType, ImmutableObjectPType, MutableObjectPType, stringPType, voidPType } from '../../ptypes'
import { ARC4StructType } from '../../ptypes/arc4-types'
import { instanceEb } from '../../type-registry'
import type { InstanceBuilder, NodeBuilder } from '../index'
import { FunctionBuilder } from '../index'
import { requireStringConstant } from '../util'
import { parseFunctionArgs } from '../util/arg-parsing'

export class Arc28EmitFunctionBuilder extends FunctionBuilder {
  readonly ptype = arc28EmitFunction

  private resolvePropertyValue(builder: InstanceBuilder): Expression {
    if (builder.ptype instanceof ArrayLiteralPType) {
      const tupleType = builder.ptype.getReadonlyTupleType()
      return builder.resolveToPType(tupleType).resolve()
    }
    return builder.resolve()
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

      const values = props.map((p) => this.resolvePropertyValue(p))
      return instanceEb(
        nodeFactory.emitFields({
          signature: signature.value,
          values: values,
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
