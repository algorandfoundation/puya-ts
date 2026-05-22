import type { Application, uint64 } from '@algorandfoundation/algorand-typescript'
import {
  abimethod,
  assert,
  contract,
  Contract,
  gtxn,
  itxn,
  Txn,
} from '@algorandfoundation/algorand-typescript'
import { decodeArc4, encodeArc4, methodSelector } from '@algorandfoundation/algorand-typescript/arc4'

export class HelloContract extends Contract {
  @abimethod()
  hello(name: string): string {
    return `Hello, ${name}`
  }
}

@contract({ avmVersion: 12 })
export class RejectVersion extends Contract {
  // example: REJECT_VERSION_INNER_CALL
  @abimethod()
  callPinned(target: Application, maxVersion: uint64): string {
    const result = itxn.applicationCall({
      appId: target,
      appArgs: [methodSelector(HelloContract.prototype.hello), encodeArc4('World')],
      rejectVersion: maxVersion + 1,
      fee: 0,
    }).submit()
    return decodeArc4<string>(result.lastLog, 'log')
  }

  // example: REJECT_VERSION_INNER_CALL

  // example: REJECT_VERSION_CHECK_BEFORE_CALL
  @abimethod()
  callChecked(target: Application, maxVersion: uint64): string {
    assert(target.version <= maxVersion, 'target upgraded past audited version')

    const result = itxn.applicationCall({
      appId: target,
      appArgs: [methodSelector(HelloContract.prototype.hello), encodeArc4('World')],
      fee: 0,
    }).submit()
    return decodeArc4<string>(result.lastLog, 'log')
  }

  // example: REJECT_VERSION_CHECK_BEFORE_CALL

  // example: REJECT_VERSION_GTXN
  @abimethod()
  checkSiblingPin(siblingIndex: uint64, minPin: uint64): uint64 {
    const sibling = gtxn.ApplicationCallTxn(siblingIndex)
    assert(sibling.rejectVersion >= minPin, 'sibling app call is not pinned tightly enough')
    return sibling.rejectVersion
  }

  // example: REJECT_VERSION_GTXN
}

@contract({ avmVersion: 12 })
export class RejectVersionTargetV0 extends Contract {
  @abimethod({ allowActions: 'UpdateApplication' })
  update(): void {
    assert(Txn.rejectVersion === 1, 'can only update if caller expects this to be currently be v0')
  }
}

@contract({ avmVersion: 12 })
export class RejectVersionTargetV1 extends Contract {
  @abimethod({ allowActions: 'DeleteApplication' })
  delete(): void {
    assert(Txn.rejectVersion === 2, 'can only update if caller expects this to be currently be v1')
  }
}
