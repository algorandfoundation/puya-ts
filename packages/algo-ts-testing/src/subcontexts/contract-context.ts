import { Application, BaseContract, Bytes, bytes, internal, uint64 } from '@algorandfoundation/algo-ts'
import { getGenericTypeInfo } from '../runtime-helpers'
import { TestExecutionContext } from '../test-execution-context'
import { DeliberateAny } from '../typescript-helpers'
import { extractGenericTypeArgs } from '../util'

interface IConstructor<T> {
  new (...args: DeliberateAny[]): T
}

type StateTotals = Pick<Application, 'globalNumBytes' | 'globalNumUint' | 'localNumBytes' | 'localNumUint'>

interface States {
  globalStates: Map<bytes, internal.state.GlobalStateCls<unknown>>
  localStates: Map<bytes, internal.state.LocalStateMapCls<unknown>>
  totals: StateTotals
}

const isUint64GenericType = (typeName: string) => {
  const genericTypes: string[] = extractGenericTypeArgs(typeName)
  return genericTypes.some((t) => t.toLocaleLowerCase() === 'uint64')
}

const extractStates = (contract: BaseContract): States => {
  const stateTotals = { globalNumBytes: 0, globalNumUint: 0, localNumBytes: 0, localNumUint: 0 }
  const states = {
    globalStates: new Map<bytes, internal.state.GlobalStateCls<unknown>>(),
    localStates: new Map<bytes, internal.state.LocalStateMapCls<unknown>>(),
    totals: stateTotals,
  }
  Object.entries(contract).forEach(([key, value]) => {
    const isLocalState = value instanceof Function && value.name === 'localStateInternal'
    const isGlobalState = value instanceof internal.state.GlobalStateCls
    if (isLocalState || isGlobalState) {
      // set key using property name if not already set
      if (value.key === undefined) value.key = Bytes(key)

      // capture state into the context
      if (isLocalState) states.localStates.set(value.key, value.map)
      else states.globalStates.set(value.key, value)

      // populate state totals
      const isUint64State = isUint64GenericType(getGenericTypeInfo(value)!)
      stateTotals.globalNumUint += isGlobalState && isUint64State ? 1 : 0
      stateTotals.globalNumBytes += isGlobalState && !isUint64State ? 1 : 0
      stateTotals.localNumUint += isLocalState && isUint64State ? 1 : 0
      stateTotals.localNumBytes += isLocalState && !isUint64State ? 1 : 0
    }
  })
  return states
}

export class ContractContext {
  #context: TestExecutionContext
  #statesMap = new Map<BaseContract, States>()

  constructor(context: TestExecutionContext) {
    this.#context = context
  }

  create<T extends BaseContract>(type: IConstructor<T>, ...args: DeliberateAny[]): T {
    const proxy = new Proxy(type, this.getContractProxyHandler<T>())
    return new proxy(...args)
  }

  private getContractProxyHandler<T extends BaseContract>(): ProxyHandler<IConstructor<T>> {
    const context = this.#context
    const onConstructed = (instance: BaseContract) => {
      const states = extractStates(instance)

      const application = context.any.application({
        ...states.totals,
      })
      context.ledger.addAppIdContractMap(application.id, instance)
      this.#statesMap.set(instance, states)
    }
    return {
      construct(target, args) {
        const instance = new Proxy(new target(...args), {
          get(target, prop, receiver) {
            const orig = Reflect.get(target, prop, receiver)
            if (prop === 'approvalProgram' || prop === 'clearStateProgram') {
              return () => {
                try {
                  context.activeContract = target as unknown as T
                  return (orig as () => boolean | uint64).apply(target)
                } finally {
                  context.activeContract = undefined
                }
              }
            }
            return orig
          },
        })
        onConstructed(instance)
        return instance
      },
    }
  }
}
