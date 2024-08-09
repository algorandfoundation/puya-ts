import type { PType } from '../../ptypes'
import type { SourceLocation } from '../../../awst/source-location'
import type { DeliberateAny, Tuple } from '../../../typescript-helpers'
import { CodeError } from '../../../errors'
import { logger } from '../../../logger'
import type { Expression } from '../../../awst/nodes'
import type { InstanceBuilder } from '../index'
import { requireExpressionOfType, requireInstanceBuilder } from './index'

function parseTypeArgs<T extends number>(
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

/**
 * Optional arg spec
 * Will be mapped to `Expression | undefined`
 */
type OptionalArg = [PType, undefined]
/**
 * Required arg spec
 * Will be mapped to `Expression`
 */
type RequiredArg = [PType]
/**
 * Required arg, but don't convert to an expression
 * Will be mapped to `InstanceBuilder`
 */
type RequiredBuilder = ['*']
/**
 * Optional arg, but don't convert to an expression
 * Will be mapped to `InstanceBuilder | undefined`
 */
type OptionalBuilder = ['*', undefined]
type ArgSpec = OptionalArg | RequiredArg | RequiredBuilder | OptionalBuilder

/**
 * Object arg spec
 * Will be mapped to an object with the same keys where each property
 * is mapped to a Required or Optional spec
 */
type ObjArgSpec = Record<string, ArgSpec>

/**
 * Maps an ObjArgSpec to its output type
 */
type ArgsForObjSpec<T extends ObjArgSpec> = {
  [key in keyof T]: T[key] extends OptionalArg ? Expression | undefined : Expression
}
/**
 * Defines the expected shape of a single argument.
 * Either an ArgSpec indicting a single value, or an ObjArgSpec indicating an
 * object literal with several properties
 */
type ArgMap = ArgSpec | ObjArgSpec

/**
 * Maps an arg spect to its output type
 */
type ArgFor<T extends ObjArgSpec | ArgSpec> = T extends ObjArgSpec
  ? ArgsForObjSpec<T>
  : T extends OptionalArg
    ? Expression | undefined
    : T extends RequiredArg
      ? Expression
      : T extends OptionalBuilder
        ? InstanceBuilder | undefined
        : T extends RequiredBuilder
          ? InstanceBuilder
          : never
/**
 * Maps each arg to an expected output type
 */
type ParsedArgs<T extends [...DeliberateAny[]]> = T extends [infer T1 extends ArgMap, ...infer TRest]
  ? [ArgFor<T1>, ...ParsedArgs<TRest>]
  : []

function parseObjArg<T extends Record<string, ArgSpec>>(
  arg: InstanceBuilder | undefined,
  sourceLocation: SourceLocation,
  subject: string,
  argMap: T,
): ArgsForObjSpec<T> {
  return Object.entries(argMap).reduce(
    (acc, [property, spec]) => {
      const [ptype, ...rest] = spec
      if (arg?.hasProperty(property)) {
        if (ptype === '*') {
          acc[property] = requireInstanceBuilder(arg.memberAccess(property, sourceLocation), sourceLocation)
        } else {
          acc[property] = requireExpressionOfType(arg.memberAccess(property, sourceLocation), ptype, sourceLocation)
        }
        return acc
      }
      if (rest.length === 0) {
        throw new CodeError(`${subject} is missing required property ${property}`, {
          sourceLocation: arg?.sourceLocation ?? sourceLocation,
        })
      }
      return acc
    },
    {} as Record<string, Expression | InstanceBuilder>,
  ) as ArgsForObjSpec<T>
}

export function parseFunctionArgs<const TGenericCount extends number, const TArgMap extends [...ArgMap[]]>({
  args,
  typeArgs,
  funcName,
  callLocation,
  genericTypeArgs,
  argMap,
}: {
  /**
   * Raw args array passed to call function
   */
  args: ReadonlyArray<InstanceBuilder>
  /**
   * Raw typeArgs array passed to call function
   */
  typeArgs: ReadonlyArray<PType>
  /**
   * The name of the function being called
   * (Used for error context)
   */
  funcName: string
  /**
   * The location of the call expression in the application source code
   */
  callLocation: SourceLocation
  /**
   * The expected number of generic type arguments
   */
  genericTypeArgs: TGenericCount
  /**
   * A mapping of expected argument types
   */
  argMap: TArgMap
}): {
  /**
   * A tuple of generic type args with a length of `TGenericCount`
   */
  ptypes: Tuple<PType, TGenericCount>
  args: ParsedArgs<TArgMap>
} {
  if (args.length > argMap.length) {
    throw new CodeError(`${funcName} has ${args.length - argMap.length} too many args`, { sourceLocation: callLocation })
  }
  return {
    ptypes: parseTypeArgs(typeArgs, callLocation, funcName, genericTypeArgs),
    args: argMap.map((a, i) => {
      const source: InstanceBuilder<PType> | undefined = args[i]
      if (Array.isArray(a)) {
        const [ptype, ...rest] = a
        if (source) {
          if (ptype === '*') {
            return source
          } else {
            return requireExpressionOfType(source, ptype, callLocation)
          }
        }
        if (rest.length === 0) {
          throw new CodeError(`Arg ${i} for ${funcName} is missing`, { sourceLocation: callLocation })
        }
      } else {
        return parseObjArg(source, callLocation, `Arg ${i} for ${funcName}`, a)
      }
    }) as ParsedArgs<TArgMap>,
  }
}
