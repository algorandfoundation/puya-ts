const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'.split('')

const CHAR_TO_NUM = BASE32_ALPHABET.reduce((acc, cur, index) => ((acc[cur] = index), acc), {} as Record<string, number>)

export const base32ToUint8Array = (value: string): Uint8Array => {
  let allChars = value
    .split('')
    .filter((c) => c !== '=')
    .map((c) => {
      const cUpper = c.toUpperCase()
      if (cUpper in CHAR_TO_NUM) return CHAR_TO_NUM[cUpper]
      throw new Error(`Invalid base32 char ${c}`)
    })
  const bytes = new Array<number>()
  while (allChars.length) {
    const [a, b, c, d, e, f, g, h, ...rest] = allChars
    if (a === undefined || b === undefined) break
    bytes.push(((a << 3) | (b >>> 2)) & 255)
    if (c === undefined || d === undefined) break
    bytes.push(((b << 6) | (c << 1) | (d >>> 4)) & 255)
    if (e === undefined) break
    bytes.push(((d << 4) | (e >>> 1)) & 255)
    if (f === undefined || g === undefined) break
    bytes.push(((e << 7) | (f << 2) | (g >>> 3)) & 255)
    if (h === undefined) break
    bytes.push(((g << 5) | h) & 255)
    allChars = rest
  }
  return new Uint8Array(bytes)
}

export const uint8ArrayToBase32 = (value: Uint8Array): string => {
  let allBytes = Array.from(value)
  let base32str = ''
  while (allBytes.length) {
    const [a, b, c, d, e, ...rest] = allBytes ?? [0, 0, 0, 0, 0]

    if (allBytes.length < 1) break
    base32str += BASE32_ALPHABET[a >>> 3]
    base32str += BASE32_ALPHABET[((a << 2) | ((b || 0) >>> 6)) & 31]
    if (allBytes.length < 2) break
    base32str += BASE32_ALPHABET[(b >>> 1) & 31]
    base32str += BASE32_ALPHABET[((b << 4) | (c >>> 4)) & 31]
    if (allBytes.length < 3) break
    base32str += BASE32_ALPHABET[((c << 1) | (d >>> 7)) & 31]
    if (allBytes.length < 4) break
    base32str += BASE32_ALPHABET[(d >>> 2) & 31]
    base32str += BASE32_ALPHABET[((d << 3) | (e >>> 5)) & 31]
    if (allBytes.length < 5) break
    base32str += BASE32_ALPHABET[e & 31]
    allBytes = rest
  }
  return base32str
}
