import { logger } from '../logger'
import type { QuickFix } from './quick-fix'

class QuickFixContext {
  #quickFixes: QuickFix[] = []

  get quickFixes(): ReadonlyArray<QuickFix> {
    return this.quickFixes
  }

  registerQuickFix(quickFix: QuickFix) {
    this.#quickFixes.push(quickFix)
    logger.addLog(...quickFix.logData)
  }
}

const ctx = new QuickFixContext()
export function registerQuickFix(quickFix: QuickFix) {
  ctx.registerQuickFix(quickFix)
}

export function getQuickFixes() {
  return ctx.quickFixes
}
