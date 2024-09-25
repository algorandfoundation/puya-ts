import * as algokit from '@algorandfoundation/algokit-utils'
import { ABIAppCallArg, ABIReturn } from '@algorandfoundation/algokit-utils/types/app'
import { ApplicationClient } from '@algorandfoundation/algokit-utils/types/app-client'
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import { nullLogger } from '@algorandfoundation/algokit-utils/types/logging'
import { SendTransactionParams } from '@algorandfoundation/algokit-utils/types/transaction'
import { ABIValue } from 'algosdk'
import { randomUUID } from 'crypto'
import { Lazy } from './util'

algokit.Config.configure({ logger: nullLogger })
const ARC4_PREFIX_LENGTH = 2

const algorandClient = Lazy(() => algokit.AlgorandClient.defaultLocalNet())

export const INITIAL_BALANCE_MICRO_ALGOS = Number(20e6)

export const getAlgorandAppClient = async (appSpec: AppSpec) => {
  const client = algorandClient()
  const defaultSigner = await client.account.kmd.getLocalNetDispenserAccount()
  const appClient = algokit.getAppClient({ app: appSpec, resolveBy: 'id', id: 0, sender: defaultSigner.account }, client.client.algod)
  await appClient.create({ note: randomUUID() })
  return appClient
}

const inovkeMethod = async (
  appClient: ApplicationClient,
  method: string,
  sendParams?: SendTransactionParams,
  ...methodArgs: ABIAppCallArg[]
): Promise<ABIReturn> => {
  const response = await appClient.call({ method, methodArgs, note: randomUUID(), sendParams })
  if (!response.return) {
    throw new Error(`${method} did not return a value`)
  }
  if (response.return.decodeError) {
    throw response.return.decodeError
  }
  return response.return
}

export const getAvmResult = async <TResult extends ABIValue>(
  { appClient, sendParams }: { appClient: ApplicationClient; sendParams?: SendTransactionParams },
  method: string,
  ...methodArgs: ABIAppCallArg[]
): Promise<TResult> => {
  const result = await inovkeMethod(appClient, method, sendParams, ...methodArgs)
  return result.returnValue as TResult
}

export const getAvmResultRaw = async (
  { appClient, sendParams }: { appClient: ApplicationClient; sendParams?: SendTransactionParams },
  method: string,
  ...methodArgs: ABIAppCallArg[]
): Promise<Uint8Array | undefined> => {
  const result = await inovkeMethod(appClient, method, sendParams, ...methodArgs)
  return result.rawReturnValue?.slice(ARC4_PREFIX_LENGTH)
}

