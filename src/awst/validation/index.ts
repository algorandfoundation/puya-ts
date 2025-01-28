import type { AWST } from '../nodes'
import { Arc4ApprovalCallsRouter } from './arc4-approval-calls-router'

type ModuleValidator = {
  validate(awst: AWST[]): void
}

const validators: ModuleValidator[] = [Arc4ApprovalCallsRouter]

export function validateAwst(awst: AWST[]): void {
  for (const validator of validators) {
    validator.validate(awst)
  }
}
