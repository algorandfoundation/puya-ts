import { Contract } from '@algorandfoundation/algo-ts'

export interface AbiMetadata {
  methodName: string
  methodSelector: string
  argTypes: string[]
  returnType: string
}
const AbiMetaSymbol = Symbol('AbiMetadata')
export const attachAbiMetadata = (contract: { new (): Contract }, methodName: string, metadata: AbiMetadata): void => {
  console.log(JSON.stringify(metadata))
  const metadatas: Record<string, AbiMetadata> = (AbiMetaSymbol in contract ? contract[AbiMetaSymbol] : {}) as Record<string, AbiMetadata>

  metadatas[methodName] = metadata
}
