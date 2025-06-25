import * as crypto from 'node:crypto'
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
