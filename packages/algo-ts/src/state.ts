import { ctxMgr } from './execution-context'
import { bytes } from './primitives'
import { Account } from './reference'

/** A value saved in global state */
export type GlobalState<ValueType> = {
  value: ValueType
  delete: () => void
  hasValue: boolean
}

export type GlobalStateOptions<ValueType> = { key?: bytes | string; initialValue?: ValueType }

/** A single key in global state */
export function GlobalState<ValueType>(options?: GlobalStateOptions<ValueType>): GlobalState<ValueType> {
  return ctxMgr.instance.state.createGlobalState(options)
}

/** A value saved in local state */
export type LocalStateForAccount<ValueType> = {
  value: ValueType
  hasValue: boolean
  delete: () => void
}

export type LocalState<ValueType> = {
  (account: Account): LocalStateForAccount<ValueType>
}

/** A single key in local state */
export function LocalState<ValueType>(options?: { key?: bytes | string }): LocalState<ValueType> {
  return ctxMgr.instance.state.createLocalState(options)
}
