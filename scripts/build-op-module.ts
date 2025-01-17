import { camelCase, pascalCase } from 'change-case'
import fs from 'fs'
import langSpec from '../langspec.puya.json'
import { hasFlags, invariant } from '../src/util'
import type { Op } from './langspec'

function range(start: number, end: number) {
  return Array(end - start)
    .fill(0)
    .map((_, i) => start + i)
}
export const ENUMS_TO_EXPOSE = new Set(['EC', 'ECDSA', 'vrf_verify', 'base64'])

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
  'store',
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
  'extract3',
  'gaid',
  'gload',
  'gloads',
  // has overload with stack params
  'txna',
  'gtxna',
  'itxna',
  'gitxna',
  'gtxnsa',
  'gtxnas',
  'gtxns',
  // Manually crafted
  'assert',
  'err',
  'return',

  // Special handling
  'select',
  'setbit',
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

export enum AlgoTsType {
  None = 0,
  Bytes = 1 << 0,
  Uint64 = 1 << 1,
  Boolean = 1 << 2,
  Account = 1 << 3,
  Asset = 1 << 4,
  Application = 1 << 5,
  Void = 1 << 6,
  BigUint = 1 << 7,
  String = 1 << 8,
  Enum = 1 << 9,
}

export type EnumValue = {
  name: string
  value: string
  doc: string
  stackType: AlgoTsType | null
  mode: string
  minAvmVersion: number
}

export type EnumDef = {
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
  '[1232]byte': AlgoTsType.Bytes,
  '[1793]byte': AlgoTsType.Bytes,
  any: AlgoTsType.Uint64 | AlgoTsType.Bytes,
}

const INPUT_ALGOTS_TYPE_MAP: Record<AlgoTsType, AlgoTsType> = {
  [AlgoTsType.None]: AlgoTsType.None,
  [AlgoTsType.Asset]: AlgoTsType.Asset | AlgoTsType.Uint64,
  [AlgoTsType.Application]: AlgoTsType.Application | AlgoTsType.Uint64,
  [AlgoTsType.Bytes]: AlgoTsType.Bytes,
  [AlgoTsType.String]: AlgoTsType.String,
  [AlgoTsType.Uint64]: AlgoTsType.Uint64,
  [AlgoTsType.Boolean]: AlgoTsType.Boolean,
  [AlgoTsType.Account]: AlgoTsType.Account,
  [AlgoTsType.Void]: AlgoTsType.Void,
  [AlgoTsType.BigUint]: AlgoTsType.BigUint,
  [AlgoTsType.Enum]: AlgoTsType.Enum,
}

const ARG_ENUMS = Object.entries(langSpec.arg_enums).map(([name, values], index): EnumDef => {
  const enumValues = values.map(
    (v): EnumValue => ({
      name: v.name,
      value: v.name,
      doc: v.doc ?? '',
      mode: v.mode,
      minAvmVersion: v.min_avm_version,
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
  ['gaids', 'gaid'],
  ['gloadss', 'gload'],
  ['setbit', 'setBit'],
  ['bitlen', 'bitLength'],
  ['setbyte', 'setByte'],
  ['getbyte', 'getByte'],
  ['getbit', 'getBit'],
])
type OpNameConfig = {
  nameOverride?: string
  prefix?: string
}

const GROUPED_OPCODES: { name: string; doc: string; ops: { [key: string]: OpNameConfig } }[] = [
  {
    name: 'AppGlobal',
    doc: 'Get or modify Global app state',
    ops: {
      app_global_get: { nameOverride: 'get' },
      app_global_get_ex: { nameOverride: 'get_ex' },
      app_global_del: { nameOverride: 'delete' },
      app_global_put: { nameOverride: 'put' },
    },
  },
  {
    name: 'AppLocal',
    doc: 'Get or modify Local app state',
    ops: {
      app_local_get: { nameOverride: 'get' },
      app_local_get_ex: { nameOverride: 'get_ex' },
      app_local_del: { nameOverride: 'delete' },
      app_local_put: { nameOverride: 'put' },
    },
  },
  {
    name: 'Box',
    doc: 'Get or modify box state',
    ops: {
      box_create: { nameOverride: 'create' },
      box_del: { nameOverride: 'delete' },
      box_extract: { nameOverride: 'extract' },
      box_get: { nameOverride: 'get' },
      box_len: { nameOverride: 'length' },
      box_put: { nameOverride: 'put' },
      box_replace: { nameOverride: 'replace' },
      box_resize: { nameOverride: 'resize' },
      box_splice: { nameOverride: 'splice' },
    },
  },
  {
    name: 'EllipticCurve',
    doc: 'Elliptic Curve functions',
    ops: {
      ec_add: { nameOverride: 'add' },
      ec_map_to: { nameOverride: 'map_to' },
      ec_multi_scalar_mul: { nameOverride: 'scalar_mul_multi' },
      ec_pairing_check: { nameOverride: 'pairing_check' },
      ec_scalar_mul: { nameOverride: 'scalar_mul' },
      ec_subgroup_check: { nameOverride: 'subgroup_check' },
    },
  },
  {
    name: 'ITxnCreate',
    doc: 'Create inner transactions',
    ops: {
      itxn_begin: { nameOverride: 'begin' },
      itxn_next: { nameOverride: 'next' },
      itxn_submit: { nameOverride: 'submit' },
      itxn_field: { prefix: 'set' },
    },
  },
  {
    name: 'Scratch',
    doc: 'Load or store scratch values',
    ops: { loads: { nameOverride: 'load' }, stores: { nameOverride: 'store' } },
  },
  { name: 'AcctParams', doc: '', ops: { acct_params_get: {} } },
  { name: 'AppParams', doc: '', ops: { app_params_get: {} } },
  { name: 'AssetHolding', doc: '', ops: { asset_holding_get: {} } },
  { name: 'AssetParams', doc: '', ops: { asset_params_get: {} } },
  { name: 'VoterParams', doc: '', ops: { voter_params_get: {} } },
  { name: 'Global', doc: '', ops: { global: {} } },
  { name: 'Block', doc: '', ops: { block: {} } },
  { name: 'JsonRef', doc: '', ops: { json_ref: {} } },
  { name: 'Txn', doc: 'Get values for the current executing transaction', ops: { txn: {}, txnas: {} } },
  { name: 'GTxn', doc: 'Get values for transactions in the current group', ops: { gtxn: {}, gtxnsas: {} } },
  { name: 'GITxn', doc: 'Get values for inner transaction in the last group submitted', ops: { gitxn: {}, gitxnas: {} } },
  { name: 'ITxn', doc: 'Get values for the last inner transaction', ops: { itxn: {}, itxnas: {} } },
]

export type OpArg = {
  name: string
  type: AlgoTsType
}

export type EnumArgMeta = {
  member: string
  pos: number
}

export type OpOverloadedFunction = {
  type: 'op-overloaded-function'
  minAvmVersion: number
  signatures: Array<{ immediateArgs: OpArg[]; stackArgs: OpArg[]; returnTypes: AlgoTsType[]; docs: string[] | string }>
  name: string
  opCode: string
}

export type OpFunction = {
  type: 'op-function'
  enumArg?: EnumArgMeta
  immediateArgs: OpArg[]
  stackArgs: OpArg[]
  returnTypes: AlgoTsType[]
  name: string
  opCode: string
  minAvmVersion: number
  docs: string[] | string
}

export type OpGrouping = {
  type: 'op-grouping'
  name: string
  functions: Record<string, OpFunction>
  docs: string[] | string
}

export type OpModule = {
  items: Array<OpFunction | OpGrouping | OpOverloadedFunction>
  enums: EnumDef[]
}

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
  return !(hasFlags(t, AlgoTsType.Enum) || atomicTypes.includes(t))
}
/**
 * If a function returns a union type, split into multiple functions for each part of the union
 *
 * eg.
 * get(): bytes | uint64
 * becomes
 * getBytes(): bytes
 * getUint64(): uint64
 *
 * We do this because union types can't be introspected on the AVM
 * @param opFunction
 */
function* splitUnionReturnTypes(opFunction: OpFunction): IterableIterator<OpFunction> {
  const indexOfUnionReturnType = opFunction.returnTypes.findIndex(isSplitableUnion)
  if (indexOfUnionReturnType === -1) {
    yield opFunction
  } else {
    const unionReturnType = opFunction.returnTypes[indexOfUnionReturnType]
    for (const atomicType of atomicTypes) {
      if (!hasFlags(unionReturnType, atomicType)) continue
      yield {
        ...opFunction,
        name: opFunction.name + AlgoTsType[atomicType],
        returnTypes: opFunction.returnTypes.map((t, i) => (i === indexOfUnionReturnType ? atomicType : t)),
      }
    }
  }
}

export function buildOpModule() {
  const opModule: OpModule = {
    items: [],
    enums: ARG_ENUMS,
  }

  function tryGetGroup(opCode: string): [OpGrouping | undefined, OpNameConfig] {
    const groupDef = GROUPED_OPCODES.find((g) => Object.hasOwn(g.ops, opCode))
    if (groupDef === undefined) return [undefined, {}]

    let group = opModule.items.find((g): g is OpGrouping => g.type === 'op-grouping' && g.name === groupDef.name)
    if (!group) {
      group = { name: groupDef.name, functions: {}, type: 'op-grouping', docs: groupDef.doc }
      opModule.items.push(group)
    }
    return [group, groupDef.ops[opCode]]
  }

  for (const [opCode, def] of Object.entries(langSpec.ops)) {
    if (EXCLUDED_OPCODES.has(opCode)) continue
    if (OPERATOR_OPCODES.has(opCode)) continue

    const [group, opNameConfig] = tryGetGroup(opCode)

    const opFunctions: OpFunction[] = []

    const enumArg = def.immediate_args.find((a) => a.arg_enum)
    const enumDef = ARG_ENUMS.find((e) => e.name === enumArg?.arg_enum)

    if (enumDef && enumArg && (enumArg.modifies_stack_output !== null || enumArg.modifies_stack_input !== null)) {
      for (const member of enumDef.members) {
        opFunctions.push({
          type: 'op-function',
          minAvmVersion: member.minAvmVersion || def.min_avm_version,
          opCode,
          enumArg: {
            member: member.name,
            pos: def.immediate_args.findIndex((a) => a === enumArg),
          },
          docs: member.doc,
          name: getEnumOpName(member.name, opNameConfig),
          immediateArgs: def.immediate_args.map((i) => ({
            name: camelCase(i.name),
            type: expandInputType(getMappedType(i.immediate_type, i.arg_enum)),
          })),
          stackArgs: def.stack_inputs.map((sa, i) => {
            if (i === enumArg.modifies_stack_input) {
              invariant(member.stackType, 'Member must have stack type')
              return { name: camelCase(sa.name), type: expandInputType(member.stackType) }
            }
            return { name: camelCase(sa.name), type: expandInputType(getMappedType(sa.stack_type, null)) }
          }),
          returnTypes: def.stack_outputs.map((o, i) => {
            if (i === enumArg.modifies_stack_output) {
              invariant(member.stackType, 'Member must have stackType')
              return member.stackType
            }
            return getMappedType(o.stack_type, null)
          }),
        })
      }
    } else {
      opFunctions.push(
        ...splitUnionReturnTypes({
          type: 'op-function',
          opCode: opCode,
          minAvmVersion: def.min_avm_version,
          name: getOpName(def.name, opNameConfig),
          immediateArgs: def.immediate_args.map((i) => ({
            name: camelCase(i.name),
            type: expandInputType(getMappedType(i.immediate_type, i.arg_enum)),
          })),
          stackArgs: def.stack_inputs.map((i) => ({ name: camelCase(i.name), type: expandInputType(getMappedType(i.stack_type, null)) })),
          returnTypes: def.stack_outputs.map((o) => getMappedType(o.stack_type, null)),
          docs: getOpDocs(def),
        }),
      )
    }
    for (const opFunction of opFunctions) {
      if (group) {
        group.functions[opFunction.name] = opFunction
      } else {
        opModule.items.push(opFunction)
      }
    }
  }

  // Manually handle select overloads
  opModule.items.push({
    type: 'op-overloaded-function',
    name: 'extract',
    minAvmVersion: 5,
    signatures: [
      {
        stackArgs: [
          {
            name: 'a',
            type: AlgoTsType.Bytes,
          },
          {
            name: 'b',
            type: AlgoTsType.Uint64,
          },
        ],
        immediateArgs: [],
        returnTypes: [AlgoTsType.Bytes],
        docs: ['A range of bytes from A starting at B up to the end of the sequence'],
      },
      {
        stackArgs: [
          {
            name: 'a',
            type: AlgoTsType.Bytes,
          },
          {
            name: 'b',
            type: AlgoTsType.Uint64,
          },
          {
            name: 'c',
            type: AlgoTsType.Uint64,
          },
        ],
        immediateArgs: [],
        returnTypes: [AlgoTsType.Bytes],
        docs: [
          'A range of bytes from A starting at B up to but not including B+C. If B+C is larger than the array length, the program fails',
        ],
      },
    ],
    opCode: 'extract3',
  })
  opModule.items.push({
    type: 'op-overloaded-function',
    name: 'select',
    minAvmVersion: 3,
    signatures: [
      {
        stackArgs: [
          {
            name: 'a',
            type: AlgoTsType.Bytes,
          },
          {
            name: 'b',
            type: AlgoTsType.Bytes,
          },
          {
            name: 'c',
            type: AlgoTsType.Uint64,
          },
        ],
        immediateArgs: [],
        returnTypes: [AlgoTsType.Bytes],
        docs: ['selects one of two values based on top-of-stack: B if C != 0, else A'],
      },
      {
        stackArgs: [
          {
            name: 'a',
            type: AlgoTsType.Uint64,
          },
          {
            name: 'b',
            type: AlgoTsType.Uint64,
          },
          {
            name: 'c',
            type: AlgoTsType.Uint64,
          },
        ],
        immediateArgs: [],
        returnTypes: [AlgoTsType.Uint64],
        docs: ['selects one of two values based on top-of-stack: B if C != 0, else A'],
      },
    ],
    opCode: 'select',
  })

  // Manually handle set bit overloads
  opModule.items.push({
    type: 'op-overloaded-function',
    name: 'setBit',
    minAvmVersion: 3,
    signatures: [
      {
        stackArgs: [
          {
            name: 'target',
            type: AlgoTsType.Bytes,
          },
          {
            name: 'n',
            type: AlgoTsType.Uint64,
          },
          {
            name: 'c',
            type: AlgoTsType.Uint64,
          },
        ],
        immediateArgs: [],
        returnTypes: [AlgoTsType.Bytes],
        docs: ['Set the nth bit of target to the value of c (1 or 0)'],
      },
      {
        stackArgs: [
          {
            name: 'target',
            type: AlgoTsType.Uint64,
          },
          {
            name: 'n',
            type: AlgoTsType.Uint64,
          },
          {
            name: 'c',
            type: AlgoTsType.Uint64,
          },
        ],
        immediateArgs: [],
        returnTypes: [AlgoTsType.Uint64],
        docs: ['Set the nth bit of target to the value of c (1 or 0)'],
      },
    ],
    opCode: 'setbit',
  })

  return opModule
}

function getOpName(opCode: string, config: OpNameConfig): string {
  return camelCase([config.prefix, RENAMED_OPCODES_MAP.get(opCode) ?? config.nameOverride ?? opCode].filter(Boolean).join('_'))
}

function getEnumOpName(enumMember: string, config: OpNameConfig): string {
  return camelCase([config.prefix, enumMember].filter(Boolean).join('_'))
}

function getMappedType(t: string | null, enumName: string | null): AlgoTsType {
  invariant(t !== 'arg_enum' || enumName !== undefined, 'Must provide enumName for arg_enum types')
  if (t === null || t === undefined) {
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

function splitBitFlags<T extends number>(aType: T): T[] {
  if (!aType) return []
  return new Array(Math.floor(Math.log2(aType)) + 1).fill(null).flatMap((_, i) => {
    const n = (2 ** i) as T
    return n & aType ? n : []
  })
}

function expandInputType(aType: AlgoTsType): AlgoTsType {
  return splitBitFlags(aType).reduce((acc, cur) => acc | (cur in INPUT_ALGOTS_TYPE_MAP ? INPUT_ALGOTS_TYPE_MAP[cur] : cur), AlgoTsType.None)
}

const getOpDocs = (op: Op): string[] => [
  ...(op.doc ?? [])
    .filter(Boolean)
    .map((d: string) => `${d.replace('params: ', '@param ').replace('Return: ', '\n * @return ')}`.split('\n').map((s) => s.trimEnd()))
    .flat(),
  `@see Native TEAL opcode: [\`${op.name}\`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#${op.name})`,
]

function testOpModule() {
  const mod = buildOpModule()

  fs.writeFileSync('op-module.json', JSON.stringify(mod, undefined, 2))
}
testOpModule()
