import { GlobalStateCls, LocalStateMapCls } from './impl/state'
import { bytes } from './primitives'
import { Account } from './reference'
import { DeliberateAny } from './typescript-helpers'

/** A value saved in global state */
export type GlobalState<ValueType> = {
  value: ValueType
  delete: () => void
  hasValue: boolean
}
type GlobalStateOptions<ValueType> = { key?: bytes } & ({ initialValue: ValueType } | { type: (...args: DeliberateAny[]) => ValueType })

/** A single key in global state */
export function GlobalState<ValueType>(options: GlobalStateOptions<ValueType>): GlobalState<ValueType> {
  const initialValue = 'initialValue' in options ? options.initialValue : undefined
  const type = 'type' in options ? options.type?.name : (initialValue as object)?.constructor?.name ?? 'unknown'
  return new GlobalStateCls(type, options?.key, initialValue)
}

/** A value saved in local state */
declare type LocalState<ValueType> = {
  value: ValueType
  hasValue: boolean
  delete: () => void
}

type LocalStateOptions<ValueType> = { key?: bytes; type: (...args: DeliberateAny[]) => ValueType }

/** A single key in local state */
export function LocalState<ValueType>(options: LocalStateOptions<ValueType>['type']): (account: Account) => LocalState<ValueType>
export function LocalState<ValueType>(options: LocalStateOptions<ValueType>): (account: Account) => LocalState<ValueType>
export function LocalState<ValueType>(
  options: LocalStateOptions<ValueType> | LocalStateOptions<ValueType>['type'],
): (account: Account) => LocalState<ValueType> {
  function localStateInternal(account: Account): LocalState<ValueType> {
    return localStateInternal.map.getValue(account)
  }
  const opts = options instanceof Function ? { type: options, key: undefined } : options
  localStateInternal.key = opts.key
  localStateInternal.map = new LocalStateMapCls<ValueType>(opts.type.name)
  return localStateInternal
}
