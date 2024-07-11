import { uint64, bytes, Uint64, Bytes } from '@algorandfoundation/algo-ts'

function test_uint64(x: uint64): uint64 {
  switch (x) {
    case 1:
    case 2:
    case Uint64(4):
      return 3
    default: {
      return 1
    }
  }
}

function test_break(x: uint64): uint64 {
  let i: uint64 = 0
  switch (x) {
    case 1:
    case 2:
    case Uint64(4):
      i += x
      break
    case 5:
      i *= x
  }
  return i
}

function test_bytes(x: bytes): bytes {
  switch (x) {
    case Bytes('hmmm'):
    case Bytes.fromHex('Ff'):
    case Bytes.fromBase64('ZHNmc2Rmc2Q='):
    case Bytes.fromBase32('ONSGMZ3OMJTGOZDGMRSGM==='):
      return x
  }
  return x
}
