import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { InternalError } from '../../../errors'
import { logger } from '../../../logger'
import { codeInvariant } from '../../../util'
import { ptypeToArc4EncodedType } from '../../arc4-util'
import type { PType } from '../../ptypes'
import { arc28EmitFunction, ObjectPType, stringPType, voidPType } from '../../ptypes'
import { ARC4EncodedType, ARC4StructType } from '../../ptypes/arc4-types'
import { instanceEb } from '../../type-registry'
import type { NodeBuilder } from '../index'
import { FunctionBuilder } from '../index'
import { requireStringConstant } from '../util'
import { parseFunctionArgs } from '../util/arg-parsing'

export class Arc28EmitFunctionBuilder extends FunctionBuilder {
  readonly ptype = arc28EmitFunction

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
      const name = requireStringConstant(nameOrObj).value
      const thisModule = nameOrObj.sourceLocation.file ?? ''

      const fields: Record<string, ARC4EncodedType> = {}
      const values = new Map<string, Expression>()

      for (const [index, prop] of Object.entries(props)) {
        const arc4Type = ptypeToArc4EncodedType(prop.ptype, prop.sourceLocation)
        fields[index] = arc4Type
        values.set(
          index,
          prop.ptype instanceof ARC4EncodedType
            ? prop.resolve()
            : nodeFactory.aRC4Encode({
                value: prop.resolve(),
                wtype: arc4Type.wtype,
                sourceLocation: prop.sourceLocation,
              }),
        )
      }

      const structType = new ARC4StructType({
        name,
        module: thisModule,
        fields,
        description: undefined,
        sourceLocation,
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
    } else if (eventType instanceof ObjectPType) {
      if (eventType.isAnonymous) {
        logger.error(
          eventBuilder.sourceLocation,
          'Event cannot be an anonymous type. If a named type exists, try specifying it explicitly via the generic parameter. Eg. `emit<YourType>({...})`',
        )
      }
      const arc4Equivalent = ptypeToArc4EncodedType(eventType, sourceLocation)
      return emitStruct(
        arc4Equivalent,
        nodeFactory.aRC4Encode({
          wtype: arc4Equivalent.wtype,
          sourceLocation: nameOrObj.sourceLocation,
          value: nameOrObj.resolve(),
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
      signature: ptype.signature,
      value: expression,
      wtype: voidPType.wtype,
      sourceLocation,
    }),
    voidPType,
  )
}
