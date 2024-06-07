import langSpec from '../langspec.puya.json'
import * as fs from 'fs'
import { upperFirst, camelCase, compact, range } from 'lodash'
import { ArgEnum, ArgEnumValue, LangSpec, Op } from './langspec'

const EXCLUDED_OPCODES = [
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
]

const OPERATOR_OPCODES = [
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
]

const KEYWORD_OPCODES = ['switch']

const TYPE_MAP: { [key: string]: string | { input: string; output: string } } = {
  account: 'Account',
  address: 'Account',
  address_or_index: { input: 'Account | Uint64Compat', output: 'Account' },
  application: 'Application',
  asset: { input: 'Asset | Uint64Compat', output: 'Asset' },
  base64: 'Base64',
  bool: 'boolean',
  boxName: { input: 'BytesCompat', output: 'bytes' },
  stateKey: { input: 'BytesCompat', output: 'bytes' },
  uint8: 'uint64',
  uint64: { input: 'Uint64Compat', output: 'uint64' },
  vrf_verify: 'VrfVerify',
  '[]byte': { input: 'BytesCompat', output: 'bytes' },
  '[8]byte': { input: 'BytesCompat', output: 'bytes' },
  '[32]byte': { input: 'BytesCompat', output: 'bytes' },
  '[33]byte': { input: 'BytesCompat', output: 'bytes' },
  '[64]byte': { input: 'BytesCompat', output: 'bytes' },
  '[80]byte': { input: 'BytesCompat', output: 'bytes' },
  any: { input: 'Uint64Compat | BytesCompat', output: 'any' },
}

const ANY_TYPES = ['bytes', 'uint64']

const RENAMED_OPCODES_MAP: { [key: string]: string } = {
  args: 'arg',
  return: 'exit',
  replace3: 'replace',
  substring3: 'substring',
  extract3: 'extract',
  gaids: 'gaid',
  gloadss: 'gload',
}

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
      itxn_field: 'set*',
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
  acct_params_get: 'acct_params',
  app_params_get: 'app_params',
  asset_holding_get: 'asset_holding',
  asset_params_get: 'asset_params',
  global: 'global',
  block: 'block',
  json_ref: 'json_ref',
}

const getMappedType = (t: string | null): string => {
  const mappedType = TYPE_MAP[t ?? '']
  if (mappedType) {
    if (typeof mappedType === 'string') return mappedType
    return mappedType.input
  } else return t || ''
}

const getMappedOutputType = (t: string | null): string => {
  const mappedType = TYPE_MAP[t ?? '']
  if (mappedType) {
    if (typeof mappedType === 'string') return mappedType
    return mappedType.output
  } else return t || ''
}

const compareNamesAsc = (a: { name: string }, b: { name: string }) => (a.name > b.name ? 1 : -1)
const getOpDocs = (op: Op): string[] => [
  '/**',
  ...compact(op.doc ?? [])
    .map((d: string) => ` * ${d.replace('params: ', '@param ').replace('Return: ', '\n * @return ')}`.split('\n').map((s) => s.trimEnd()))
    .flat(),
  ` * @see Native TEAL opcode: [\`${op.name}\`](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/v10/#${op.name})`,
  ' */',
]
const getReturnTypeString = (returnTypes: string[]): string =>
  returnTypes.length <= 0 ? 'void' : returnTypes.length > 1 ? `[${returnTypes.join(', ')}]` : returnTypes[0]

const getOpType = (
  op: Op,
  opCodeMap: { [key: string]: string } = RENAMED_OPCODES_MAP,
  exportAsType: boolean = true,
): { name: string; str: string }[] => {
  const immediateTypes = op.immediate_args.map((a) => ({
    name: a.name,
    type: a.immediate_type === 'arg_enum' ? a.arg_enum : a.immediate_type,
  }))
  const inputTypeString: string = [
    ...immediateTypes.map((i) => `${i.name.toLowerCase()}: ${getMappedType(i.type)}`),
    ...op.stack_inputs.map((i) => `${i.name.toLowerCase()}: ${getMappedType(i.stack_type)}`),
  ].join(', ')

  const returnTypes: string[] = op.stack_outputs.length === 0 ? ['void'] : op.stack_outputs.map((o) => getMappedOutputType(o.stack_type))

  return (returnTypes.includes('any') ? ANY_TYPES : ['']).map((a) => {
    const returnTypeString = getReturnTypeString(returnTypes.map((r) => (r === 'any' ? a : r)))
    const mappedName = camelCase((opCodeMap[op.name] ?? op.name) + upperFirst(a))
    const typeName = exportAsType ? `${upperFirst(mappedName)}${exportAsType ? 'Type' : ''}` : null
    return {
      name: typeName || mappedName,
      str: `${exportAsType ? `export type ${typeName} =` : `${mappedName}:`} (${inputTypeString}) => ${returnTypeString}`,
    }
  })
}

const getEnumType = (key: string, values: ArgEnumValue[]): string =>
  [
    `export enum ${getMappedType(key)} {`,
    ...values.map((v) => compact([v.doc ? [`  /*`, `   * ${v.doc}`, `   */`].join('\n') : '', `  ${v.name} = '${v.name}',`])).flat(),
    '}',
  ].join('\n')

const enums: { [key: string]: string } = Object.assign(
  {},
  ...Object.keys(langSpec.arg_enums)
    .filter((key) => (langSpec.arg_enums as ArgEnum)[key].every((v) => v.stack_type === null))
    .map((key) => ({ [key]: getEnumType(key, (langSpec.arg_enums as ArgEnum)[key]) })),
)

const opFunctions: { [key: string]: string[] } = Object.assign(
  {},
  ...Object.values(langSpec.ops)
    .filter((op) => !EXCLUDED_OPCODES.includes(op.name))
    .filter((op) => !OPERATOR_OPCODES.includes(op.name))
    .filter((op) => !KEYWORD_OPCODES.includes(op.name))
    .filter((op) => !GROUPED_OPCODES.some((g) => Object.keys(g.ops).includes(op.name)))
    .filter((op) => !Object.keys(OPCODES_WITH_ENUM_MAP).includes(op.name))
    .map((op) => getOpType(op).map((opType) => ({ op, ...opType })))
    .flat()
    .sort(compareNamesAsc)
    .map((opType) => ({ [opType.name]: [...getOpDocs(opType.op), opType.str] })),
)

const getEnumOpType = (
  op: Op,
  argEnums: ArgEnumValue[],
  typePrefix: string = '',
): { name: string; inputTypes: string[]; returnTypes: string[]; str: string[] }[] => {
  return argEnums
    .map((argEnum) => {
      const inputTypes = [
        ...op.immediate_args.filter((a) => a.arg_enum === null).map((i) => `${i.name.toLowerCase()}: ${getMappedType(i.immediate_type)}`),
        ...op.stack_inputs.map(
          (i) => `${i.name.toLowerCase()}: ${i.stack_type === 'any' ? getMappedType(argEnum.stack_type) : getMappedType(i.stack_type)}`,
        ),
      ]
      const input = inputTypes.join(', ')
      const returnTypes = op.stack_outputs.map((o) =>
        o.stack_type === 'any' ? getMappedOutputType(argEnum.stack_type) : getMappedOutputType(o.stack_type),
      )

      return (returnTypes.includes('any') ? ANY_TYPES : [''])
        .map((a) => {
          const returnTypeString: string = getReturnTypeString(returnTypes.map((o) => (o === 'any' ? a : o)))
          const typeName = camelCase(`${typePrefix}${RENAMED_OPCODES_MAP[argEnum.name ?? ''] ?? argEnum.name}${upperFirst(a)}`)
          const result = []
          if (argEnum.doc) {
            result.push(`/**`, ` * ${argEnum.doc}`, ` */`)
          }
          if (inputTypes.length) {
            result.push(`${typeName}: (${input}) => ${returnTypeString}`)
          } else {
            result.push(`get ${typeName}(): ${returnTypeString}`)
          }
          return {
            name: typeName,
            inputTypes,
            returnTypes,
            str: result,
          }
        })
        .flat()
    })
    .flat()
}

const enumOps: { [key: string]: string[] } = Object.assign(
  {},
  ...Object.keys(OPCODES_WITH_ENUM_MAP)
    .map((key) => ({ op: (langSpec as LangSpec).ops[key], argEnum: (langSpec as LangSpec).arg_enums[OPCODES_WITH_ENUM_MAP[key]] }))
    .map((pair) => {
      const name = upperFirst(camelCase(pair.op.name))
      return {
        [name]: [
          ...getOpDocs(pair.op),
          `export type ${name}Type = {`,
          ...getEnumOpType(pair.op, pair.argEnum)
            .sort(compareNamesAsc)
            .map((s) => s.str)
            .flat()
            .map((s) => `  ${s}`),
          `}`,
        ],
      }
    }),
)

const groupedOps: { [key: string]: string[] } = Object.assign(
  {},
  ...GROUPED_OPCODES.map((g) => ({
    [g.name]: [
      `export type ${g.name}Type = {`,
      ...Object.keys(g.ops)
        .map((key) => (langSpec as LangSpec).ops[key])
        .map((op) =>
          g.ops[op.name].endsWith('*') // if needs expanding, e.g. 'set*'
            ? getEnumOpType(op, (langSpec as LangSpec).arg_enums[op.name], g.ops[op.name])
                .sort(compareNamesAsc)
                .map((s) => s.str)
                .flat() // expand it
            : getOpType(op, g.ops, false)
                .sort(compareNamesAsc)
                .map((opType) => [...getOpDocs(op), opType.str])
                .flat(),
        )
        .flat()
        .map((s) => `  ${s}`),
      `}`,
    ],
  })),
)

const mergedOps: { [key: string]: string[] } = Object.assign(
  {},
  ...MERGED_OPCODES.map((m) => ({
    [m.name]: [
      `export type ${m.name}Type = {`,
      ...Object.keys(m.ops)
        .map((key) => (langSpec as LangSpec).ops[key])
        .map((op) => getEnumOpType(op, (langSpec as LangSpec).arg_enums[m.ops[op.name]]))
        .flat()
        .filter(
          (s, i, arr) =>
            // does not exist another version of the function with more args or more output values
            !arr.some(
              (x) => x.name === s.name && (x.inputTypes.length > s.inputTypes.length || x.returnTypes.length > s.returnTypes.length),
            ),
        )
        .sort(compareNamesAsc)
        .map((s) => s.str)
        .flat()
        .map((s) => `  ${s}`),
      `}`,
    ],
  })),
)

const objectTypes = Object.fromEntries(
  Object.entries({
    ...groupedOps,
    ...mergedOps,
    ...enumOps,
  }).sort(([a], [b]) => (a > b ? 1 : -1)),
)

const opsImplementation = [
  `export type OpsImplementation = {`,
  ...Object.keys(opFunctions).map((k) => `  ${camelCase(k).replace('Type', '')}: ${k}`),
  ...Object.keys(objectTypes).map((k) => `  ${camelCase(k)}: ${k}Type`),
  `}`,
]

const fullFilePathName = `${__dirname}/../src/op-types.ts`

fs.writeFileSync(fullFilePathName, `import { bytes, BytesCompat, uint64, Uint64Compat } from './primitives'` + '\n')
fs.appendFileSync(fullFilePathName, `import { Account, Application, Asset } from './reference'` + '\n\n')
fs.appendFileSync(
  fullFilePathName,
  `${Object.values(enums)
    .map((e) => `${e}\n`)
    .join('\n')}\n`,
)
fs.appendFileSync(
  fullFilePathName,
  `${Object.values(opFunctions)
    .map((o) => `${o.join('\n')}\n`)
    .join('\n')}\n`,
)
fs.appendFileSync(
  fullFilePathName,
  `${Object.values(objectTypes)
    .map((o) => `${o.join('\n')}\n`)
    .join('\n')}\n`,
)
fs.appendFileSync(fullFilePathName, `${opsImplementation.join('\n')}\n`)
