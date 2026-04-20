import * as crypto from 'node:crypto'
import type { PType, PTypeField } from './base'

export const ptypeIn = (target: PType, ...ptypes: [PType, ...PType[]]): boolean => {
  return ptypes.some((t) => t.equals(target))
}

export function generateObjectHash(objectProperties: PTypeField[]) {
  const signature = objectProperties.map(({ name, ptype }) => `${name}:${ptype}`).join(';')
  const hash = crypto.createHash('sha512')
  hash.update(signature, 'utf8')
  return hash.digest('hex').substring(0, 8).toUpperCase()
}
