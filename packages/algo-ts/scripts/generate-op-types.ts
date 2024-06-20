import langSpec from '../langspec.puya.json'
import * as fs from 'fs'
import { compact, range } from 'lodash'
import { ArgEnum, ArgEnumValue, LangSpec, Op } from './langspec'
import { invariant } from '../../../src/util'
import { camelCase, pascalCase } from 'change-case'
import { str } from '@algorandfoundation/algo-ts'

const EXCLUDED_OPCODES = new Set([
  // low level flow control
  'bnz',
  'bz',
  'b',
  'callsub',
  'retsub',
  'proto',
  'switch',
  'match',
  // low level stack manipulation
  'intc',
  ...range(0, 4).map((i) => `intc_${i}`),
  'bytec',
  ...range(0, 4).map((i) => `bytec_${i}`),
  'pushbytes',
  'pushbytess',
  'pushint',
  'pushints',
  'frame_dig',
  'frame_bury',
  'bury',
  'cover',
  'dig',
  'dup',
  'dup2',
  'dupn',
  'pop',
  'popn',
  'swap',
  'uncover',
  // program scratch slot read/modification (for current program)
  'load',
  'loads',
  'store',
  'stores',
  // maninuplates what other low level ops point to
  'intcblock',
  'bytecblock',
  // implicit immediates, covered by optimiser and/or assembler
  ...[...Array(4).keys()].map((i) => `arg_${i}`),
  // have a higher level abstraction that supersedes it
  'log',
  // skip as the version with more parameters is available
  'arg',
  'replace2',
  'substring',
  'extract',
  'gaid',
  'gload',
  'gloads',
  // skip as they are part of merged ops
  'txn',
  'txna',
  'txnas',
  'itxn',
  'itxna',
  'itxnas',
  'gitxn',
  'gitxna',
  'gitxnas',
  'gtxn',
  'gtxna',
  'gtxnas',
  'gtxns',
  'gtxnsa',
  'gtxnsas',
  // Manually crafted
  'assert',
  'err',
  'return',
])

const OPERATOR_OPCODES = new Set([
  '!',
  '!=',
  '%',
  '&',
  '&&',
  '*',
  '+',
  '-',
  '/',
  '<',
  '<=',
  '==',
  '>',
  '>=',
  '^',
  'b!=',
  'b%',
  'b&',
  'b*',
  'b+',
  'b-',
  'b/',
  'b<',
  'b<=',
  'b==',
  'b>',
  'b>=',
  'b^',
  'b|',
  'b~',
  '|',
  '||',
  '~',
])

enum AlgoTsType {
  Bytes = 1 << 0,
  Uint64 = 1 << 1,
  Boolean = 1 << 2,
  Account = 1 << 3,
  Asset = 1 << 4,
  Application = 1 << 5,
  Void = 1 << 6,
  BigUint = 1 << 7,
  Enum = 1 << 8,
}

type EnumValue = {
  name: string
  doc: string
  stackType: AlgoTsType | null
  mode: string
}

type EnumDef = {
  typeFlag: number
  name: string
  tsName: string
  members: EnumValue[]
}

const TYPE_MAP: Record<string, AlgoTsType> = {
  account: AlgoTsType.Account,
  address: AlgoTsType.Account,
  address_or_index: AlgoTsType.Account | AlgoTsType.Uint64,
  application: AlgoTsType.Application,
  asset: AlgoTsType.Asset,
  bool: AlgoTsType.Boolean,
  boxName: AlgoTsType.Bytes,
  stateKey: AlgoTsType.Bytes,
  uint8: AlgoTsType.Uint64,
  uint64: AlgoTsType.Uint64,
  bigint: AlgoTsType.BigUint,

  '[]byte': AlgoTsType.Bytes,
  '[8]byte': AlgoTsType.Bytes,
  '[32]byte': AlgoTsType.Bytes,
  '[33]byte': AlgoTsType.Bytes,
  '[64]byte': AlgoTsType.Bytes,
  '[80]byte': AlgoTsType.Bytes,
  any: AlgoTsType.Uint64 | AlgoTsType.Bytes,
}

const ARG_ENUMS = Object.entries(langSpec.arg_enums).map(([name, values], index): EnumDef => {
  const enumValues = values.map(
    (v): EnumValue => ({
      name: v.name,
      doc: v.doc ?? '',
      mode: v.mode,
      stackType: v.stack_type === null ? null : getMappedType(v.stack_type, null),
    }),
  )

  return {
    typeFlag: (AlgoTsType.Enum << (index + 1)) | AlgoTsType.Enum,
    name,
    tsName: pascalCase(name),
    members: enumValues,
  }
})

const RENAMED_OPCODES_MAP = new Map([
  ['args', 'arg'],
  ['return', 'exit'],
  ['replace3', 'replace'],
  ['substring3', 'substring'],
  ['extract3', 'extract'],
  ['gaids', 'gaid'],
  ['gloadss', 'gload'],
  ['setbit', 'setBit'],
  ['bitlen', 'bitLength'],
  ['setbyte', 'setBytes'],
  ['getbyte', 'getBytes'],
  ['getbit', 'getBit'],
])

const GROUPED_OPCODES: { name: string; doc: string; ops: { [key: string]: string } }[] = [
  {
    name: 'AppGlobal',
    doc: 'Get or modify Global app state',
    ops: {
      app_global_get: 'get',
      app_global_get_ex: 'get_ex',
      app_global_del: 'delete',
      app_global_put: 'put',
    },
  },
  {
    name: 'AppLocal',
    doc: 'Get or modify Local app state',
    ops: {
      app_local_get: 'get',
      app_local_get_ex: 'get_ex',
      app_local_del: 'delete',
      app_local_put: 'put',
    },
  },
  {
    name: 'Box',
    doc: 'Get or modify box state',
    ops: {
      box_create: 'create',
      box_del: 'delete',
      box_extract: 'extract',
      box_get: 'get',
      box_len: 'length',
      box_put: 'put',
      box_replace: 'replace',
      box_resize: 'resize',
      box_splice: 'splice',
    },
  },
  {
    name: 'EllipticCurve',
    doc: 'Elliptic Curve functions',
    ops: {
      ec_add: 'add',
      ec_map_to: 'map_to',
      ec_multi_scalar_mul: 'scalar_mul_multi',
      ec_pairing_check: 'pairing_check',
      ec_scalar_mul: 'scalar_mul',
      ec_subgroup_check: 'subgroup_check',
    },
  },
  {
    name: 'ITxnCreate',
    doc: 'Create inner transactions',
    ops: {
      itxn_begin: 'begin',
      itxn_next: 'next',
      itxn_submit: 'submit',
      itxn_field: 'set',
    },
  },
  {
    name: 'Scratch',
    doc: 'Load or store scratch values',
    ops: { loads: 'load', stores: 'store' },
  },
]

const MERGED_OPCODES: { name: string; doc: string; ops: { [key: string]: string } }[] = [
  {
    name: 'Txn',
    doc: 'Get values for the current executing transaction',
    ops: {
      txn: 'txn',
      txnas: 'txna',
    },
  },
  {
    name: 'ITxn',
    doc: 'Get values for the last inner transaction',
    ops: {
      itxn: 'txn',
      itxnas: 'txna',
    },
  },
  {
    name: 'GITxn',
    doc: 'Get values for inner transaction in the last group submitted',
    ops: {
      gitxn: 'txn',
      gitxnas: 'txna',
    },
  },
  {
    name: 'GTxn',
    doc: 'Get values for transactions in the current group',
    ops: {
      gtxns: 'txn',
      gtxnsas: 'txna',
    },
  },
]

const OPCODES_WITH_ENUM_MAP: { [key: string]: string } = {
  acct_params_get: 'AcctParams',
  app_params_get: 'AppParams',
  asset_holding_get: 'AssetHolding',
  asset_params_get: 'AssetParams',
  global: 'Global',
  block: 'Block',
  json_ref: 'JsonRef',
}

const ENUMS_TO_EXPOSE = new Set(['EC', 'ECDSA', 'vrf_verify', 'base64', 'itxn_field', 'json_ref'])

type OpArg = {
  name: string
  type: AlgoTsType
}

type OpFunction = {
  type: 'op-function'
  immediateArgs: OpArg[]
  stackArgs: OpArg[]
  returnTypes: AlgoTsType[]
  name: string
  opCode: string
  docs: string[] | string
}

type OpGrouping = {
  type: 'op-grouping'
  name: string
  functions: OpFunction[]
  docs: string[] | string
}

type OpOverload = {
  name: string
  enumMember: string
  enumIn: 'immediate' | 'stack'
  enumPos: number
  docs: string[] | string

  immediateArgs: OpArg[]
  stackArgs: OpArg[]
  returnTypes: AlgoTsType[]
}

type OpOverloadedFunction = {
  type: 'op-overloaded-function'
  name: string
  opCode: string
  overloads: OpOverload[]
  docs: string[] | string
}

type OpModule = {
  items: Array<OpFunction | OpGrouping | OpOverloadedFunction>
}

const groupedOpcodes = new Set(GROUPED_OPCODES.flatMap((g) => Object.keys(g.ops)))

const atomicTypes = [
  AlgoTsType.Bytes,
  AlgoTsType.Uint64,
  AlgoTsType.Boolean,
  AlgoTsType.Account,
  AlgoTsType.Asset,
  AlgoTsType.Application,
  AlgoTsType.Void,
  AlgoTsType.BigUint,
]
function isSplitableUnion(t: AlgoTsType): boolean {
  return !(hasFlag(t, AlgoTsType.Enum) || atomicTypes.includes(t))
}
/**
 * If a function returns a union type, split it into multiple functions for each part of the union
 *
 * eg.
 * get(): bytes | uint64
 * becomes
 * getBytes(): bytes
 * getUint64(): uint64
 *
 * We do this because union types can be introspected on the AVM
 * @param opFunction
 */
function* splitUnionReturnTypes(opFunction: OpFunction): IterableIterator<OpFunction> {
  const indexOfUnionReturnType = opFunction.returnTypes.findIndex(isSplitableUnion)
  if (indexOfUnionReturnType === -1) {
    yield opFunction
  } else {
    const unionReturnType = opFunction.returnTypes[indexOfUnionReturnType]
    for (const atomicType of atomicTypes) {
      if (!hasFlag(unionReturnType, atomicType)) continue
      yield {
        ...opFunction,
        name: opFunction.name + AlgoTsType[atomicType],
        returnTypes: opFunction.returnTypes.map((t, i) => (i == indexOfUnionReturnType ? atomicType : t)),
      }
    }
  }
}

function buildOpModule() {
  const opModule: OpModule = {
    items: [],
  }

  for (const [opCode, def] of Object.entries(langSpec.ops)) {
    if (EXCLUDED_OPCODES.has(opCode)) continue
    if (OPERATOR_OPCODES.has(opCode)) continue

    if (Object.hasOwn(OPCODES_WITH_ENUM_MAP, opCode)) {
      const overloadedFn: OpOverloadedFunction = {
        name: OPCODES_WITH_ENUM_MAP[opCode],
        type: 'op-overloaded-function',
        opCode,
        docs: getOpDocs(def),
        overloads: [],
      }
      opModule.items.push(overloadedFn)

      const enumArg = def.immediate_args.find((a) => a.arg_enum)
      const enumDef = ARG_ENUMS.find((e) => e.name === enumArg?.arg_enum)
      invariant(enumArg && enumDef, 'Must have an enum arg with def')

      for (const member of enumDef.members) {
        overloadedFn.overloads.push({
          enumMember: member.name,
          docs: member.doc,
          name: camelCase(member.name),
          enumIn: 'immediate',
          enumPos: def.immediate_args.findIndex((a) => a === enumArg),
          immediateArgs: def.immediate_args.map((i) => ({ name: camelCase(i.name), type: getMappedType(i.immediate_type, i.arg_enum) })),
          stackArgs: def.stack_inputs.map((i) => ({ name: camelCase(i.name), type: getMappedType(i.stack_type, null) })),
          returnTypes: def.stack_outputs.map((o, i) => {
            if (i === enumArg.modifies_stack_output) {
              invariant(member.stackType, 'Member must have stackType')
              return member.stackType
            }
            return getMappedType(o.stack_type, null)
          }),
        })
      }
    } else if (groupedOpcodes.has(opCode)) {
      const groupDef = GROUPED_OPCODES.find((g) => Object.hasOwn(g.ops, opCode))
      invariant(groupDef, 'Group has def')

      let group = opModule.items.find((g): g is OpGrouping => g.type === 'op-grouping' && g.name === groupDef.name)
      if (!group) {
        group = { name: groupDef.name, functions: [], type: 'op-grouping', docs: groupDef.doc }
        opModule.items.push(group)
      }

      group.functions.push(
        ...splitUnionReturnTypes({
          type: 'op-function',
          opCode: opCode,
          name: camelCase(groupDef.ops[def.name]),
          immediateArgs: def.immediate_args.map((i) => ({ name: camelCase(i.name), type: getMappedType(i.immediate_type, i.arg_enum) })),
          stackArgs: def.stack_inputs.map((i) => ({ name: camelCase(i.name), type: getMappedType(i.stack_type, null) })),
          returnTypes: def.stack_outputs.map((o) => getMappedType(o.stack_type, null)),
          docs: getOpDocs(def),
        }),
      )
    } else {
      opModule.items.push(
        ...splitUnionReturnTypes({
          type: 'op-function',
          opCode: opCode,
          name: getOpName(def.name),
          immediateArgs: def.immediate_args.map((i) => ({ name: camelCase(i.name), type: getMappedType(i.immediate_type, i.arg_enum) })),
          stackArgs: def.stack_inputs.map((i) => ({ name: camelCase(i.name), type: getMappedType(i.stack_type, null) })),
          returnTypes: def.stack_outputs.map((o) => getMappedType(o.stack_type, null)),
          docs: getOpDocs(def),
        }),
      )
    }
  }
  return opModule
}

function getOpName(opCode: string): string {
  return RENAMED_OPCODES_MAP.get(opCode) ?? camelCase(opCode)
}

function getMappedType(t: string | null, enumName: string | null): AlgoTsType {
  invariant(t !== 'arg_enum' || enumName !== undefined, 'Must provide enumName for arg_enum types')
  if (t == null) {
    throw new Error('Missing type')
  }
  if (t === 'arg_enum') {
    const enumDef = ARG_ENUMS.find((a) => a.name === enumName)
    invariant(enumDef, `Definition must exist for ${enumName}`)
    return enumDef.typeFlag
  }
  const mappedType = TYPE_MAP[t ?? '']
  invariant(mappedType, `Mapped type must exist for ${t}`)
  return mappedType
}

const getOpDocs = (op: Op): string[] => [
  ...compact(op.doc ?? [])
    .map((d: string) => `${d.replace('params: ', '@param ').replace('Return: ', '\n * @return ')}`.split('\n').map((s) => s.trimEnd()))
    .flat(),
  `@see Native TEAL opcode: [\`${op.name}\`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#${op.name})`,
]

const fullFilePathName = `${__dirname}/../src/op-types-2.ts`

function hasFlag(subject: number, flag: number): boolean {
  return (subject & flag) === flag
}

function* enumerate<T>(iterable: Iterable<T>): IterableIterator<readonly [number, T]> {
  let i = 0
  for (const item of iterable) {
    yield [i, item]
    i++
  }
}

function* emitTypes(module: OpModule) {
  function* emitDoc(doc: string | string[]) {
    if (Array.isArray(doc)) {
      yield '/**'
      for (const row of doc) {
        yield '\n  * '
        yield row
      }
      yield '\n */'
    } else {
      yield '/**'
      yield '\n  * '
      yield doc
      yield '\n */'
    }
    yield '\n'
  }
  function* emitEnums() {
    for (const enumDef of ARG_ENUMS) {
      if (!ENUMS_TO_EXPOSE.has(enumDef.name)) continue

      yield `export enum ${enumDef.tsName} {`
      for (const member of enumDef.members) {
        yield `${member.name},`
      }

      yield `}`
    }
  }

  function* emitReturnType(returnType: AlgoTsType) {
    if (hasFlag(returnType, AlgoTsType.Application)) yield 'Application'
    if (hasFlag(returnType, AlgoTsType.Account)) yield 'Account'
    if (hasFlag(returnType, AlgoTsType.Asset)) yield 'Asset'
    if (hasFlag(returnType, AlgoTsType.Uint64)) yield 'uint64'
    if (hasFlag(returnType, AlgoTsType.Bytes)) yield 'bytes'
    if (hasFlag(returnType, AlgoTsType.Boolean)) yield 'boolean'
    if (hasFlag(returnType, AlgoTsType.BigUint)) yield 'biguint'
    if (hasFlag(returnType, AlgoTsType.Void)) yield 'void'
    if (hasFlag(returnType, AlgoTsType.Enum)) {
      for (const enumDef of ARG_ENUMS.filter((a) => hasFlag(a.typeFlag, returnType))) {
        yield enumDef.tsName
      }
    }
  }
  function* emitReturnTypes(returnTypes: AlgoTsType[]) {
    switch (returnTypes.length) {
      case 0:
        yield 'void'
        break
      case 1:
        yield Array.from(emitReturnType(returnTypes[0])).join(' | ')
        break
      default:
        yield 'readonly ['
        for (const rt of returnTypes) {
          yield Array.from(emitReturnType(rt)).join(' | ')
          yield ','
        }
        yield ']'
        break
    }
  }
  function* emitArgType(argType: AlgoTsType) {
    if (hasFlag(argType, AlgoTsType.Application)) yield 'Application'
    if (hasFlag(argType, AlgoTsType.Account)) yield 'Account'
    if (hasFlag(argType, AlgoTsType.Asset)) yield 'Asset'
    if (hasFlag(argType, AlgoTsType.Uint64)) yield 'uint64'
    if (hasFlag(argType, AlgoTsType.Bytes)) yield 'bytes'
    if (hasFlag(argType, AlgoTsType.Boolean)) yield 'boolean'
    if (hasFlag(argType, AlgoTsType.BigUint)) yield 'biguint'
    if (hasFlag(argType, AlgoTsType.Void)) yield 'void'
    if (hasFlag(argType, AlgoTsType.Enum)) {
      for (const enumDef of ARG_ENUMS.filter((a) => hasFlag(a.typeFlag, argType))) {
        yield enumDef.tsName
      }
    }
  }
  yield* emitEnums()

  for (const item of module.items) {
    if (item.type === 'op-function') {
      yield* emitDoc(item.docs)
      yield `export type ${pascalCase(item.name)}Type = (`
      for (const arg of item.immediateArgs) {
        yield arg.name
        yield ':'
        yield Array.from(emitArgType(arg.type)).join(' | ')
        yield ','
      }
      for (const arg of item.stackArgs) {
        yield arg.name
        yield ':'
        yield Array.from(emitArgType(arg.type)).join(' | ')
        yield ','
      }
      yield `) => `
      yield* emitReturnTypes(item.returnTypes)
      yield '\n'
    } else if (item.type === 'op-grouping') {
      yield* emitDoc(item.docs)

      yield `export type ${item.name}Type = {`
      for (const fn of item.functions) {
        yield `${fn.name}(`

        for (const arg of fn.immediateArgs) {
          yield arg.name
          yield ':'
          yield Array.from(emitArgType(arg.type)).join(' | ')
          yield ','
        }
        for (const arg of fn.stackArgs) {
          yield arg.name
          yield ':'
          yield Array.from(emitArgType(arg.type)).join(' | ')
          yield ','
        }

        yield `): `
        yield* emitReturnTypes(fn.returnTypes)
        yield ','
      }
      yield `}\n`
    } else {
      yield* emitDoc(item.docs)

      yield `export type ${item.name}Type = {`

      for (const ol of item.overloads) {
        if (ol.stackArgs.length === 0 && ol.immediateArgs.length === 1) {
          yield 'get '
        }
        yield `${ol.name}(`
        for (const [index, arg] of enumerate(ol.immediateArgs)) {
          if (index === ol.enumPos && ol.enumIn === 'immediate') continue
          yield arg.name
          yield ':'
          yield Array.from(emitArgType(arg.type)).join(' | ')
          yield ','
        }
        for (const arg of ol.stackArgs) {
          yield arg.name
          yield ':'
          yield Array.from(emitArgType(arg.type)).join(' | ')
          yield ','
        }
        yield `):`
        yield* emitReturnTypes(ol.returnTypes)
        yield ','
      }

      yield `}\n`
    }
  }

  yield `export type OpsNamespace = {\n`
  for (const item of opModule.items) {
    yield `${item.name}: ${pascalCase(item.name)}Type, `
  }
  yield `}`
}

fs.writeFileSync(fullFilePathName, `import { bytes, BytesCompat, uint64, Uint64Compat, biguint } from './primitives'` + '\n')
fs.appendFileSync(fullFilePathName, `import { Account, Application, Asset } from './reference'` + '\n\n')

const opModule = buildOpModule()
fs.appendFileSync(fullFilePathName, Array.from(emitTypes(opModule)).join(''))
