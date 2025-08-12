import { camelCase, pascalCase } from 'change-case'
import langSpec from '../langspec.puya.json'
import { invariant } from '../src/util'
import type { Op } from './langspec'

function range(start: number, end: number) {
  return Array(end - start)
    .fill(0)
    .map((_, i) => start + i)
}
export const ENUMS_TO_EXPOSE = new Set(['EC', 'ECDSA', 'vrf_verify', 'base64', 'Mimc Configurations'])

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
  'itxna',
  'gtxna',
  'gtxn',
  'gtxnsa',
  'gtxnas',
  'gitxna',
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

export type AlgoTsType = SimpleAlgoTsType | BytesAlgoTsType | EnumAlgoTsType | UnionAlgoTsType

export class SimpleAlgoTsType {
  constructor(
    public readonly name: string,
    public readonly tsName: string,
  ) {}
}

export class BytesAlgoTsType {
  get name() {
    return `Bytes[${this.size}]`
  }
  get tsName() {
    return `bytes<${this.size}>`
  }
  constructor(public readonly size: number) {}
}
export class EnumAlgoTsType {
  constructor(public readonly name: string) {}
  get tsName() {
    return pascalCase(this.name)
  }
}
export class UnionAlgoTsType {
  get name(): string {
    return this.types.map((t) => t.name).join(' | ')
  }
  get tsName(): string {
    return this.types.map((t) => t.tsName).join(' | ')
  }
  readonly types: AlgoTsType[]
  constructor(...types: AlgoTsType[]) {
    this.types = types
  }
}

export const AlgoTsType = {
  None: new SimpleAlgoTsType('None', 'void'),
  Bytes: new SimpleAlgoTsType('Bytes', 'bytes'),
  Uint64: new SimpleAlgoTsType('Uint64', 'uint64'),
  Boolean: new SimpleAlgoTsType('Boolean', 'boolean'),
  Account: new SimpleAlgoTsType('Account', 'Account'),
  Asset: new SimpleAlgoTsType('Asset', 'Asset'),
  Application: new SimpleAlgoTsType('Application', 'Application'),
  Void: new SimpleAlgoTsType('Void', 'void'),
  BigUint: new SimpleAlgoTsType('BigUint', 'biguint'),
  String: new SimpleAlgoTsType('String', 'string'),
  OnCompletion: new SimpleAlgoTsType('OnCompletion', 'OnCompleteAction'),
  TransactionType: new SimpleAlgoTsType('TransactionType', 'TransactionType'),
}

function getInputTypes(typ: AlgoTsType): AlgoTsType {
  switch (typ.name) {
    case 'Asset':
    case 'Application':
    case 'OnCompletion':
    case 'TransactionType':
      return new UnionAlgoTsType(typ, AlgoTsType.Uint64)
    default:
      return typ
  }
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
  typeFlag: EnumAlgoTsType
  name: string
  tsName: string
  members: EnumValue[]
}

const TYPE_MAP: Record<string, AlgoTsType> = {
  account: AlgoTsType.Account,
  address: AlgoTsType.Account,
  address_or_index: new UnionAlgoTsType(AlgoTsType.Account, AlgoTsType.Uint64),
  application: AlgoTsType.Application,
  asset: AlgoTsType.Asset,
  bool: AlgoTsType.Boolean,
  bool_only: AlgoTsType.Boolean,
  boxName: AlgoTsType.Bytes,
  stateKey: AlgoTsType.Bytes,
  uint8: AlgoTsType.Uint64,
  uint64: AlgoTsType.Uint64,
  bigint: AlgoTsType.BigUint,

  '[]byte': AlgoTsType.Bytes,
  '[8]byte': new BytesAlgoTsType(8),
  '[32]byte': new BytesAlgoTsType(32),
  '[33]byte': new BytesAlgoTsType(33),
  '[64]byte': new BytesAlgoTsType(64),
  '[80]byte': new BytesAlgoTsType(80),
  '[1232]byte': new BytesAlgoTsType(1232),
  '[1793]byte': new BytesAlgoTsType(1793),
  any: new UnionAlgoTsType(AlgoTsType.Bytes, AlgoTsType.Uint64),
}

const ARG_ENUMS = Object.entries(langSpec.arg_enums).map(([name, values]): EnumDef => {
  const enumValues = values.map(
    (v): EnumValue => ({
      name: v.name,
      value: v.name,
      doc: v.doc ?? '',
      mode: v.mode,
      minAvmVersion: v.min_avm_version,
      stackType: v.stack_type === null ? null : getEnumStackType(name, v.name, v.stack_type),
    }),
  )

  return {
    typeFlag: new EnumAlgoTsType(pascalCase(name)),
    name,
    tsName: pascalCase(name),
    members: enumValues,
  }
})

function getEnumStackType(enumName: string, enumMember: string, documentedType: string) {
  switch (enumName) {
    case 'txn':
      switch (enumMember) {
        case 'OnCompletion':
          return AlgoTsType.OnCompletion
        case 'TypeEnum':
          return AlgoTsType.TransactionType
      }
  }
  return getMappedType(documentedType, null)
}

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
  { name: 'GTxn', doc: 'Get values for transactions in the current group', ops: { gtxns: {}, gtxnsas: {} } },
  { name: 'GITxn', doc: 'Get values for inner transaction in the last group submitted', ops: { gitxn: {}, gitxnas: {} } },
  { name: 'ITxn', doc: 'Get values for the last inner transaction', ops: { itxn: {}, itxnas: {} } },
]

export type OpArg = {
  name: string
  type: AlgoTsType
  optional?: boolean
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

function isSplitableUnion(t: AlgoTsType): boolean {
  return t instanceof UnionAlgoTsType
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
    invariant(unionReturnType instanceof UnionAlgoTsType, 'union type should be union type...')
    for (const atomicType of unionReturnType.types) {
      yield {
        ...opFunction,
        name: opFunction.name + atomicType.name,
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
            type: getInputTypes(getMappedType(i.immediate_type, i.arg_enum)),
          })),
          stackArgs: def.stack_inputs.map((sa, i) => {
            if (i === enumArg.modifies_stack_input) {
              invariant(member.stackType, 'Member must have stack type')
              return { name: camelCase(sa.name), type: getInputTypes(member.stackType) }
            }
            return { name: camelCase(sa.name), type: getInputTypes(getMappedType(sa.stack_type, null)) }
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
            type: getInputTypes(getMappedType(i.immediate_type, i.arg_enum)),
          })),
          stackArgs: def.stack_inputs.map((i) => ({ name: camelCase(i.name), type: getInputTypes(getMappedType(i.stack_type, null)) })),
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

const getOpDocs = (op: Op): string[] => [
  ...(op.doc ?? [])
    .filter(Boolean)
    .map((d: string) => `${d.replace('params: ', '@param ').replace('Return: ', '\n * @return ')}`.split('\n').map((s) => s.trimEnd()))
    .flat(),
  `@see Native TEAL opcode: [\`${op.name}\`](https://dev.algorand.co/reference/algorand-teal/opcodes#${op.name})`,
]
