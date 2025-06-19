import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, clone, Contract, log } from '@algorandfoundation/algorand-typescript'

export class AssignmentsAlgo extends Contract {
  testPrimitives(u: uint64) {
    const p1 = u
    const p2: uint64 = 2
  }

  testArrayDestructure(i_a: ReadonlyArray<uint64>, u: uint64, m_a: uint64[]) {
    const [, a1] = i_a
    let a2: uint64, a3: uint64
    const a5 = ([a2, a3] = [logAndReturn(u), logAndReturn(u), logAndReturn(u)])
    assert(a5.length === 3, 'a5 length should be 3')
    const [a4]: [uint64] = [1]
    const [c, d] = [logAndReturn(u), logAndReturn(u), logAndReturn(u)]
    const [a6, a7] = m_a
  }

  testArrayNarrowing(m_a: uint64[], u: uint64) {
    const direct = clone(m_a)

    const narrowed: readonly uint64[] = clone(m_a)
    let fromLit: readonly uint64[]
    const result = (fromLit = [u, u, u])

    const fromLit2: readonly uint64[] = [u, u, u]
  }

  testItxn() {
    //const [a, b] = itxn.submitGroup(itxn.payment({}), itxn.payment({}))
    /*
    tests/approvals/assignments.algo.ts:31:11 error: inner transactions cannot be used in assignment expressions
                                                  const [a, b] = itxn.submitGroup(itxn.payment({}), itxn.payment({}))

     */
    /*
      File "C:\Users\trist\.local\pipx\venvs\puyapy\Lib\site-packages\puya\errors.py", line 36, in log_exceptions
    yield
  File "C:\Users\trist\.local\pipx\venvs\puyapy\Lib\site-packages\puya\main.py", line 47, in main
    awst_to_teal(log_ctx, options, compilation_set, sources_by_path, awst)
  File "C:\Users\trist\.local\pipx\venvs\puyapy\Lib\site-packages\puya\compile.py", line 70, in awst_to_teal
    teal = list(_ir_to_teal(log_ctx, context, ir))
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\trist\.local\pipx\venvs\puyapy\Lib\site-packages\puya\compile.py", line 121, in _ir_to_teal
    artifact_ir = transform_ir(artifact_context, artifact_ir)
                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\trist\.local\pipx\venvs\puyapy\Lib\site-packages\puya\ir\main.py", line 198, in transform_ir
    transform(context, program)
  File "C:\Users\trist\.local\pipx\venvs\puyapy\Lib\site-packages\puya\ir\main.py", line 255, in _lower_aggregate_ir
    lower_aggregate_nodes(program)
  File "C:\Users\trist\.local\pipx\venvs\puyapy\Lib\site-packages\puya\ir\builder\aggregates\main.py", line 28, in lower_aggregate_nodes
    replacer.process_and_validate()
  File "C:\Users\trist\.local\pipx\venvs\puyapy\Lib\site-packages\puya\ir\mutating_register_context.py", line 36, in process_and_validate
    self.visit_block(block)
  File "C:\Users\trist\.local\pipx\venvs\puyapy\Lib\site-packages\puya\ir\visitor_mutator.py", line 29, in visit_block
    assert new_op is op, f"ops should be mutated in place, {op=!s}, {new_op=!s}"
           ^^^^^^^^^^^^
AssertionError: ops should be mutated in place, op=encode<(uint64)>(1u), new_op=aggregate%encoded%5#1

     */
  }
}

function logAndReturn(u: uint64): uint64 {
  log(u)
  return u
}
