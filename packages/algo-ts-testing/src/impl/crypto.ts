import { bytes, internal } from '@algorandfoundation/algo-ts'
import { sha256 as js_sha256 } from 'js-sha256'
import { keccak256 as js_keccak256, sha3_256 as js_sha3_256 } from 'js-sha3'
import { sha512_256 as js_sha512_256 } from 'js-sha512'
import nacl from 'tweetnacl'

export const sha256 = (a: internal.primitives.StubBytesCompat): bytes => {
  const bytesA = internal.primitives.BytesCls.fromCompat(a)
  const hashArray = js_sha256.create().update(bytesA.asUint8Array()).digest()
  const hashBytes = internal.primitives.BytesCls.fromCompat(new Uint8Array(hashArray))
  return hashBytes.asAlgoTs()
}

export const sha3_256 = (a: internal.primitives.StubBytesCompat): bytes => {
  const bytesA = internal.primitives.BytesCls.fromCompat(a)
  const hashArray = js_sha3_256.create().update(bytesA.asUint8Array()).digest()
  const hashBytes = internal.primitives.BytesCls.fromCompat(new Uint8Array(hashArray))
  return hashBytes.asAlgoTs()
}

export const keccak256 = (a: internal.primitives.StubBytesCompat): bytes => {
  const bytesA = internal.primitives.BytesCls.fromCompat(a)
  const hashArray = js_keccak256.create().update(bytesA.asUint8Array()).digest()
  const hashBytes = internal.primitives.BytesCls.fromCompat(new Uint8Array(hashArray))
  return hashBytes.asAlgoTs()
}

export const sha512_256 = (a: internal.primitives.StubBytesCompat): bytes => {
  const bytesA = internal.primitives.BytesCls.fromCompat(a)
  const hashArray = js_sha512_256.create().update(bytesA.asUint8Array()).digest()
  const hashBytes = internal.primitives.BytesCls.fromCompat(new Uint8Array(hashArray))
  return hashBytes.asAlgoTs()
}

export const ed25519verifyBare = (
  a: internal.primitives.StubBytesCompat,
  b: internal.primitives.StubBytesCompat,
  c: internal.primitives.StubBytesCompat,
): boolean => {
  const bytesA = internal.primitives.BytesCls.fromCompat(a)
  const bytesB = internal.primitives.BytesCls.fromCompat(b)
  const bytesC = internal.primitives.BytesCls.fromCompat(c)
  return nacl.sign.detached.verify(bytesA.asUint8Array(), bytesB.asUint8Array(), bytesC.asUint8Array())
}
