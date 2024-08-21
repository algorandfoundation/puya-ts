export const padUint8Array = (arr: Uint8Array, padSize: number): Uint8Array => {
  const paddedUint8Array = new Uint8Array(arr.length + padSize).fill(0)
  arr.forEach((v, i) => paddedUint8Array[padSize + i] = v)
  return paddedUint8Array
}
