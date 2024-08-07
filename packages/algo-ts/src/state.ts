import { GlobalStateCls, LocalStateMapCls } from './impl/state'
import { bytes } from './primitives'
import { Account } from './reference'

/** A value saved in global state */
export type GlobalState<ValueType> = {
  value: ValueType
  delete: () => void
  hasValue: boolean
}

/** A single key in global state */
export function GlobalState<ValueType>(options?: { key?: bytes; initialValue?: ValueType }): GlobalState<ValueType> {
  return new GlobalStateCls(options?.key, options?.initialValue)
}

/** A value saved in local state */
declare type LocalState<ValueType> = {
  value: ValueType
  hasValue: boolean
  delete: () => void
}

/** A single key in local state */
export function LocalState<ValueType>(options?: { key?: bytes }): (account: Account) => LocalState<ValueType> {
  function localStateInternal(account: Account): LocalState<ValueType> {
    return localStateInternal.map.getValue(account)
  }
  localStateInternal.key = options?.key
  localStateInternal.map = new LocalStateMapCls<ValueType>()
  return localStateInternal
}
