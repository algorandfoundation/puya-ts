import type { ARC4ABIMethodConfig } from './nodes'

export * as awst from './nodes'
export * from './util'
export type ConstantValue = bigint | Uint8Array | boolean | string
export type ResourceEncoding = ARC4ABIMethodConfig['resourceEncoding']
