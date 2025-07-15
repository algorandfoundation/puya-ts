import type { Position, TextEdit } from '../../../src/text-edit'
import { combineSortFn, invariant, sortBy } from '../../../src/util'

export function applyEdits(file: string, edits: TextEdit[]) {
  const orderedEdits = edits.toSorted(
    combineSortFn(
      sortBy((x) => x.range.start.line),
      sortBy((x) => x.range.start.col),
    ),
  )

  function* fileIterator() {
    let inEdit = false
    let currentEdit = orderedEdits.shift()

    for (const [line, lineText] of file.split('\n').entries()) {
      for (const [col, character] of lineText.split('').entries()) {
        const currentPos = { line, col }
        if (!inEdit && currentEdit) {
          if (equal(currentPos, currentEdit.range.start)) {
            inEdit = true
            yield currentEdit.newText
          }
        }
        if (inEdit) {
          invariant(currentEdit, 'There must be a current edit if we are in edit mode')
          if (before(currentPos, currentEdit.range.end)) continue
          inEdit = false
          currentEdit = orderedEdits.shift()
          if (currentEdit && before(currentEdit.range.start, currentPos)) {
            throw new EditError('Cannot apply overlapping edit', currentEdit)
          }
        }

        yield character
      }
      yield '\n'
    }
  }

  return Array.from(fileIterator()).join('')
}

export class EditError extends Error {
  constructor(
    message: string,
    public readonly edit: TextEdit,
  ) {
    super(message)
  }
}

function before(p1: Position, p2: Position) {
  return p1.line < p2.line || (p1.line === p2.line && p1.col < p2.col)
}
function equal(p1: Position, p2: Position) {
  return p1.line === p2.line && p1.col === p2.col
}
