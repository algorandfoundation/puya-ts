import * as algokit from '@algorandfoundation/algokit-utils'
import { ABIAppCallArg } from '@algorandfoundation/algokit-utils/types/app'
import { ApplicationClient } from '@algorandfoundation/algokit-utils/types/app-client'
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import { nullLogger } from '@algorandfoundation/algokit-utils/types/logging'
import { ABIValue } from 'algosdk'

algokit.Config.configure({ logger: nullLogger })

export const getAlgorandAppClient = async (appSpec: AppSpec): Promise<ApplicationClient> => {
  const client = algokit.AlgorandClient.defaultLocalNet()
  const defaultSigner = await client.account.kmd.getLocalNetDispenserAccount()
  const appClient = algokit.getAppClient({ app: appSpec, resolveBy: 'id', id: 0, sender: defaultSigner.account }, client.client.algod)
  await appClient.create()
  return appClient
}

export const getAvmResult = async <TResult extends ABIValue>(appClient: ApplicationClient, method: string, ...methodArgs: ABIAppCallArg[]): Promise<TResult> => {
  const response = await appClient.call({ method, methodArgs })
  if (!response.return) {
    throw new Error(`${method} did not return a value`)
  }
  if (response.return.decodeError) {
    throw response.return.decodeError
  }
  return response.return.returnValue as TResult
}
