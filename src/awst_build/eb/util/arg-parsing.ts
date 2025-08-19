import type { SourceLocation } from '../../../awst/source-location'
import { CodeError } from '../../../errors'
import { logger } from '../../../logger'
import type { DeliberateAny, Tuple } from '../../../typescript-helpers'
import type { PType, PTypeOrClass } from '../../ptypes'
import type { InstanceBuilder, NodeBuilder } from '../index'
import { requestBuilderOfType, requireInstanceBuilder } from './index'

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

const ArgSpecDiscriminator = Symbol('_specType')

/**
 * Optional arg spec
 * Will be mapped to `InstanceBuilder | undefined`
 */
type OptionalArg = { t: PTypeOrClass[]; [ArgSpecDiscriminator]: 'arg'; type: 'optional' }
/**
 * Required arg spec
 * Will be mapped to `InstanceBuilder`
 */
type RequiredArg = { t: PTypeOrClass[]; type: 'required'; [ArgSpecDiscriminator]: 'arg' }

/**
 * Passthrough arg spec
 * Will be mapped to NodeBuilder | undefined
 */
type PassthroughArg = { type: 'passthrough'; [ArgSpecDiscriminator]: 'arg' }
type ArgSpec = OptionalArg | RequiredArg | PassthroughArg

/**
 * Object arg spec
 * Will be mapped to an object with the same keys where each property
 * is mapped to a Required or Optional spec
 */
type ObjArgSpec = Record<string, ArgSpec> & { [ArgSpecDiscriminator]: 'obj' }

/**
 * Maps an ObjArgSpec to its output type
 */
type ArgsForObjSpec<T extends ObjArgSpec> = {
  [key in keyof T]: ArgFor<T[key]>
}
/**
 * Defines the expected shape of a single argument.
 * Either an ArgSpec indicting a single value, or an ObjArgSpec indicating an
 * object literal with several properties
 */
type ArgMap = ArgSpec | ObjArgSpec

/**
 * Maps an arg spec to its output type
 */
type ArgFor<T extends ObjArgSpec | ArgSpec> = T extends ObjArgSpec
  ? ArgsForObjSpec<T>
  : T extends PassthroughArg
    ? NodeBuilder | undefined
    : T extends OptionalArg
      ? InstanceBuilder | undefined
      : T extends RequiredArg
        ? InstanceBuilder
        : never
/**
 * Maps each arg to an expected output type
 */
type ParsedArgs<T extends [...DeliberateAny[]]> = T extends [infer T1 extends ArgMap, ...infer TRest]
  ? [ArgFor<T1>, ...ParsedArgs<TRest>]
  : T extends []
    ? []
    : T extends Array<infer TItem extends ArgMap>
      ? Array<ArgFor<TItem>>
      : never

function parseObjArg<T extends ObjArgSpec>(
  arg: NodeBuilder | undefined,
  sourceLocation: SourceLocation,
  subject: string,
  argMap: T,
): ArgsForObjSpec<T> {
  return Object.entries(argMap).reduce(
    (acc, [property, spec]) => {
      if (arg?.hasProperty(property)) {
        const builder = arg.memberAccess(property, sourceLocation)
        if (spec.type === 'passthrough') {
          acc[property] = builder
          return acc
        }
        if (spec.t.length === 0) {
          acc[property] = requireInstanceBuilder(builder)
        } else {
          for (const t of spec.t) {
            const typedBuilder = requestBuilderOfType(builder, t)
            if (typedBuilder) {
              acc[property] = typedBuilder
              return acc
            }
          }
          throw new CodeError(
            `${subject} has an incorrect type for property '${property}' of ${builder.ptype}. Expected ${spec.t.join(' or ')}`,
            {
              sourceLocation: builder.sourceLocation,
            },
          )
        }
        return acc
      }
      if (spec.type === 'required') {
        throw new CodeError(`${subject} is missing required property ${property}`, {
          sourceLocation: arg?.sourceLocation ?? sourceLocation,
        })
      }
      return acc
    },
    {} as Record<string, InstanceBuilder | NodeBuilder>,
  ) as ArgsForObjSpec<T>
}

const argSpecFactory = {
  /**
   * A required arg with one of the specified types
   * @param ptypes
   */
  required(...ptypes: PTypeOrClass[]): RequiredArg {
    return { t: ptypes, type: 'required', [ArgSpecDiscriminator]: 'arg' }
  },
  /**
   * An optional arg with one of the specified types
   * @param ptypes
   */
  optional(...ptypes: PTypeOrClass[]): OptionalArg {
    return { t: ptypes, type: 'optional', [ArgSpecDiscriminator]: 'arg' }
  },
  /**
   * An object map arg, if all properties are optional - the arg itself becomes optional
   * @param props A mapping of expected properties to expected ptypes
   */
  obj<T extends Omit<ObjArgSpec, typeof ArgSpecDiscriminator>>(props: T): T & { [ArgSpecDiscriminator]: 'obj' } {
    return {
      ...props,
      [ArgSpecDiscriminator]: 'obj',
    }
  },
  passthrough(): PassthroughArg {
    return {
      type: 'passthrough',
      [ArgSpecDiscriminator]: 'arg',
    }
  },
}

export type ArgSpecFactory = typeof argSpecFactory

export function parseFunctionArgs<const TGenericCount extends number, const TArgMap extends [...ArgMap[]]>({
  args,
  typeArgs,
  funcName,
  callLocation,
  genericTypeArgs,
  argSpec,
}: {
  /**
   * Raw args array passed to call function
   */
  args: ReadonlyArray<NodeBuilder>
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
  argSpec: (a: ArgSpecFactory) => TArgMap
}): {
  /**
   * A tuple of generic type args with a length of `TGenericCount`
   */
  ptypes: Tuple<PType, TGenericCount>
  args: ParsedArgs<TArgMap>
} {
  const argMap = argSpec(argSpecFactory)
  if (args.length > argMap.length) {
    throw new CodeError(`${funcName} has ${args.length - argMap.length} too many args`, { sourceLocation: callLocation })
  }
  return {
    ptypes: parseTypeArgs(typeArgs, callLocation, funcName, genericTypeArgs),
    args: argMap.map((a, i) => {
      const source: NodeBuilder | undefined = args[i]
      if (a[ArgSpecDiscriminator] === 'arg') {
        if (a.type === 'passthrough') {
          return source
        }
        if (source) {
          if (a.t.length === 0) {
            return requireInstanceBuilder(source)
          } else {
            for (const t of a.t) {
              const builder = requestBuilderOfType(source, t)
              if (builder) {
                return builder
              }
            }
            throw new CodeError(`Arg ${i} of ${funcName} has an incorrect type of ${source.ptype}. Expected ${a.t.join(' | ')}`, {
              sourceLocation: source.sourceLocation,
            })
          }
        }
        if (a.type === 'required') {
          throw new CodeError(`Arg ${i} of ${funcName} is missing`, { sourceLocation: callLocation })
        }
      } else {
        return parseObjArg(source, callLocation, `Arg ${i} for ${funcName}`, a)
      }
    }) as ParsedArgs<TArgMap>,
  }
}
