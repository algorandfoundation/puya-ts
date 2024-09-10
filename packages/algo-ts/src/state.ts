import { Account } from './reference'
import { bytes } from './primitives'

/** A value saved in global state */
export type GlobalState<ValueType> = {
  value: ValueType
  delete: () => void
  hasValue: boolean
}

/** A single key in global state */
export function GlobalState<ValueType>(options?: { key?: bytes | string; initialValue?: ValueType }): GlobalState<ValueType> {
  return undefined as unknown as GlobalState<ValueType>
}

/** A value saved in local state */
export type LocalStateForAccount<ValueType> = {
  value: ValueType
  hasValue: boolean
}

export type LocalState<ValueType> = {
  (account: Account): LocalStateForAccount<ValueType>
}

/** A single key in local state */
export function LocalState<ValueType>(options?: { key?: bytes | string }): LocalState<ValueType> {
  return undefined as unknown as LocalState<ValueType>
}
