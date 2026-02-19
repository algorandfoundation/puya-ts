import * as abi from '@algorandfoundation/algokit-utils/abi'
import { existsSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import { ContractReference, OnCompletionAction } from './awst/models'
import type { CompilationSet } from './awst_build/models/contract-class-model'
import { ContractClassModel } from './awst_build/models/contract-class-model'
import type { ABICompatiblePType } from './awst_build/ptypes'
import * as ptype from './awst_build/ptypes'
import { Constants } from './constants'
import { CodeError, InternalError } from './errors'
import { logger } from './logger'
import type { AlgoFile } from './options'
import { AbsolutePath } from './util/absolute-path'

type Arc56Arg = abi.Arc56Method['args'][number]

type ClientFile = {
  sourceFile: AbsolutePath
  outFile: AbsolutePath
}

const AUTO_GENERATED_COMMENT = '// This file is auto-generated, do not modify'

const ARC4_PYTYPE_MAPPING = new Map<string, ABICompatiblePType>([
  ['account', ptype.accountPType],
  ['application', ptype.applicationPType],
  ['asset', ptype.assetPType],
  ['void', ptype.voidPType],
  ['txn', ptype.anyGtxnType],
  ['pay', ptype.paymentGtxnType],
  ['keyreg', ptype.keyRegistrationGtxnType],
  ['acfg', ptype.assetConfigGtxnType],
  ['axfer', ptype.assetTransferGtxnType],
  ['afrz', ptype.assetFreezeGtxnType],
  ['appl', ptype.applicationCallGtxnType],
])

export function resolveClientFiles(compilationSet: CompilationSet, filePaths: AlgoFile[]): ClientFile[] {
  const sourceFileToOutDir = new Map<string, AbsolutePath>()
  for (const { sourceFile, outDir } of filePaths) {
    sourceFileToOutDir.set(sourceFile.toString(), outDir)
  }

  const arc56Files = []
  for (const ref of compilationSet.compilationOutputSet) {
    if (!(ref instanceof ContractReference)) {
      continue
    }
    const model = compilationSet.get(ref)
    if (!(model instanceof ContractClassModel)) {
      continue
    }
    if (!model.type.isARC4) {
      continue
    }

    const sourceFile = AbsolutePath.resolve({ path: ref.moduleName })
    const outDir = sourceFileToOutDir.get(sourceFile.toString())
    if (outDir === undefined) {
      throw new InternalError(`Could not find a source file for the contract ${ref.className} at ${ref.moduleName}`)
    }

    const name = model.options?.name || model.name
    arc56Files.push({
      sourceFile: outDir.join(`${name}.arc56.json`),
      outFile: outDir.join(`${name}.client.ts`),
    })
  }
  return arc56Files
}

export function writeARC4Clients(compilationSet: CompilationSet, filePaths: AlgoFile[]) {
  const clientFiles = resolveClientFiles(compilationSet, filePaths)
  return Promise.all(
    clientFiles.map(async (clientFile) => {
      const spec = JSON.parse(await readFile(clientFile.sourceFile.toString(), { encoding: 'utf-8' }))
      await writeARC4Client(spec, clientFile.outFile)
    }),
  )
}

export async function writeARC4Client(spec: abi.Arc56Contract, outFile: AbsolutePath) {
  if (await shouldWriteFile(outFile)) {
    logger.info(undefined, `Writing ${outFile.relativeTo('.')}`)
    const typescriptClient = generateClientFor(spec)
    await writeFile(outFile.toString(), typescriptClient, { encoding: 'utf-8' })
  } else {
    logger.error(undefined, `Not outputting ${outFile.relativeTo('.')} since content does not appear to be auto-generated`)
  }
}

async function shouldWriteFile(outFile: AbsolutePath): Promise<boolean> {
  const filePath = outFile.toString()
  // FIXME: There's a TOCTOU bug here...
  if (!existsSync(filePath)) {
    return true
  }
  const contents = await readFile(filePath, { encoding: 'utf-8' })
  return contents.startsWith(AUTO_GENERATED_COMMENT)
}

function generateClientFor(contract: abi.Arc56Contract): string {
  const imports = new Set<string>(['Contract'])
  const structToClass = new Map<string, string>()
  const reservedClassNames = new Set<string>()
  const reservedMethodNames = new Set<string>()
  const classDecls: string[] = []

  function indent(...texts: string[]): string {
    const INDENT = '  '
    return INDENT + texts.join('\n').replaceAll(/\n+/g, `$&${INDENT}`)
  }

  function classNameFor(name: string): string {
    const base_name = name
    let seq = 1
    while (reservedClassNames.has(name)) {
      seq++
      name = `${base_name}${seq}`
    }

    reservedClassNames.add(name)
    return name
  }

  function methodNameFor(name: string): string {
    const base_name = name
    let seq = 1
    while (reservedMethodNames.has(name)) {
      seq++
      name = `${base_name}${seq}`
    }

    reservedMethodNames.add(name)
    return name
  }

  function typeNameToAlgoTSName(typeName: string): string {
    const knownMapping = ARC4_PYTYPE_MAPPING.get(typeName)
    if (knownMapping !== undefined) {
      const { name, module } = knownMapping
      if (module === Constants.moduleNames.algoTs.gtxn) {
        imports.add('type gtxn')
        return `gtxn.${name}`
      } else if (module === Constants.moduleNames.algoTs.reference) {
        imports.add(`type ${name}`)
        return name
      } else if (module === 'lib.d.ts') {
        // The TypeScript prelude is always imported
        return name
      }

      throw new InternalError(`Cannot import ${name}: The module ${module} is unsupported`)
    }
    return ARC4ToAlgoTSName(abi.ABIType.from(typeName))
  }

  function ARC4ToAlgoTSName(type: abi.ABIType): string {
    imports.add('type arc4')
    if (type instanceof abi.ABIBoolType) return 'arc4.Bool'
    if (type instanceof abi.ABIStringType) return 'arc4.Str'
    if (type instanceof abi.ABIAddressType) return 'arc4.Address'
    if (type instanceof abi.ABIByteType) return 'arc4.Byte'
    if (type instanceof abi.ABIUintType) return `arc4.Uint<${type.bitSize}>`
    if (type instanceof abi.ABIUfixedType) return `arc4.UFixed<${type.bitSize}, ${type.precision}>`
    if (type instanceof abi.ABIArrayStaticType) {
      const elementType = ARC4ToAlgoTSName(type.childType)
      return `arc4.StaticArray<${elementType}, ${type.length}>`
    }
    if (type instanceof abi.ABIArrayDynamicType) {
      if (type.childType instanceof abi.ABIByteType) return 'arc4.DynamicBytes'

      const elementType = ARC4ToAlgoTSName(type.childType)
      return `arc4.DynamicArray<${elementType}>`
    }
    if (type instanceof abi.ABITupleType) {
      const tupleTypes = type.childTypes.map(ARC4ToAlgoTSName)
      return `arc4.Tuple<readonly [${tupleTypes.join(', ')}]>`
    }
    throw new CodeError(`unknown ARC-4 type '${type}'`)
  }

  function getClientType(type: string): string {
    // map ABI / AVM type to algots type
    if (type === 'AVMUint64') {
      imports.add('type uint64')
      return 'uint64'
    } else if (type === 'AVMBytes') {
      imports.add('type bytes')
      return 'bytes'
    } else if (type in contract.structs) {
      return structToClass.get(type) || prepareStructClass(type, contract.structs[type])
    } else {
      return typeNameToAlgoTSName(type)
    }
  }

  function prepareStructClass(name: string, fields: abi.StructField[]) {
    imports.add('arc4')

    const className = classNameFor(name)
    structToClass.set(name, className)
    const lines = ['', `export class ${className} extends arc4.Struct<{`]
    for (const field of fields) {
      let type: string
      if (typeof field.type === 'string') {
        type = getClientType(field.type)
      } else {
        // generate anonymous struct type
        const anonStruct = `${name}_${field.name}`
        type = prepareStructClass(anonStruct, field.type)
      }
      lines.push(indent(`${field.name}: ${type}`))
    }
    lines.push('}> {}')
    classDecls.push(...lines)
    return className
  }

  function tsdoc(description: string | undefined): string[] {
    if (description === undefined) {
      return []
    }
    return ['/**', ` * ${description.replaceAll(/\n+/g, '$& * ')}`, ' */']
  }

  function compatibleActions(create: string[], call: string[]): boolean {
    if (create.length === 0) {
      return true
    }
    if (call.length === 0) {
      return true
    }
    // if both collections are present, then they are compatible if everything in
    // create is also in call
    const createSet = new Set(create)
    const callSet = new Set(call)
    return createSet.symmetricDifference(callSet).size === 0
  }

  function ARC4MethodToTSDecorator(name: string, method: abi.Arc56Method): string {
    imports.add('abimethod')

    const abimethodArgs: string[] = []
    if (method.name !== name) {
      abimethodArgs.push(`name: '${method.name}'`)
    }
    if (method.readonly) {
      abimethodArgs.push('readonly: true')
    }
    // if any alias types are encountered, force index encoding
    const argTypes = new Set(method.args.map((v) => v.type))
    const aliasTypes = new Set(['asset', 'application', 'account'])
    if (argTypes.intersection(aliasTypes).size !== 0) {
      abimethodArgs.push("resourceEncoding: 'index'")
    }
    if (!compatibleActions(method.actions.create, method.actions.call)) {
      // TODO: support this, once decorators support it
      throw new CodeError(`unsupported on completion combination for generating an ARC-4 client for method: ${method.name}`)
    }
    const actions = [...method.actions.create, ...method.actions.call]
    actions.sort((a, b) => OnCompletionAction[a] - OnCompletionAction[b])
    const uniqueActions = new Set(actions)

    if (!(uniqueActions.size === 1 && uniqueActions.has('NoOp'))) {
      abimethodArgs.push(`allowActions: [${actions.map((v) => `'${v}'`).join(', ')}]`)
    }
    if (method.actions.create.length !== 0 && method.actions.call.length !== 0) {
      abimethodArgs.push("onCreate: 'allow'")
    } else if (method.actions.create.length !== 0) {
      abimethodArgs.push("onCreate: 'require'")
    } else {
      // disallow is default
    }
    let decorator = '@abimethod'
    if (abimethodArgs.length !== 0) {
      decorator += `({ ${abimethodArgs.join(', ')} })`
    }
    return decorator
  }

  function genArg(arg: Arc56Arg): string {
    const argType = getClientType(arg.struct || arg.type)
    return `${arg.name}: ${argType},`
  }

  function genMethod(method: abi.Arc56Method): string {
    imports.add('err')

    const return_type = getClientType(method.returns.struct || method.returns.type)
    const method_name = methodNameFor(method.name)
    const args = method.args.map(genArg)
    let arglist: string
    if (args.length === 0) {
      // No args -> inline arglist
      arglist = '()'
    } else if (args.length === 1) {
      // One arg -> inline arglist (remove trailing comma)
      arglist = `(${args[0].slice(0, -1)})`
    } else {
      // At least two args -> multiline arglist
      arglist = `(\n${indent(...args)}\n)`
    }

    return indent(
      ...tsdoc(method.desc),
      ARC4MethodToTSDecorator(method_name, method),
      `${method_name}${arglist}: ${return_type} {`,
      indent("err('stub only')"),
      '}',
    )
  }

  function genMethods(): string[] {
    const methods = []
    if (contract.methods.length !== 0) {
      methods.push(genMethod(contract.methods[0]))
    }
    for (const method of contract.methods.slice(1)) {
      methods.push(`\n${genMethod(method)}`)
    }
    return methods
  }

  // generate class definitions for any referenced structs in methods
  // don't generate from self.contract.structs as it may contain other struct definitions
  const clientClass = classNameFor(contract.name)
  const docs = tsdoc(contract.desc)
  const methods = genMethods()

  // If it uses arc4 as a value we don't need the type import!
  if (imports.has('arc4')) {
    imports.delete('type arc4')
  }

  const sortedImports = [...imports].toSorted().join(', ')
  return [
    AUTO_GENERATED_COMMENT,
    `import { ${sortedImports} } from '@algorandfoundation/algorand-typescript'`,
    ...classDecls,
    '',
    ...docs,
    `export abstract class ${clientClass} extends Contract {`,
    ...methods,
    '}',
    '',
  ].join('\n')
}
