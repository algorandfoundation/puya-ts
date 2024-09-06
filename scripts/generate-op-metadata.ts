import * as fs from 'fs'
import { camelCase } from 'change-case'
import type { OpFunction, OpGrouping, OpOverloadedFunction } from './build-op-module'
import { AlgoTsType, buildOpModule } from './build-op-module'
import { enumerate, hasFlags } from '../src/util'
import { it } from 'vitest'

const opModule = buildOpModule()

function* emitHeader() {
  yield `
/* THIS FILE IS GENERATED BY ~/scripts/generate-op-metadata.ts - DO NOT MODIFY DIRECTLY */
import * as ptypes from './ptypes'
import { Expression } from '../awst/nodes'

export type ImmediateArgMapping = {
  name: string
  ptypes: ptypes.PType[]
}


export type StackArg = {
  name: string
  ptypes: ptypes.PType[]
}

export type Signature = {
  argNames: string[]
  immediateArgs: Array<ImmediateArgMapping | bigint | string>
  stackArgs: Array<StackArg | Expression>
  returnType: ptypes.PType
}

export type IntrinsicOpMapping = {
  type: 'op-mapping'
  op: string
  signatures: Signature[]
}
export type IntrinsicOpGrouping = {
  type: 'op-grouping'
  name: string
  ops: Record<string, IntrinsicOpMapping>
}
`
}

function* algoTsToPType(t: AlgoTsType) {
  if (hasFlags(t, AlgoTsType.Enum)) {
    for (const enumDef of opModule.enums) {
      if (hasFlags(t, enumDef.typeFlag)) {
        yield `ptypes.${camelCase(enumDef.tsName)}PType`
        t ^= enumDef.typeFlag ^ AlgoTsType.Enum
      }
    }
    t ^= AlgoTsType.Enum
  }
  if (hasFlags(t, AlgoTsType.Asset)) {
    t ^= AlgoTsType.Asset
    yield 'ptypes.assetPType'
  }
  if (hasFlags(t, AlgoTsType.Account)) {
    t ^= AlgoTsType.Account
    yield 'ptypes.accountPType'
  }
  if (hasFlags(t, AlgoTsType.Application)) {
    t ^= AlgoTsType.Application
    yield 'ptypes.applicationPType'
  }
  if (hasFlags(t, AlgoTsType.Uint64)) {
    t ^= AlgoTsType.Uint64
    yield 'ptypes.uint64PType'
  }
  if (hasFlags(t, AlgoTsType.BigUint)) {
    t ^= AlgoTsType.BigUint
    yield 'ptypes.biguintPType'
  }
  if (hasFlags(t, AlgoTsType.Boolean)) {
    t ^= AlgoTsType.Boolean
    yield 'ptypes.boolPType'
  }
  if (hasFlags(t, AlgoTsType.Void)) {
    t ^= AlgoTsType.Void
    yield 'ptypes.voidPType'
  }
  if (hasFlags(t, AlgoTsType.Bytes)) {
    t ^= AlgoTsType.Bytes
    yield 'ptypes.bytesPType'
  }
  if (Number(t) !== 0) throw new Error(`Unhandled flags ${t}`)
}

function* algoTsToLiteralPType(t: AlgoTsType) {
  if (hasFlags(t, AlgoTsType.Enum)) {
    for (const enumDef of opModule.enums) {
      if (hasFlags(t, enumDef.typeFlag)) {
        yield `ptypes.${camelCase(enumDef.tsName)}PType`
        t ^= enumDef.typeFlag ^ AlgoTsType.Enum
      }
    }
    t ^= AlgoTsType.Enum
  }
  if (hasFlags(t, AlgoTsType.Uint64)) {
    t ^= AlgoTsType.Uint64
    yield 'ptypes.uint64PType'
  }
  if (Number(t) !== 0) throw new Error(`Unhandled flags ${t}`)
}

function mapReturnType(returnTypes: AlgoTsType[]) {
  if (returnTypes.length === 0) {
    return 'ptypes.voidPType'
  }
  const ptypes = returnTypes.map((t) => {
    const mapped = Array.from(algoTsToPType(t))
    if (mapped.length === 1) {
      return mapped[0]
    }
    throw new Error(`Cannot have union return types: ${ptypes.join(' | ')}`)
  })
  if (ptypes.length === 1) {
    return ptypes[0]
  }
  return `new ptypes.TuplePType({items: [${ptypes.join(', ')}], immutable: true})`
}

function* emitTypes() {
  function* emitOpMapping(op: OpFunction) {
    yield `'${op.name}': `
    yield `{`
    yield `type: 'op-mapping',`
    yield `op: '${op.opCode}',`
    yield `signatures: [{`
    yield `argNames: [`
    for (const [index, arg] of enumerate(op.immediateArgs)) {
      if (index === op.enumArg?.pos) continue
      yield `'${arg.name}',`
    }
    yield op.stackArgs.map((a) => `'${a.name}'`).join(', ')
    yield '],'
    yield 'immediateArgs: ['
    for (const [index, ia] of enumerate(op.immediateArgs)) {
      if (op.enumArg?.pos === index) {
        yield `'${op.enumArg.member}',`
      } else {
        yield `{ name: '${ia.name}', ptypes: [${Array.from(algoTsToLiteralPType(ia.type)).join(', ')}] },`
      }
    }
    yield '],'
    yield 'stackArgs: ['
    for (const sa of op.stackArgs) {
      yield `{ name: '${sa.name}', ptypes: [${Array.from(algoTsToPType(sa.type)).join(', ')}] },`
    }
    yield '],'
    yield `returnType: ${mapReturnType(op.returnTypes)},`
    yield `}]`
    yield '},'
  }
  function* emitOpOverloadedMapping(op: OpOverloadedFunction) {
    yield `'${op.name}': `
    yield `{`
    yield `type: 'op-mapping',`
    yield `op: '${op.opCode}',`
    yield `signatures: [`
    for (const signature of op.signatures) {
      yield '{'
      yield `argNames: [`
      for (const arg of signature.immediateArgs) {
        yield `'${arg.name}',`
      }
      yield signature.stackArgs.map((a) => `'${a.name}'`).join(', ')
      yield '],'
      yield 'immediateArgs: ['
      for (const ia of signature.immediateArgs) {
        yield `{ name: '${ia.name}', ptypes: [${Array.from(algoTsToLiteralPType(ia.type)).join(', ')}] },`
      }
      yield '],'
      yield 'stackArgs: ['
      for (const sa of signature.stackArgs) {
        yield `{ name: '${sa.name}', ptypes: [${Array.from(algoTsToPType(sa.type)).join(', ')}] },`
      }
      yield '],'
      yield `returnType: ${mapReturnType(signature.returnTypes)},`
      yield '},'
    }
    yield `]`
    yield '},'
  }

  function* emitOpGrouping(group: OpGrouping) {
    yield `${group.name}: `
    yield `{`
    yield `type: 'op-grouping',`
    yield `name: '${group.name}',`
    yield `ops: {`

    for (const op of Object.values(group.functions)) {
      yield* emitOpMapping(op)
    }

    yield `}`
    yield '},'
  }

  yield* emitHeader()
  yield `export const OP_METADATA: Record<string, IntrinsicOpMapping | IntrinsicOpGrouping> = {\n`
  for (const item of opModule.items) {
    if (item.type === 'op-function') {
      yield* emitOpMapping(item)
    } else if (item.type === 'op-overloaded-function') {
      yield* emitOpOverloadedMapping(item)
    } else {
      yield* emitOpGrouping(item)
    }
  }
  yield `\n}`
}
const fullFilePathName = process.argv[2]

fs.writeFileSync(fullFilePathName, Array.from(emitTypes()).join(''))
