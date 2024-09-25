import { Contract } from '@algorandfoundation/algo-ts'
import { AbiMethodConfig, BareMethodConfig, CreateOptions, OnCompleteActionStr } from '@algorandfoundation/algo-ts/arc4'
import { DeliberateAny } from './typescript-helpers'

export interface AbiMetadata {
  methodName: string
  methodSelector: string
  argTypes: string[]
  returnType: string
  onCreate?: CreateOptions
  allowActions?: OnCompleteActionStr[]
}
const AbiMetaSymbol = Symbol('AbiMetadata')
export const attachAbiMetadata = (contract: { new (): Contract }, methodName: string, metadata: AbiMetadata): void => {
  const metadatas: Record<string, AbiMetadata> = (AbiMetaSymbol in contract ? contract[AbiMetaSymbol] : {}) as Record<string, AbiMetadata>
  metadatas[methodName] = metadata
  if (!(AbiMetaSymbol in contract)) {
    Object.defineProperty(contract, AbiMetaSymbol, {
      value: metadatas,
      writable: true,
      enumerable: false,
    })
  }
}

export const captureMethodConfig = <T extends Contract>(
  contract: T,
  methodName: string,
  config?: AbiMethodConfig<T> | BareMethodConfig,
): void => {
  const metadata = ensureMetadata(contract, methodName)
  metadata.onCreate = config?.onCreate ?? 'disallow'
  metadata.allowActions = ([] as OnCompleteActionStr[]).concat(config?.allowActions ?? 'NoOp')
}

const ensureMetadata = <T extends Contract>(contract: T, methodName: string): AbiMetadata => {
  if (!hasAbiMetadata(contract)) {
    const contractClass = contract.constructor as { new (): T }
    Object.getOwnPropertyNames(Object.getPrototypeOf(contract)).forEach((name) => {
      attachAbiMetadata(contractClass, name, { methodName: name, methodSelector: name, argTypes: [], returnType: '' })
    })
  }
  return getAbiMetadata(contract, methodName)
}

export const hasAbiMetadata = <T extends Contract>(contract: T): boolean => {
  const contractClass = contract.constructor as { new (): T }
  return (
    Object.getOwnPropertySymbols(contractClass).some((s) => s.toString() === AbiMetaSymbol.toString()) || AbiMetaSymbol in contractClass
  )
}

export const getAbiMetadata = <T extends Contract>(contract: T, methodName: string): AbiMetadata => {
  const contractClass = contract.constructor as { new (): T }
  const s = Object.getOwnPropertySymbols(contractClass).find((s) => s.toString() === AbiMetaSymbol.toString())
  const metadatas: Record<string, AbiMetadata> = (
    s ? (contractClass as DeliberateAny)[s] : AbiMetaSymbol in contractClass ? contractClass[AbiMetaSymbol] : {}
  ) as Record<string, AbiMetadata>
  return metadatas[methodName]
}
