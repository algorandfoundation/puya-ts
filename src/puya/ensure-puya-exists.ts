import which from 'which'
import { EnvironmentError } from '../errors'

// TODO: Remove this function
export function ensurePuyaExists() {
  if (
    which.sync('puya', {
      nothrow: true,
    })
  )
    return
  throw new EnvironmentError(
    `Failed to resolve command path, 'puya' wasn't found. Please ensure puya compiler has been installed and is available on your PATH.`,
  )
}
