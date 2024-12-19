import type { SupportedAvmVersion } from '../../../constants'
import { Constants } from '../../../constants'
import { codeInvariant, isIn } from '../../../util'
import type { NodeBuilder } from '../index'
import { requireIntegerConstant } from './index'

export function requireAvmVersion(builder: NodeBuilder): SupportedAvmVersion {
  const value = requireIntegerConstant(builder)
  codeInvariant(isIn(value.value, Constants.supportedAvmVersions), `${value.value} is not a supported AVM version`, value.sourceLocation)
  return value.value as SupportedAvmVersion
}
