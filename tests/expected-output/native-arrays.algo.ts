import type { uint64 } from '@algorandfoundation/algorand-typescript'

/*
  Semicolon placement of this test is important so we disable prettier.

  The expect-error comment must be a 'leading comment' of the statement it targets. If the
  semicolon is moved to the start of the line (ie ;(arr =...)) the comment becomes a 'trailing comment' of the
  preceding statement. 
 */

// prettier-ignore
function test() {
  let arr: uint64[] = [];
  // @expect-error target of Array.push method must be a variable or state expression
  (arr = [1, 2, 3]).push(1)
}
