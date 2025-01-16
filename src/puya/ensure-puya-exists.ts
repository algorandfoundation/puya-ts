import { sync as whichSync } from 'which'
import { EnvironmentError } from '../errors'

export function ensurePuyaExists() {
  if (
    whichSync('puya', {
      nothrow: true,
    })
  )
    return
  throw new EnvironmentError(
    `Failed to resolve command path, 'puya' wasn't found. Please ensure puya compiler has been installed and is available on your PATH.`,
  )
}
