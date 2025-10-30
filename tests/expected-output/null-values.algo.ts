// @expect-error Not Supported: Null values
const a: null = null

// @expect-error Not Supported: The type null is not supported
export function test(): null {
  // @expect-error Not Supported: Null values
  return null
}
