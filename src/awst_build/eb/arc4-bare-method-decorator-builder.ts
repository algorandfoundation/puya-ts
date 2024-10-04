import { ARC4CreateOption, OnCompletionAction } from '../../awst/models'
import type { Expression } from '../../awst/nodes'
import { NewArray, StringConstant, TupleExpression } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { Constants } from '../../constants'
import { CodeError } from '../../errors'
import { logger } from '../../logger'
import { codeInvariant } from '../../util'
import type { Arc4AbiDecoratorData, DecoratorData } from '../decorator-visitor'
import type { PType } from '../ptypes'
import { arc4AbiMethodDecorator, arc4BareMethodDecorator, ArrayPType, boolPType, stringPType } from '../ptypes'
import type { InstanceBuilder } from './index'
import { NodeBuilder } from './index'
import { ObjectLiteralExpressionBuilder } from './literal/object-literal-expression-builder'
import { requireBooleanConstant, requireStringConstant } from './util'
import { parseFunctionArgs } from './util/arg-parsing'
import { requireConstantValue } from './util/require-constant-value'

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
    const {
      args: [{ allowActions, onCreate }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 1,
      callLocation: sourceLocation,
      funcName: 'arc4.baremethod',
      argSpec: (a) => [
        a.obj({
          allowActions: a.optional(stringPType, new ArrayPType({ itemType: stringPType, immutable: true })),
          onCreate: a.optional(stringPType),
        }),
      ],
    })
    return new DecoratorDataBuilder(sourceLocation, {
      type: Constants.arc4BareDecoratorName,
      ocas: resolveOnCompletionActions(allowActions),
      create: onCreate ? mapStringConstant(createMap, onCreate?.resolve()) : ARC4CreateOption.Disallow,
      sourceLocation: sourceLocation,
    })
  }
}

export class Arc4AbiMethodDecoratorBuilder extends NodeBuilder {
  get ptype(): PType {
    return arc4AbiMethodDecorator
  }

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [{ allowActions, onCreate, readonly, name, defaultArguments }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 1,
      callLocation: sourceLocation,
      funcName: 'arc4.abimethod',
      argSpec: (a) => [
        a.obj({
          allowActions: a.optional(stringPType, new ArrayPType({ itemType: stringPType, immutable: true })),
          onCreate: a.optional(stringPType),
          readonly: a.optional(boolPType),
          name: a.optional(stringPType),
          defaultArguments: a.optional(),
        }),
      ],
    })

    return new DecoratorDataBuilder(sourceLocation, {
      type: Constants.arc4AbiDecoratorName,
      ocas: resolveOnCompletionActions(allowActions),
      create: onCreate ? mapStringConstant(createMap, onCreate?.resolve()) : ARC4CreateOption.Disallow,
      sourceLocation: sourceLocation,
      nameOverride: name ? requireStringConstant(name).value : undefined,
      readonly: readonly ? requireBooleanConstant(readonly).value : false,

      defaultArguments: resolveDefaultArguments(defaultArguments, sourceLocation),
    })
  }
}

function mapStringConstant<T>(map: Record<string, T>, expr: Expression) {
  codeInvariant(expr instanceof StringConstant, 'Expected string literal', expr.sourceLocation)
  const strValue = expr.value
  if (Object.hasOwn(map, strValue)) return map[strValue]
  throw new CodeError(`${strValue} is not valid at this location`, { sourceLocation: expr.sourceLocation })
}

function resolveOnCompletionActions(oca: InstanceBuilder | undefined): OnCompletionAction[] {
  if (!oca) return [OnCompletionAction.NoOp]
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
        value: requireConstantValue(paramConfig.memberAccess('constant', sourceLocation), sourceLocation),
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
