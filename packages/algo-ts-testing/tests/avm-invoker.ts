import * as algokit from '@algorandfoundation/algokit-utils'
import { ABIAppCallArg, ABIReturn } from '@algorandfoundation/algokit-utils/types/app'
import { ApplicationClient } from '@algorandfoundation/algokit-utils/types/app-client'
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import { nullLogger } from '@algorandfoundation/algokit-utils/types/logging'
import { ABIValue } from 'algosdk'
import { randomUUID } from 'crypto'

algokit.Config.configure({ logger: nullLogger })
const ARC4_PREFIX_LENGTH = 2

export const getAlgorandAppClient = async (appSpec: AppSpec): Promise<ApplicationClient> => {
  const client = algokit.AlgorandClient.defaultLocalNet()
  const defaultSigner = await client.account.kmd.getLocalNetDispenserAccount()
  const appClient = algokit.getAppClient({ app: appSpec, resolveBy: 'id', id: 0, sender: defaultSigner.account }, client.client.algod)
  await appClient.create({ note: randomUUID() })
  return appClient
}

const inovkeMethod = async (appClient: ApplicationClient, method: string, ...methodArgs: ABIAppCallArg[]): Promise<ABIReturn> => {
  const response = await appClient.call({ method, methodArgs, note: randomUUID() })
  if (!response.return) {
    throw new Error(`${method} did not return a value`)
  }
  if (response.return.decodeError) {
    throw response.return.decodeError
  }
  return response.return
}

export const getAvmResult = async <TResult extends ABIValue>(appClient: ApplicationClient, method: string, ...methodArgs: ABIAppCallArg[]): Promise<TResult> => {
  const result = await inovkeMethod(appClient, method, ...methodArgs)
  return result.returnValue as TResult
}

export const getAvmResultRaw = async (appClient: ApplicationClient, method: string, ...methodArgs: ABIAppCallArg[]): Promise<Uint8Array | undefined> => {
  const result = await inovkeMethod(appClient, method, ...methodArgs)
  return result.rawReturnValue?.slice(ARC4_PREFIX_LENGTH)
}
