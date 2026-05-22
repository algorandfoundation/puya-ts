# Reject Version Migration Notes

This file tracks migration details for `reject_version/contract.algo.ts`.

Source of truth:
`/home/gabe/Code/@algorandfoundation/puya/examples/devportal/reject_version/contract.py`

## Snippet Mapping

| Python source snippet | Current TypeScript marker | Status | Notes |
| --- | --- | --- | --- |
| `REJECT_VERSION_INNER_CALL` | `REJECT_VERSION_INNER_CALL` | Ported | Preserved. |
| `REJECT_VERSION_CHECK_BEFORE_CALL` | `REJECT_VERSION_CHECK_BEFORE_CALL` | Ported | Preserved using `Application.version`. |
| `REJECT_VERSION_GTXN` | `REJECT_VERSION_GTXN` | Ported | Preserved. |

## API Migration Notes

| Area | Python source | Current puya-ts port | Reason |
| --- | --- | --- | --- |
| Contract AVM pin | `class ...(ARC4Contract, avm_version=12)` | `@contract({ avmVersion: 12 })` | Current TS expresses contract metadata via a decorator. |
| Manual ABI call | `arc4.arc4_signature(...)` in `app_args` | `methodSelector(...)` plus `encodeArc4(...)` | Current TS derives selectors from typed method references. |
| ARC-4 log decode | `arc4.String.from_log(...)` | `decodeArc4<string>(..., 'log')` | Current TS exposes generic ARC-4 log decoding. |
| App version read | `op.AppParamsGet.app_version(target)` | `target.version` | Current TS exposes the referenced application's version directly on `Application`. |
| Group field | `sibling.reject_version` | `sibling.rejectVersion` | Current TS uses camelCase transaction fields. |

## Docs Compatibility

No local devportal docs page currently references these snippet names, so this
port preserves the authoritative Python markers directly.

## Follow-up Items

| Item | Recommendation |
| --- | --- |
| Explicit existence check | If docs need to discuss missing foreign apps, add a note explaining how TS reference access behaves when the app is absent. |
| Update/delete helpers | The extra `RejectVersionTargetV0/V1` contracts are support scaffolding for local compilation parity; keep docs focused on the main `RejectVersion` contract. |
