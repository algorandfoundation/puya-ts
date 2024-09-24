import { GlobalStateCls, LocalStateMapCls } from './impl/state'
import { bytes } from './primitives'
import { Account } from './reference'

/** A value saved in global state */
export type GlobalState<ValueType> = {
  value: ValueType
  delete: () => void
  hasValue: boolean
}

type GlobalStateOptions<ValueType> = { key?: bytes | string; initialValue?: ValueType }

/** A single key in global state */
export function GlobalState<ValueType>(options?: GlobalStateOptions<ValueType>): GlobalState<ValueType> {
  return new GlobalStateCls(options?.key, options?.initialValue)
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
  function localStateInternal(account: Account): LocalStateForAccount<ValueType> {
    return localStateInternal.map.getValue(account)
  }
  localStateInternal.key = options?.key
  localStateInternal.map = new LocalStateMapCls<ValueType>()
  return localStateInternal
}
