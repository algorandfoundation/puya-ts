import {
  base32ToUint8Array,
  base64ToUint8Array,
  bigIntToUint8Array,
  hexToUint8Array,
  uint8ArrayToBase32,
  uint8ArrayToBase64,
  uint8ArrayToBigInt,
  uint8ArrayToHex,
  uint8ArrayToUtf8,
  utf8ToUint8Array,
} from './util'

export { SourceLocation } from './awst/source-location'
export * as ptypes from './awst_build/ptypes/for-export'
export { registerPTypes } from './awst_build/ptypes/register'
export { typeRegistry } from './awst_build/type-registry'
export { TypeResolver } from './awst_build/type-resolver'
export { compile } from './compile'
export { LoggingContext } from './logger'

export const encodingUtil = {
  utf8ToUint8Array,
  bigIntToUint8Array,
  hexToUint8Array,
  base32ToUint8Array,
  base64ToUint8Array,
  uint8ArrayToUtf8,
  uint8ArrayToHex,
  uint8ArrayToBase32,
  uint8ArrayToBase64,
  uint8ArrayToBigInt,
}
