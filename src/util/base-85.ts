function positiveMod(x: number, m: number) {
  return ((x % m) + m) % m
}
function repeat<T>(c: T, n: number): T[] {
  return new Array<T>(n).fill(c)
}
function* batchBytesToUintN(bytes: Uint8Array, n: number): Generator<bigint> {
  const numberBytes = n / 8
  for (let i = 0; i < bytes.length / numberBytes; i += 1) {
    yield new Array(numberBytes).fill(null).reduce((acc, _, index) => {
      const offset = index + i * numberBytes
      if (offset >= bytes.length) {
        throw new Error('Needs padding')
      }
      return (acc << 8n) + BigInt(bytes[offset])
    }, 0n)
  }
}

/**
 * This implementation of base85 encoding matches python's base64.b85encode(...) function which is based on the character set of rfc1924
 * but supports arbitrary sized input.
 *
 * It IS NOT an ascii85 implementation
 */
export function buildBase85Encoder() {
  const b85Alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~'
  const b85Chars = b85Alphabet.split('')
  const b85DoubleChars = b85Chars.flatMap((c) => b85Chars.map((c2) => c + c2))

  function encode(b: Uint8Array, chars: string[], doubleChars: string[]) {
    const padding = positiveMod(-b.length, 4)
    if (padding) {
      b = new Uint8Array([...b, ...repeat(0, padding)])
    }
    let result = ''
    for (const word of batchBytesToUintN(b, 4 * 8)) {
      result += doubleChars[Number(word / 85n ** 3n)]
      result += doubleChars[Number((word / 85n) % 85n ** 2n)]
      result += chars[Number(word % 85n)]
    }
    return result.slice(0, result.length - padding)
  }

  return {
    encode(b: Uint8Array) {
      return encode(b, b85Chars, b85DoubleChars)
    },
    encodeUtf8(s: string) {
      const b = new TextEncoder().encode(s)
      return this.encode(b)
    },
  }
}
