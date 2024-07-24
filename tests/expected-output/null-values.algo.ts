// @expect-error Not Supported: Null values
const a: null = null

export function test(): null {
  // @expect-error Not Supported: Null values
  return null
}
