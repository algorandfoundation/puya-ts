import type { Arc56Contract, Arc56Method, StructField } from '@algorandfoundation/algokit-utils/abi'
import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import type ts from 'typescript'
import { ContractReference, OnCompletionAction } from './awst/models'
import type { AWST } from './awst/nodes'
import { validateAwst } from './awst/validation'
import { buildAwst } from './awst_build'
import { ContractClassModel, type CompilationSet } from './awst_build/models/contract-class-model'
import { registerPTypes } from './awst_build/ptypes/register'
import { typeRegistry } from './awst_build/type-registry'
import { appVersion } from './cli/app-version'
import { CodeError, InternalError } from './errors'
import { logger, LoggingContext } from './logger'
import type { AlgoFile, CompileOptions } from './options'
import { createTsProgram } from './parser'
import { puyaCompile } from './puya'
import type { PuyaService } from './puya/puya-service'
import { AbsolutePath } from './util/absolute-path'

export type CompileResult = {
  programDirectory: AbsolutePath
  awst?: AWST[]
  ast?: Record<string, ts.SourceFile>
  compilationSet?: CompilationSet
}

export async function compile(options: CompileOptions, puyaService?: PuyaService): Promise<CompileResult> {
  const loggerCtx = LoggingContext.current
  if (options.treatWarningsAsErrors) loggerCtx.treatWarningsAsErrors = true

  registerPTypes(typeRegistry)
  logger.info(undefined, appVersion({ withAVMVersion: false }))
  const programResult = createTsProgram(options)
  if (loggerCtx.hasErrors()) {
    logger.info(undefined, 'Compilation halted due to parse errors')
    return {
      programDirectory: programResult.programDirectory,
      ast: programResult.sourceFiles,
    }
  }
  const { moduleAwst, compilationSet } = buildAwst(programResult, options)
  validateAwst(moduleAwst)

  if (loggerCtx.hasErrors()) {
    logger.info(undefined, 'Compilation halted due to errors')
    return {
      programDirectory: programResult.programDirectory,
      awst: moduleAwst,
      ast: programResult.sourceFiles,
      compilationSet,
    }
  }
  if (!options.dryRun) {
    await puyaCompile({
      options,
      moduleAwst,
      programDirectory: programResult.programDirectory,
      compilationSet,
      sourceFiles: programResult.sourceFiles,
      puyaService,
    })
  }

  if (options.outputClient) {
    const clientFiles = resolveClientFiles(compilationSet, options.filePaths)
    await writeARC4Clients(options.templateVarsPrefix, clientFiles)
  }

  return {
    programDirectory: programResult.programDirectory,
    awst: moduleAwst,
    ast: programResult.sourceFiles,
    compilationSet,
  }
}

type ClientFile = {
  sourceFile: AbsolutePath
  outFile: AbsolutePath
}

function resolveClientFiles(compilationSet: CompilationSet, filePaths: AlgoFile[]): ClientFile[] {
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

    arc56Files.push({
      sourceFile: outDir.join(`${ref.className}.arc56.json`),
      outFile: outDir.join(`${ref.className}.client.ts`),
    })
  }
  return arc56Files
}

function writeARC4Clients(templateVarsPrefix: string, clientFiles: ClientFile[]) {
  return Promise.all(clientFiles.map((clientFile) => writeARC4Client(clientFile.sourceFile, clientFile.outFile, templateVarsPrefix)))
}

async function writeARC4Client(sourceFile: AbsolutePath, outFile: AbsolutePath, templateVarsPrefix: string) {
  const spec: Arc56Contract = JSON.parse(await readFile(sourceFile.toString(), { encoding: 'utf-8' }))

  if (await shouldWriteFile(outFile)) {
    logger.info(undefined, `Writing ${outFile.relativeTo('.')}`)
    const typescriptClient = generateClientFor(spec)
    await writeFile(outFile.toString(), typescriptClient, { encoding: 'utf-8' })
  } else {
    logger.error(undefined, `Not outputting ${outFile.relativeTo('.')} since content does not appear to be auto-generated`)
  }
}

const AUTO_GENERATED_COMMENT = '// This file is auto-generated, do not modify'

async function shouldWriteFile(outFile: AbsolutePath): Promise<boolean> {
  const filePath = outFile.toString()
  // FIXME: There's a TOCTOU bug here...
  if (!existsSync(filePath)) {
    return true
  }
  const contents = await readFile(filePath, { encoding: 'utf-8' })
  return contents.startsWith(AUTO_GENERATED_COMMENT)
}

function generateClientFor(contract: Arc56Contract): string {
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

  const UINT_REGEX = /^uint(?<n>[0-9]+)$/
  const UFIXED_REGEX = /^ufixed(?<n>[0-9]+)x(?<m>[0-9]+)$/
  const FIXED_ARRAY_REGEX = /^(?<type>.+)\[(?<size>[0-9]+)]$/
  const DYNAMIC_ARRAY_REGEX = /^(?<type>.+)\[]$/
  const _TUPLE_REGEX = /^\((?<types>.+)\)$/
  const ARC4_PYTYPE_MAPPING = new Map<string, [string, string | undefined]>([
    // [arc4, [codeToAdd, elementToImport]]
    ['bool', ['arc4.Bool', 'arc4']],
    ['string', ['arc4.Str', 'arc4']],
    ['account', ['Account', 'Account']],
    ['application', ['Application', 'Application']],
    ['asset', ['Asset', 'Asset']],
    ['void', ['void', undefined]],
    ['txn', ['gtxn.Transaction', 'gtxn']],
    ['pay', ['gtxn.PaymentTxn', 'gtxn']],
    ['keyreg', ['gtxn.KeyRegistrationTxn', 'gtxn']],
    ['acfg', ['gtxn.AssetConfigTxn', 'gtxn']],
    ['axfer', ['gtxn.AssetTransferTxn', 'gtxn']],
    ['afrz', ['gtxn.AssetFreezeTxn', 'gtxn']],
    ['appl', ['gtxn.ApplicationCallTxn', 'gtxn']],
    ['address', ['arc4.Address', 'arc4']],
    ['byte', ['arc4.Byte', 'arc4']],
    ['byte[]', ['arc4.DynamicBytes', 'arc4']],
  ])

  /**
   * Splits inner tuple types into individual elements.
   *
   * e.g. "uint64,(uint8,string),bool" becomes ["uint64", "(uint8,string)", "bool"]
   */
  function* splitTupleTypes(types: string): Iterable<string> {
    let tupleLevel = 0
    let lastIdx = 0
    for (let idx = 0; idx < types.length; idx++) {
      const tok = types[idx]
      if (tok === '(') {
        tupleLevel++
      } else if (tok === ')') {
        tupleLevel--
      } else if (tok === ',' && tupleLevel === 0) {
        yield types.slice(lastIdx, idx)
        lastIdx = idx + 1
      }
    }
    yield types.slice(lastIdx)
  }

  function ARC4ToAlgoTSName(type: string): string {
    const knownMapping = ARC4_PYTYPE_MAPPING.get(type)
    if (knownMapping !== undefined) {
      const [type, importElement] = knownMapping
      if (importElement !== undefined) {
        imports.add(`type ${importElement}`)
      }
      return type
    }

    imports.add('type arc4')
    const uint = UINT_REGEX.exec(type)
    if (uint !== null) {
      const n = Number.parseInt(uint.groups!.n)
      return `arc4.Uint<${n}>`
    }
    const ufixed = UFIXED_REGEX.exec(type)
    if (ufixed !== null) {
      const n = Number.parseInt(ufixed.groups!.n)
      const m = Number.parseInt(ufixed.groups!.m)
      return `arc4.UFixed<${n}, ${m}>`
    }
    const fixedArray = FIXED_ARRAY_REGEX.exec(type)
    if (fixedArray !== null) {
      const arrayType = fixedArray.groups!.type
      const sizeString = fixedArray.groups!.size
      const size = Number.parseInt(sizeString)
      const elementType = ARC4ToAlgoTSName(arrayType)
      return `arc4.StaticArray<${elementType}, ${size}>`
    }
    const dynamicArray = DYNAMIC_ARRAY_REGEX.exec(type)
    if (dynamicArray !== null) {
      const arrayType = dynamicArray.groups!.type
      const elementType = ARC4ToAlgoTSName(arrayType)
      return `arc4.DynamicArray<${elementType}>`
    }
    const tupleMatch = _TUPLE_REGEX.exec(type)
    if (tupleMatch !== null) {
      const tupleTypes = [...splitTupleTypes(tupleMatch.groups!.types)].map(ARC4ToAlgoTSName)
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
      return ARC4ToAlgoTSName(type)
    }
  }

  function prepareStructClass(name: string, fields: StructField[]) {
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

  function ARC4MethodToTSDecorator(name: string, method: Arc56Method): string {
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

    if (uniqueActions.size === 1 && uniqueActions.has('NoOp')) {
      abimethodArgs.push(`allowActions: [${actions.map((v) => `'${v}'`).join(', ')}]`)
    }
    if (method.actions.create.length !== 0 && method.actions.call.length !== 0) {
      abimethodArgs.push("onCreate: 'allow'")
    } else if (method.actions.create) {
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

  type Arc56Arg = Arc56Method['args'] extends (infer Content)[] ? Content : never

  function genArg(arg: Arc56Arg): string {
    const argType = getClientType(arg.struct || arg.type)
    return `${arg.name}: ${argType},`
  }

  function genMethod(method: Arc56Method): string {
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
