import ts from 'typescript'
import { SourceLocation } from '../../awst/source-location'
import { codeInvariant, invariant, toSubScript } from '../../util'
import { nodeFactory } from '../../awst/node-factory'
import { Block, Goto } from '../../awst/nodes'
import { defaultRecord } from '../../util/default-map'

type SwitchOrLoop = 'switch' | 'loop'
type LoopContext = Disposable & { breakTarget: Block; continueTarget: Block }
type SwitchContext = Disposable & {
  breakTarget: Block
  caseTarget(caseIndex: number, sourceLocation: SourceLocation): Block
  gotoCase(caseIndex: number, sourceLocation: SourceLocation): Goto
}

const breakSuffix = 'ᵇ'
const continueSuffix = 'ᶜ'
export class SwitchLoopContext {
  private labelCount = defaultRecord<string, number>(() => 0)
  private unlabelledCount = defaultRecord<SwitchOrLoop, number>(() => 0)

  constructor(private checker: ts.TypeChecker) {}

  private switchLoopStack: Array<{ type: SwitchOrLoop; uniqueName: string; label?: string }> = []

  getBreakTarget(label: ts.Identifier | undefined, sourceLocation: SourceLocation): string {
    const labelName = label?.text
    const item = this.switchLoopStack.toReversed().find(({ label }) => labelName === undefined || label === labelName)
    codeInvariant(item, 'Break must must exist inside a switch or loop construct', sourceLocation)
    return `${item.uniqueName}${breakSuffix}`
  }

  getContinueTarget(label: ts.Identifier | undefined, sourceLocation: SourceLocation): string {
    const labelName = label?.text
    const item = this.switchLoopStack
      .toReversed()
      .find(({ type, label }) => type === 'loop' && (labelName === undefined || label === labelName))
    codeInvariant(item, 'Break must must exist inside a switch or loop construct', sourceLocation)
    return `${item.uniqueName}${continueSuffix}`
  }

  enterLoop(
    node: ts.WhileStatement | ts.ForStatement | ts.ForOfStatement | ts.ForInStatement | ts.DoStatement,
    sourceLocation: SourceLocation,
  ): LoopContext {
    const label = ts.isLabeledStatement(node.parent) ? node?.parent.label : undefined

    const uniqueName = this.uniqueNameForLabel(label, 'loop')
    this.switchLoopStack.push({
      uniqueName,
      label: label?.text,
      type: 'loop',
    })
    return {
      breakTarget: nodeFactory.block({ sourceLocation, label: `${uniqueName}${breakSuffix}` }),
      continueTarget: nodeFactory.block({ sourceLocation, label: `${uniqueName}${continueSuffix}` }),
      [Symbol.dispose]: () => {
        const popped = this.switchLoopStack.pop()
        invariant(popped?.uniqueName === uniqueName && popped.type === 'loop', 'Switch loop stack is unbalanced')
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
    this.switchLoopStack.push({
      uniqueName,
      label: label?.text,
      type: 'switch',
    })
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
    }
  }
}
