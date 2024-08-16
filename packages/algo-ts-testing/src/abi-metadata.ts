import { Contract } from '@algorandfoundation/algo-ts'
import { AbiMethodConfig, BareMethodConfig, CreateOptions } from '@algorandfoundation/algo-ts/arc4'

export interface AbiMetadata {
  methodName: string
  methodSelector: string
  argTypes: string[]
  returnType: string
  onCreate?: CreateOptions
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
  const metadata = getAbiMetadata(contract, methodName)
  metadata.onCreate = config?.onCreate ?? 'disallow'
}

export const hasAbiMetadata = <T extends Contract>(contract: T): boolean => {
  const contractClass = contract.constructor as { new (): T }
  return AbiMetaSymbol in contractClass
}

export const getAbiMetadata = <T extends Contract>(contract: T, methodName: string): AbiMetadata => {
  const contractClass = contract.constructor as { new (): T }
  const metadatas: Record<string, AbiMetadata> = (AbiMetaSymbol in contractClass ? contractClass[AbiMetaSymbol] : {}) as Record<
    string,
    AbiMetadata
  >
  return metadatas[methodName]
}
