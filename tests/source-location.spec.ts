import ts from 'typescript'
import { describe, expect, it } from 'vitest'
import { SourceLocation } from '../src/awst/source-location'

describe('SourceLocation', () => {
  describe('fromFile', () => {
    it('should handle empty files correctly', () => {
      const sourceFile = ts.createSourceFile(
        'empty.ts',
        '', // empty content
        ts.ScriptTarget.Latest,
        true,
      )

      const location = SourceLocation.fromFile(sourceFile, '/test')
      expect(location.line).toBe(1)
      expect(location.endLine).toBe(1)
      expect(location.column).toBe(0) // Start from 0 for empty file
      expect(location.endColumn).toBe(0) // End at 0 for empty file
      expect(location.file).toBe('empty.ts')
      expect(location.scope).toBe('file')
    })

    it('should handle non-empty files correctly', () => {
      const sourceFile = ts.createSourceFile('test.ts', 'const x = 1;\n', ts.ScriptTarget.Latest, true)

      const location = SourceLocation.fromFile(sourceFile, '/test')
      expect(location.line).toBe(1)
      expect(location.endLine).toBe(2)
      expect(location.column).toBe(0)
      expect(location.endColumn).toBe(0)
      expect(location.file).toBe('test.ts')
      expect(location.scope).toBe('file')
    })
  })
})
