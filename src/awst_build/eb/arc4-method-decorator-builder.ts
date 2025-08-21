import { OnCompletionAction } from '../../awst/models'
import type { Expression } from '../../awst/nodes'
import { ARC4CreateOption, NewArray, StringConstant, TupleExpression } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { Constants } from '../../constants'
import { CodeError } from '../../errors'
import { logger } from '../../logger'
import { codeInvariant } from '../../util'
import type { Arc4AbiDecoratorData } from '../models/decorator-data'
import type { PType } from '../ptypes'
import { arc4AbiMethodDecorator, arc4BareMethodDecorator, boolPType, ReadonlyArrayPType, readonlyDecorator, stringPType } from '../ptypes'
import type { InstanceBuilder } from './index'
import { DecoratorDataBuilder, NodeBuilder } from './index'
import { ObjectLiteralExpressionBuilder } from './literal/object-literal-expression-builder'
import { mapStringConstant, requireBooleanConstant, requireInstanceBuilder, requireStringConstant } from './util'
import { parseFunctionArgs } from './util/arg-parsing'

const ocaMap: Record<string, OnCompletionAction> = {
  NoOp: OnCompletionAction.NoOp,
  OptIn: OnCompletionAction.OptIn,
  CloseOut: OnCompletionAction.CloseOut,
  ClearState: OnCompletionAction.ClearState,
  UpdateApplication: OnCompletionAction.UpdateApplication,
  DeleteApplication: OnCompletionAction.DeleteApplication,
}

const createMap: Record<string, ARC4CreateOption> = {
  allow: ARC4CreateOption.allow,
  require: ARC4CreateOption.require,
  disallow: ARC4CreateOption.disallow,
}

const resourceEncodingMap: Record<string, 'index' | 'value'> = {
  index: 'index',
  value: 'value',
}

export class Arc4BareMethodDecoratorBuilder extends NodeBuilder {
  readonly ptype = arc4BareMethodDecorator

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [{ allowActions, onCreate }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 1,
      callLocation: sourceLocation,
      funcName: this.typeDescription,
      argSpec: (a) => [
        a.obj({
          allowActions: a.optional(stringPType, new ReadonlyArrayPType({ elementType: stringPType })),
          onCreate: a.optional(stringPType),
        }),
      ],
    })
    return new DecoratorDataBuilder(sourceLocation, {
      type: Constants.symbolNames.arc4BareDecoratorName,
      allowedCompletionTypes: allowActions && resolveOnCompletionActions(allowActions),
      allowedCompletionTypesLocation: allowActions?.sourceLocation,
      create: onCreate && mapStringConstant(createMap, onCreate.resolve()),
      createLocation: onCreate?.sourceLocation,
      sourceLocation: sourceLocation,
    })
  }
}

export class ReadonlyDecoratorBuilder extends DecoratorDataBuilder {
  readonly ptype = readonlyDecorator

  constructor(sourceLocation: SourceLocation) {
    super(sourceLocation, {
      type: Constants.symbolNames.readonlyDecoratorName,
      readonly: true,
      sourceLocation,
    })
  }
}

export class Arc4AbiMethodDecoratorBuilder extends NodeBuilder {
  readonly ptype = arc4AbiMethodDecorator

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [{ allowActions, onCreate, readonly, name, resourceEncoding, defaultArguments }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 1,
      callLocation: sourceLocation,
      funcName: 'arc4.abimethod',
      argSpec: (a) => [
        a.obj({
          allowActions: a.optional(stringPType, new ReadonlyArrayPType({ elementType: stringPType })),
          onCreate: a.optional(stringPType),
          readonly: a.optional(boolPType),
          name: a.optional(stringPType),
          resourceEncoding: a.optional(stringPType),
          defaultArguments: a.optional(),
        }),
      ],
    })

    return new DecoratorDataBuilder(sourceLocation, {
      type: Constants.symbolNames.arc4AbiDecoratorName,
      allowedCompletionTypes: allowActions && resolveOnCompletionActions(allowActions),
      allowedCompletionTypesLocation: allowActions?.sourceLocation,
      create: onCreate && mapStringConstant(createMap, onCreate.resolve()),
      createLocation: onCreate?.sourceLocation,
      sourceLocation: sourceLocation,
      nameOverride: name ? requireStringConstant(name).value : undefined,
      resourceEncoding: resourceEncoding && mapStringConstant(resourceEncodingMap, resourceEncoding.resolve()),
      readonly: readonly ? requireBooleanConstant(readonly).value : undefined,
      defaultArguments: resolveDefaultArguments(defaultArguments, sourceLocation),
    })
  }
}

function resolveOnCompletionActions(oca: InstanceBuilder): OnCompletionAction[] {
  const value = oca.resolve()
  let ocaRawExpr: Expression[]
  if (value instanceof StringConstant) {
    ocaRawExpr = [value]
  } else if (value instanceof TupleExpression) {
    ocaRawExpr = value.items
  } else if (value instanceof NewArray) {
    ocaRawExpr = value.values
  } else {
    throw new CodeError('Unexpected value for onComplete', { sourceLocation: oca.sourceLocation })
  }

  const ocas = ocaRawExpr.map((item) => mapStringConstant(ocaMap, item))
  const distinctOcas = Array.from(new Set(ocas))
  if (distinctOcas.length !== ocas.length) {
    logger.warn(oca.sourceLocation, 'Duplicate on completion actions')
  }
  codeInvariant(distinctOcas.length, 'Method must allow at least one on complete action', oca.sourceLocation)
  return ocas
}

function resolveDefaultArguments(
  defaultArguments: NodeBuilder | undefined,
  sourceLocation: SourceLocation,
): Arc4AbiDecoratorData['defaultArguments'] {
  const result: Arc4AbiDecoratorData['defaultArguments'] = {}
  if (!defaultArguments) return result
  codeInvariant(defaultArguments instanceof ObjectLiteralExpressionBuilder, `Default argument specification should be an object literal`)
  for (const [parameterName] of defaultArguments.ptype.orderedProperties()) {
    const paramConfig = defaultArguments.memberAccess(parameterName, sourceLocation)
    codeInvariant(paramConfig instanceof ObjectLiteralExpressionBuilder, 'Default argument specification should be an object literal')

    if (paramConfig.hasProperty('constant')) {
      result[parameterName] = {
        type: 'constant',
        value: requireInstanceBuilder(paramConfig.memberAccess('constant', sourceLocation)),
      }
    } else if (paramConfig.hasProperty('from')) {
      result[parameterName] = {
        type: 'member',
        name: requireStringConstant(paramConfig.memberAccess('from', sourceLocation)).value,
      }
    } else {
      logger.error(sourceLocation, 'Default argument specifications should specify fromConstant or fromMember')
    }
  }

  return result
}
