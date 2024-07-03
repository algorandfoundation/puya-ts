import { BaseContract, internal } from '@algorandfoundation/algo-ts'
import { TestExecutionContext } from './test-execution-context'
import { Transaction } from './transactions/client'
import { encodeTransactions } from './transactions'
import { AvmError, CodeError, InternalError } from './errors'
import { DecodedLogs, decodeLogs, LogDecoding } from './decode-logs'

export type SimulateResult = {
  exportLogs<const T extends [...LogDecoding[]]>(...decoding: T): DecodedLogs<T>
  rawLogs: Uint8Array[]
  returnValue: bigint | Error
}

type AsyncContract<T extends BaseContract> = () => Promise<{ default: { new (): T } }>

export class TestHarness<T extends BaseContract> {
  protected constructor(private module: AsyncContract<T>) {}

  public static for<T extends BaseContract>(contract: AsyncContract<T>): TestHarness<T> {
    return new TestHarness(contract)
  }

  public async simulate(txnGroup: Transaction[]): Promise<SimulateResult> {
    try {
      const context = new TestExecutionContext(encodeTransactions(txnGroup))
      internal.ctxMgr.instance = context
      // noinspection JSPotentiallyInvalidConstructorUsage
      const instance = new (await this.module()).default()

      let returnValue: bigint | Error
      try {
        const temp = instance.approvalProgram()
        if (temp === true) {
          returnValue = 1n
        } else if (temp === false) {
          returnValue = 0n
        } else {
          returnValue = BigInt(temp.valueOf())
        }
      } catch (e) {
        if (e instanceof AvmError) {
          returnValue = e
        } else if (e instanceof CodeError) {
          if (e.stack) {
            for (const line of e.stack.split('\n')) {
              const sourceLocation = /\(([^)]+\.algo\.ts:\d+:\d+)\)/.exec(line)
              if (sourceLocation) {
                // eslint-disable-next-line no-console
                console.error(`${sourceLocation[1]}: ${e.message}`)
                break
              }
            }
          }
          throw e
        } else {
          if (e instanceof Error) {
            throw new InternalError(`Internal error: algo-ts-testing encountered an unexpected error: ${e.message}`, { cause: e })
          } else {
            throw new InternalError(`Internal error: algo-ts-testing encountered an unexpected error ${e}`)
          }
        }
      }

      const rawLogs = context.rawLogs
      return {
        exportLogs<const T extends [...LogDecoding[]]>(...decoding: T): DecodedLogs<T> {
          return decodeLogs(rawLogs, decoding)
        },
        rawLogs,
        returnValue,
      }
    } finally {
      internal.ctxMgr.reset()
    }
  }
}
