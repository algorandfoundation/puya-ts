import * as crypto from 'node:crypto'
import { ImmutableObjectPType, MutableObjectPType, TransientType, UnsupportedType } from '.'
import type { SourceLocation } from '../../awst/source-location'
import { CodeError } from '../../errors'
import type { PType } from './base'

export const ptypeIn = (target: PType, ...ptypes: [PType, ...PType[]]): boolean => {
  return ptypes.some((t) => t.equals(target))
}

export function generateObjectHash(objectProperties: Record<string, PType>) {
  const signature = Object.entries(objectProperties)
    .map(([k, v]) => `${k}:${v}`)
    .join(';')
  const hash = crypto.createHash('sha512')
  hash.update(signature, 'utf8')
  return hash.digest('hex').substring(0, 8).toUpperCase()
}

export function assertCanBeUsedForStorage(ptype: PType, sourceLocation?: SourceLocation) {
  if (ptype instanceof UnsupportedType || ptype instanceof TransientType) {
    throw new CodeError(`Type ${ptype} cannot be used for storage`, { sourceLocation })
  }
  if ((ptype instanceof MutableObjectPType || ptype instanceof ImmutableObjectPType) && !ptype.abiSafe) {
    const ptypeName = ptype.alias?.fullName || ptype.toString()
    throw new CodeError(`Type ${ptypeName} cannot be used for storage`, { sourceLocation })
  }
}
