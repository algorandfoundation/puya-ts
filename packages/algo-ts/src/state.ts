import { Account } from './reference'

/** A value saved in global state */
export type GlobalStateProxy<ValueType> = {
  value: ValueType
  delete: () => void
  hasValue: boolean
}

/** A single key in global state */
export function GlobalState<ValueType>(options?: { key?: string }): GlobalStateProxy<ValueType> {
  return undefined as unknown as GlobalStateProxy<ValueType>
}

/** A value saved in local state */
declare type LocalStateProxy<ValueType> = {
  value: ValueType
  hasValue: boolean
}

/** A single key in local state */
export function LocalState<ValueType>(options?: { key?: string }): (account: Account) => LocalStateProxy<ValueType> {
  return undefined as unknown as () => LocalStateProxy<ValueType>
}
