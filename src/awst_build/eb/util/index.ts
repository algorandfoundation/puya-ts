import type { NodeBuilder } from '../index'
import { InstanceBuilder } from '../index'
import type { awst, ConstantValue } from '../../../awst'
import { isConstant } from '../../../awst'
import { CodeError } from '../../../errors'
import type { PType } from '../../ptypes'
import { biguintPType, boolPType, bytesPType, stringPType, uint64PType } from '../../ptypes'
import type { SourceLocation } from '../../../awst/source-location'
import { codeInvariant } from '../../../util'
import type { Expression } from '../../../awst/nodes'
import { StringConstant } from '../../../awst/nodes'
import type { Tuple } from '../../../typescript-helpers'
import { logger } from '../../../logger'
import { LiteralExpressionBuilder } from '../literal-expression-builder'

export function requireExpressionOfType(builder: NodeBuilder, ptype: PType, sourceLocation: SourceLocation): awst.Expression {
  if (builder instanceof InstanceBuilder) {
    if (builder.resolvableToPType(ptype, sourceLocation)) {
      return builder.resolveToPType(ptype, sourceLocation).resolve()
    }
  }
  throw new CodeError(`Expected expression of type ${ptype}, got ${builder.typeDescription}`, {
    sourceLocation,
  })
}

export function resolvableToType(builder: NodeBuilder, ptype: PType, sourceLocation: SourceLocation) {
  if (builder instanceof LiteralExpressionBuilder) {
    return builder.resolvableToPType(ptype, sourceLocation)
  }
  return builder instanceof InstanceBuilder && builder.ptype.equals(ptype)
}

export function requestExpressionOfType(builder: NodeBuilder, ptype: PType, sourceLocation: SourceLocation): awst.Expression | undefined {
  if (builder instanceof LiteralExpressionBuilder) {
    if (builder.resolvableToPType(ptype, sourceLocation)) {
      return builder.resolveToPType(ptype, sourceLocation).resolve()
    }
    return undefined
  }
  if (builder instanceof InstanceBuilder && builder.ptype?.equals(ptype)) {
    return builder.resolve()
  }
  return undefined
}

export function requireInstanceBuilder(builder: NodeBuilder, sourceLocation: SourceLocation): InstanceBuilder {
  if (builder instanceof InstanceBuilder) return builder
  throw new CodeError(`Expected instance of a type, got ${builder.typeDescription}`, { sourceLocation })
}

export function requireExpressionsOfType<const TPTypes extends [...PType[]]>(
  builders: ReadonlyArray<InstanceBuilder>,
  ptypes: TPTypes,
  sourceLocation: SourceLocation,
): Array<awst.Expression> {
  if (builders.length === ptypes.length) {
    return builders.map((builder, i) => requireExpressionOfType(builder, ptypes[i], sourceLocation))
  }
  throw new CodeError(`Expected ${ptypes.length} args with types ${ptypes.join(', ')}`, { sourceLocation })
}

export function requireStringConstant(builder: InstanceBuilder, sourceLocation: SourceLocation): awst.StringConstant {
  const constant = requireConstantOfType(builder, stringPType, sourceLocation)
  codeInvariant(constant instanceof StringConstant, 'Expected string constant')
  return constant
}

export function requestConstantOfType(builder: NodeBuilder, ptype: PType, sourceLocation: SourceLocation): awst.Constant | undefined {
  if (builder instanceof LiteralExpressionBuilder) {
    if (builder.resolvableToPType(ptype, sourceLocation)) {
      const expr = builder.resolveToPType(ptype, sourceLocation).resolve()
      if (isConstant(expr)) return expr
    }
    return undefined
  }
  if (builder instanceof InstanceBuilder && builder.ptype?.equals(ptype)) {
    const expr = builder.resolve()
    if (isConstant(expr)) return expr
  }
  return undefined
}

export function requireConstantOfType(
  builder: NodeBuilder,
  ptype: PType,
  sourceLocation: SourceLocation,
  messageOverride?: string,
): awst.Constant {
  const constExpr = requestConstantOfType(builder, ptype, sourceLocation)
  if (constExpr) return constExpr
  throw new CodeError(messageOverride ?? `Expected constant of type ${ptype}`, { sourceLocation })
}

export function isValidLiteralForPType(literalValue: ConstantValue, ptype: PType): boolean {
  if (ptype.equals(stringPType)) {
    return typeof literalValue === 'string'
  }
  if (ptype.equals(uint64PType)) {
    return typeof literalValue === 'bigint' && 0 <= literalValue && literalValue < 2n ** 64n
  }
  if (ptype.equals(biguintPType)) {
    return typeof literalValue === 'bigint' && 0 <= literalValue && literalValue < 2n ** 512n
  }
  if (ptype.equals(boolPType)) {
    return typeof literalValue === 'boolean'
  }
  if (ptype.equals(bytesPType)) {
    return literalValue instanceof Uint8Array
  }
  return false
}

export function parseTypeArgs<T extends number>(
  typeArgs: ReadonlyArray<PType>,
  sourceLocation: SourceLocation,
  funcName: string,
  expectedCount: T,
): Tuple<PType, T> {
  if (typeArgs.length !== expectedCount) {
    const err = new CodeError(`${funcName} expects exactly ${expectedCount} type argument${expectedCount === 1 ? '' : 's'}`, {
      sourceLocation,
    })
    if (typeArgs.length > expectedCount) {
      logger.error(err)
      return typeArgs.slice(0, expectedCount) as Tuple<PType, T>
    }
    throw err
  }
  return typeArgs as Tuple<PType, T>
}

type OptionalArg = [PType, undefined]
type RequiredArg = [PType]
type ArgSpec = OptionalArg | RequiredArg

type ArgsForMap<T extends Record<string, ArgSpec>> = {
  [key in keyof T]: T[key] extends OptionalArg ? Expression | undefined : Expression
}

export function parseObjArgs<T extends Record<string, ArgSpec>>(
  args: ReadonlyArray<InstanceBuilder>,
  sourceLocation: SourceLocation,
  funcName: string,
  argMap: T,
): ArgsForMap<T> {
  if (args.length !== 1) {
    throw new CodeError(`${funcName} expects exactly one argument`)
  }
  const arg = args[0]

  return Object.entries(argMap).reduce(
    (acc, [property, spec]) => {
      const [ptype, ...rest] = spec
      if (arg.hasProperty(property)) {
        acc[property] = requireExpressionOfType(arg.memberAccess(property, sourceLocation), ptype, sourceLocation)
        return acc
      }
      if (rest.length === 0) {
        throw new CodeError(`Arg 0 for ${funcName} is missing required property ${property}`, { sourceLocation })
      }
      return acc
    },
    {} as Record<string, Expression>,
  ) as ArgsForMap<T>
}
