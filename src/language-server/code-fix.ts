import type { SourceLocation } from '../awst/source-location'
import { WellKnownErrors } from '../errors'

export abstract class CodeFix {}

export class WrappingCodeFix extends CodeFix {
  constructor(
    readonly sourceLocation: SourceLocation,
    readonly beforeText: string,
    readonly afterText: string,
  ) {
    super()
  }
}

export class WrapInUint64CtorFix extends WrappingCodeFix {
  constructor(sourceLocation: SourceLocation) {
    super(sourceLocation, 'Uint64(', ')')
  }
}

const codeFixes = {
  [WellKnownErrors.NumberNeedsWrapping]: (sourceLocation: SourceLocation): CodeFix[] => {
    return []
  },
}
