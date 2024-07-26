import { arc4AbiMethodDecorator, arc4BareMethodDecorator, PType } from '../ptypes'
import { InstanceBuilder, NodeBuilder } from './index'
import { SourceLocation } from '../../awst/source-location'
import { ARC4CreateOption, OnCompletionAction } from '../../awst/models'
import { Arc4AbiDecoratorData, DecoratorData } from '../decorator-visitor'
import { codeInvariant } from '../../util'
import { ObjectLiteralExpressionBuilder } from './object-literal-expression-builder'
import { StringExpressionBuilder } from './string-expression-builder'
import { requireConstantValue, requireStringConstant } from './util'
import { ArrayLiteralExpressionBuilder } from './array-literal-expression-builder'
import { CodeError } from '../../errors'
import { logger } from '../../logger'
import { Constants } from '../../constants'

const ocaMap: Record<string, OnCompletionAction> = {
  NoOp: OnCompletionAction.NoOp,
  OptIn: OnCompletionAction.OptIn,
  CloseOut: OnCompletionAction.CloseOut,
  ClearState: OnCompletionAction.ClearState,
  UpdateApplication: OnCompletionAction.UpdateApplication,
  DeleteApplication: OnCompletionAction.DeleteApplication,
}

const createMap: Record<string, ARC4CreateOption> = {
  allow: ARC4CreateOption.Allow,
  require: ARC4CreateOption.Require,
  disallow: ARC4CreateOption.Disallow,
}

export class Arc4BareMethodDecoratorBuilder extends NodeBuilder {
  get ptype(): PType {
    return arc4BareMethodDecorator
  }

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    codeInvariant(typeArgs.length === 0, `${this.ptype} has not type arguments`, sourceLocation)
    if (args.length === 0) {
      return new DecoratorDataBuilder(sourceLocation, {
        type: 'arc4.baremethod',
        ocas: [OnCompletionAction.NoOp],
        create: ARC4CreateOption.Disallow,
        sourceLocation: sourceLocation,
      })
    }
    codeInvariant(args.length === 1, `${this.ptype} expects at most 1 argument`, sourceLocation)
    const [config] = args
    codeInvariant(config instanceof ObjectLiteralExpressionBuilder, `${this.ptype} expects an object literal as its 1st argument`)

    const ocas = resolveOnCompletionActions(config, sourceLocation)
    const createOption = config.hasProperty('create')
      ? mapStringValue(createMap, config.memberAccess('create', sourceLocation), sourceLocation)
      : ARC4CreateOption.Disallow
    return new DecoratorDataBuilder(sourceLocation, {
      type: Constants.arc4BareDecoratorName,
      ocas,
      create: createOption,
      sourceLocation: sourceLocation,
    })
  }
}

export class Arc4AbiMethodDecoratorBuilder extends NodeBuilder {
  get ptype(): PType {
    return arc4AbiMethodDecorator
  }

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    codeInvariant(typeArgs.length === 0, `${this.ptype} has not type arguments`, sourceLocation)
    if (args.length === 0) {
      return new DecoratorDataBuilder(sourceLocation, {
        type: 'arc4.abimethod',
        ocas: [OnCompletionAction.NoOp],
        create: ARC4CreateOption.Disallow,
        sourceLocation: sourceLocation,
        nameOverride: undefined,
        readonly: false,
        defaultArguments: {},
      })
    }
    codeInvariant(args.length === 1, `${this.ptype} expects at most 1 argument`, sourceLocation)
    const [config] = args
    codeInvariant(config instanceof ObjectLiteralExpressionBuilder, `${this.ptype} expects an object literal as its 1st argument`)

    const ocas = resolveOnCompletionActions(config, sourceLocation)
    if (ocas.length !== new Set(ocas).size) {
      logger.error(sourceLocation, 'Duplicate on completion actions')
    }
    const createOption = config.hasProperty('create')
      ? mapStringValue(createMap, config.memberAccess('create', sourceLocation), sourceLocation)
      : ARC4CreateOption.Disallow
    const nameOverride = config.hasProperty('name')
      ? requireStringConstant(config.memberAccess('name', sourceLocation), sourceLocation).value
      : undefined

    return new DecoratorDataBuilder(sourceLocation, {
      type: Constants.arc4AbiDecoratorName,
      ocas,
      create: createOption,
      sourceLocation: sourceLocation,
      nameOverride,
      readonly: false,
      defaultArguments: resolveDefaultArguments(config, sourceLocation),
    })
  }
}

function mapStringValue<T>(map: Record<string, T>, value: InstanceBuilder, sourceLocation: SourceLocation) {
  const strValue = requireStringConstant(value, sourceLocation).value
  if (Object.hasOwn(map, strValue)) return map[strValue]
  throw new CodeError(`${strValue} is not valid at this location`, { sourceLocation })
}

function resolveOnCompletionActions(config: ObjectLiteralExpressionBuilder, sourceLocation: SourceLocation): OnCompletionAction[] {
  if (!config.hasProperty('allowActions')) return [OnCompletionAction.NoOp]
  const value = config.memberAccess('allowActions', sourceLocation)
  if (value instanceof StringExpressionBuilder) {
    return [mapStringValue(ocaMap, value, sourceLocation)]
  } else if (value instanceof ArrayLiteralExpressionBuilder) {
    return value.resolveItems().map((i) => mapStringValue(ocaMap, i, sourceLocation))
  } else {
    throw new CodeError('Unexpected value for onComplete', { sourceLocation })
  }
}

function resolveDefaultArguments(
  config: ObjectLiteralExpressionBuilder,
  sourceLocation: SourceLocation,
): Arc4AbiDecoratorData['defaultArguments'] {
  const result: Arc4AbiDecoratorData['defaultArguments'] = {}
  if (!config.hasProperty('defaultArguments')) return result
  const defaultArgumentsConfig = config.memberAccess('defaultArguments', sourceLocation)
  codeInvariant(
    defaultArgumentsConfig instanceof ObjectLiteralExpressionBuilder,
    `Default argument specification should be an object literal`,
  )
  for (const [parameterName] of defaultArgumentsConfig.ptype.orderedProperties()) {
    const paramConfig = defaultArgumentsConfig.memberAccess(parameterName, sourceLocation)
    codeInvariant(paramConfig instanceof ObjectLiteralExpressionBuilder, 'Default argument specification should be an object literal')

    if (paramConfig.hasProperty('constant')) {
      result[parameterName] = {
        type: 'constant',
        value: requireConstantValue(paramConfig.memberAccess('constant', sourceLocation), sourceLocation),
      }
    } else if (paramConfig.hasProperty('from')) {
      result[parameterName] = {
        type: 'member',
        name: requireStringConstant(paramConfig.memberAccess('from', sourceLocation), sourceLocation).value,
      }
    } else {
      logger.error(sourceLocation, 'Default argument specifications should specify fromConstant or fromMember')
    }
  }

  return result
}

export class DecoratorDataBuilder extends NodeBuilder {
  get ptype(): PType | undefined {
    return undefined
  }
  constructor(
    sourceLocation: SourceLocation,
    private readonly data: DecoratorData,
  ) {
    super(sourceLocation)
  }

  resolveDecoratorData(): DecoratorData {
    return this.data
  }
}
