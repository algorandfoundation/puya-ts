import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { arc4 } from '@algorandfoundation/algorand-typescript'

/** ARC-4 encoded proposal identifier, used by governance and voting examples */
export class ProposalId extends arc4.Struct<{ id: arc4.Uint64 }> {}

/** ARC-4 encoded member record with address and join timestamp */
export class MemberRecord extends arc4.Struct<{
  address: arc4.Address
  joinedAt: arc4.Uint64
}> {}

/** ARC-4 encoded transfer event for event logging examples */
export class TransferEvent extends arc4.Struct<{
  from: arc4.Address
  to: arc4.Address
  amount: arc4.Uint64
}> {}
