import type { AWST } from '../nodes'
import { Arc4ApprovalCallsRouter } from './arc4-approval-calls-router'
import { ARC4CopyValidator } from './arc4-copy'

type ModuleValidator = {
  validate(awst: AWST[]): void
}

const validators: ModuleValidator[] = [Arc4ApprovalCallsRouter, ARC4CopyValidator]

export function validateAwst(awst: AWST[]): void {
  for (const validator of validators) {
    validator.validate(awst)
  }
}
