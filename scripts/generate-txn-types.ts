import { camelCase } from 'change-case'
import { TxnField } from '../src/awst/txn-fields'
import type { PType } from '../src/awst_build/ptypes'
import type { TxnFieldMetaData, TxnFieldsMetaData } from '../src/awst_build/txn-fields'
import {
  applicationCallTxnFields,
  assetConfigTxnFields,
  assetFreezeTxnFields,
  assetTransferTxnFields,
  keyRegistrationTxnFields,
  paymentTxnFields,
} from '../src/awst_build/txn-fields'

const txnTypes: Record<string, TxnFieldsMetaData> = {
  Payment: paymentTxnFields,
  KeyRegistration: keyRegistrationTxnFields,
  AssetConfig: assetConfigTxnFields,
  AssetTransfer: assetTransferTxnFields,
  AssetFreeze: assetFreezeTxnFields,
  ApplicationCall: applicationCallTxnFields,
}

function txnTypeName(type: string) {
  switch (type) {
    case 'Payment':
      return 'pay'
    case 'KeyRegistration':
      return 'keyreg'
    case 'AssetConfig':
      return 'acfg'
    case 'AssetTransfer':
      return 'axfer'
    case 'AssetFreeze':
      return 'afrz'
    case 'ApplicationCall':
      return 'appl'
    default:
      throw new Error(`Invalid type ${type}`)
  }
}

export function* emitGTxnTypes() {
  yield '/* THIS FILE IS GENERATED BY ~/scripts/generate-txn-types.ts - DO NOT MODIFY DIRECTLY */\n'
  yield `import { OnCompleteAction } from './on-complete-action';`
  yield `import { bytes, uint64 } from './primitives';`
  yield `import { Account, Application, Asset } from './reference';`
  yield `import { TransactionType } from './transactions';`
  yield `import { NoImplementation } from "./internal/errors";`
  yield ''
  yield `const isGtxn = Symbol('isGtxn');`
  yield ''
  for (const [txnType, fields] of Object.entries(txnTypes)) {
    yield* emitComment(`A group transaction of type '${txnTypeName(txnType)}'`)
    yield `export interface ${txnType}Txn {`
    yield '\n  /** @hidden */'
    yield '\n  [isGtxn]?: true;'
    for (const [fieldName, fieldMetadata] of Object.entries(fields)) {
      yield* emitTxnField(txnType, fieldName, fieldMetadata)
    }
    yield '}'
  }

  yield* emitComment('A group transaction of any type')
  yield `export type Transaction = ${Object.keys(txnTypes)
    .map((t) => `${t}Txn`)
    .join(' | ')}`

  yield* emitComment(['Get the nth transaction in the group without verifying its type', '@param n The index of the txn in the group'])
  yield `export function Transaction(n: uint64): Transaction {`
  yield 'throw new NoImplementation()'
  yield '}'
  for (const txnType of Object.keys(txnTypes)) {
    yield* emitComment([
      'Get the nth transaction in the group',
      `Verifies the txn type is '${txnTypeName(txnType)}'`,
      '@param n The index of the txn in the group',
    ])
    yield `export function ${txnType}Txn(n: uint64): ${txnType}Txn {`
    yield 'throw new NoImplementation()'
    yield '}'
  }
}

export function* emitITxnTypes() {
  yield '/* THIS FILE IS GENERATED BY ~/scripts/generate-txn-types.ts - DO NOT MODIFY DIRECTLY */\n'
  yield `import { OnCompleteAction } from './on-complete-action';`
  yield `import { bytes, NTuple, uint64 } from './primitives';`
  yield `import { Account, Application, Asset } from './reference';`
  yield `import { TransactionType } from './transactions';`
  yield `import { NoImplementation } from "./internal/errors";`
  yield ''
  yield `const isItxn = Symbol('isItxn');`
  yield '\n'

  for (const [txnType, fields] of Object.entries(txnTypes)) {
    yield* emitComment(`An inner transaction of type '${txnTypeName(txnType)}'`)

    yield `export interface ${txnType}InnerTxn {`
    yield '\n  /** @hidden */'
    yield '\n  [isItxn]?: true;'
    for (const [fieldName, fieldMetadata] of Object.entries(fields)) {
      yield* emitTxnField(txnType, fieldName, fieldMetadata)
    }
    yield '}'
  }
  for (const [txnType, fields] of Object.entries(txnTypes)) {
    yield `export interface ${txnType}Fields {`
    for (const [fieldName, fieldMetadata] of Object.entries(fields)) {
      yield* emitTxnInputField(fieldName, fieldMetadata)
    }
    yield '}'
  }

  yield* emitComment('A union of all ItxnParams types')
  yield `export type ItxnParams = ${Object.keys(txnTypes)
    .map((t) => `${t}ItxnParams`)
    .join(' | ')};`
  yield* emitComment('A union of all InnerTxn types')
  yield `export type InnerTxn = ${Object.keys(txnTypes)
    .map((t) => `${t}InnerTxn`)
    .join(' | ')};`

  yield* emitComment('Conditional type which returns the matching InnerTxn types for a given tuple of ItxnParams types')
  yield `export type TxnFor<TFields extends [...ItxnParams[]]> = TFields extends [{ submit(): infer TTxn }, ...infer TRest extends [...ItxnParams[]]]
  ? [TTxn, ...TxnFor<TRest>]
  : [];`

  yield* emitComment('Submit a group of ItxnParams objects and return the InnerTxn results')
  yield `export function submitGroup<TFields extends [...ItxnParams[]]>(...transactionFields: TFields): TxnFor<TFields>`
  yield* emitNoImplementation()

  yield* emitComment([
    'Submit all staged ItxnParams and return the last n InnerTxn results, where n is the numResults parameter',
    '@param numResults How many InnerTxn results to retrieve',
  ])
  yield `export function submitStaged<T extends number>(numResults: T): NTuple<InnerTxn, T>`
  yield* emitNoImplementation()

  for (const txnType of Object.keys(txnTypes)) {
    yield* emitComment(`Holds ${txnType} fields which can be updated, cloned, or submitted.`)
    yield `export abstract class ${txnType}ItxnParams {`
    yield* emitComment(`Submit an itxn with these fields and return the ${txnType}InnerTxn result`)
    yield `submit(): ${txnType}InnerTxn`
    yield* emitNoImplementation()
    yield* emitComment(`Update one or more fields in this ${txnType}ItxnParams object`)
    yield `set(fields: ${txnType}Fields): void`
    yield* emitNoImplementation()
    yield* emitComment(`Stage this itxn ready to be submitted in a group`)
    yield `stage(): void`
    yield* emitNoImplementation()
    yield* emitComment(`Return a copy of this ${txnType}ItxnParams object`)
    yield `copy(): ${txnType}ItxnParams`
    yield* emitNoImplementation()
    yield '}'
    yield* emitComment(`Create a new ${txnType}ItxnParams object with the specified fields`)
    yield `export function ${camelCase(txnType)}(fields: ${txnType}Fields): ${txnType}ItxnParams ;`
    yield* emitNoImplementation()
  }
}

function* emitNoImplementation() {
  yield '{'
  yield 'throw new NoImplementation()'
  yield '}'
}

function* emitComment(comment: string | string[]) {
  yield '\n/**'
  if (Array.isArray(comment)) {
    for (const line of comment) {
      yield `\n * ${line}`
    }
  } else {
    yield `\n * ${comment}`
  }
  yield '\n */\n'
}

function* emitTxnField(txnType: string, fieldName: string, field: TxnFieldMetaData) {
  yield* emitComment(field.comment)

  if (field.indexable) {
    yield `${fieldName}(index: uint64): ${field.ptype.name}`
  } else {
    yield `readonly ${fieldName}: ${field.ptype.name}${fieldName === 'type' ? `.${txnType}` : ''} `
  }
}
function* emitTxnInputField(fieldName: string, field: TxnFieldMetaData) {
  if (field.computed) return
  yield* emitComment(field.comment)

  const typeName = getInputTypeUnion(field.field, field.ptype)
  switch (fieldName) {
    case 'approvalProgramPages':
      yield 'approvalProgram?: '
      break
    case 'clearStateProgramPages':
      yield 'clearStateProgram?: '
      break
    default:
      yield `${fieldName}?: `
      break
  }

  if (fieldName === 'appArgs') {
    yield 'readonly [...unknown[]]'
    return
  }

  if (field.indexable) {
    if (field.arrayPromote) yield `${typeName} |`
    yield `readonly [...(${typeName})[]]`
  } else {
    yield typeName
  }
}

function getInputTypeUnion(field: TxnField, inputType: PType) {
  switch (inputType.name) {
    case 'Asset':
      return 'Asset | uint64'
    case 'Account':
      return 'Account | bytes'
    case 'Application':
      return 'Application | uint64'
    case 'bytes':
      switch (field) {
        case TxnField.ConfigAssetName:
        case TxnField.ConfigAssetUnitName:
        case TxnField.ConfigAssetURL:
        case TxnField.Note:
          // Accept bytes | string for fields that are commonly utf8 encoded
          return 'bytes | string'
      }
  }
  return inputType.name
}
