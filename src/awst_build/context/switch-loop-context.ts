import ts from 'typescript'
import type { SourceLocation } from '../../awst/source-location'
import { codeInvariant, invariant, toSubScript } from '../../util'
import { nodeFactory } from '../../awst/node-factory'
import type { Block, Goto } from '../../awst/nodes'
import { defaultRecord } from '../../util/default-map'

type SwitchOrLoop = 'switch' | 'loop'
type LoopContext = Disposable & { breakTarget: Block; continueTarget: Block; readonly hasBreaks: boolean; readonly hasContinues: boolean }
type SwitchContext = Disposable & {
  breakTarget: Block
  caseTarget(caseIndex: number, sourceLocation: SourceLocation): Block
  gotoCase(caseIndex: number, sourceLocation: SourceLocation): Goto
  readonly hasBreaks: boolean
}
type StackData =
  | { type: 'switch'; uniqueName: string; label?: string; numBreaks: number }
  | { type: 'loop'; uniqueName: string; label?: string; numBreaks: number; numContinues: number }

const breakSuffix = 'ᵇ'
const continueSuffix = 'ᶜ'

/**
 * Tracks parent switches and loops so that break and continue statements
 * can target the correct parent.
 */
export class SwitchLoopContext {
  private labelCount = defaultRecord<string, number>(() => 0)
  private unlabelledCount = defaultRecord<SwitchOrLoop, number>(() => 0)

  constructor() {}

  private switchLoopStack: Array<StackData> = []

  getBreakTarget(label: ts.Identifier | undefined, sourceLocation: SourceLocation): string {
    const labelName = label?.text
    const item = this.switchLoopStack.toReversed().find(({ label }) => labelName === undefined || label === labelName)
    codeInvariant(item, 'Break must must exist inside a switch or loop construct', sourceLocation)
    item.numBreaks++
    return `${item.uniqueName}${breakSuffix}`
  }

  getContinueTarget(label: ts.Identifier | undefined, sourceLocation: SourceLocation): string {
    const labelName = label?.text
    const item = this.switchLoopStack.toReversed().find(({ label }) => labelName === undefined || label === labelName)
    codeInvariant(item?.type === 'loop', 'Continue must must exist inside a loop construct', sourceLocation)
    item.numContinues++
    return `${item.uniqueName}${continueSuffix}`
  }

  enterLoop(
    node: ts.WhileStatement | ts.ForStatement | ts.ForOfStatement | ts.ForInStatement | ts.DoStatement,
    sourceLocation: SourceLocation,
  ): LoopContext {
    const label = ts.isLabeledStatement(node.parent) ? node?.parent.label : undefined

    const uniqueName = this.uniqueNameForLabel(label, 'loop')
    const stackData: StackData = {
      uniqueName,
      label: label?.text,
      type: 'loop',
      numBreaks: 0,
      numContinues: 0,
    }
    this.switchLoopStack.push(stackData)
    return {
      breakTarget: nodeFactory.block({ sourceLocation, label: `${uniqueName}${breakSuffix}` }),
      continueTarget: nodeFactory.block({ sourceLocation, label: `${uniqueName}${continueSuffix}` }),
      [Symbol.dispose]: () => {
        const popped = this.switchLoopStack.pop()
        invariant(popped?.uniqueName === uniqueName && popped.type === 'loop', 'Switch loop stack is unbalanced')
      },
      get hasBreaks() {
        return stackData.numBreaks > 0
      },
      get hasContinues() {
        return stackData.numContinues > 0
      },
    }
  }

  private uniqueNameForLabel(label: ts.Identifier | undefined, type: 'switch' | 'loop'): string {
    if (label) {
      const count = ++this.labelCount[label.text]
      return `${label.text}${toSubScript(count)}`
    } else {
      const nextCount = ++this.unlabelledCount[type]
      return `#${type}${toSubScript(nextCount)}`
    }
  }

  enterSwitch(node: ts.SwitchStatement, sourceLocation: SourceLocation): SwitchContext {
    const label = ts.isLabeledStatement(node.parent) ? node?.parent.label : undefined
    const uniqueName = this.uniqueNameForLabel(label, 'switch')
    const stackData: StackData = {
      uniqueName,
      label: label?.text,
      type: 'switch',
      numBreaks: 0,
    }
    this.switchLoopStack.push(stackData)
    return {
      breakTarget: nodeFactory.block({ sourceLocation, label: `${uniqueName}${breakSuffix}` }),
      caseTarget(caseIndex: number, sourceLocation: SourceLocation) {
        return nodeFactory.block({ sourceLocation, label: `${uniqueName}ᶜ${toSubScript(caseIndex)}` })
      },
      gotoCase(caseIndex: number, sourceLocation: SourceLocation): Goto {
        return nodeFactory.goto({ sourceLocation, target: `${uniqueName}ᶜ${toSubScript(caseIndex)}` })
      },
      [Symbol.dispose]: () => {
        const popped = this.switchLoopStack.pop()
        invariant(popped?.uniqueName === uniqueName && popped.type === 'switch', 'Switch loop stack is unbalanced')
      },
      get hasBreaks() {
        return stackData.numBreaks > 0
      },
    }
  }
}
