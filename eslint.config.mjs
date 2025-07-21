import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: [
      '*.cjs',
      '**/node_modules/',
      '**/dist/',
      '**/build/',
      '**/coverage/',
      '**/.idea',
      '**/.vscode',
      'packages/**',
      'tests/quick-fix/fixed/**',
    ],
  },
  ...compat.extends('@makerx/eslint-config'),
  {
    rules: {
      '@typescript-eslint/no-for-in-array': 'error',
      eqeqeq: 'error',
      '@typescript-eslint/consistent-type-imports': 'error',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          ignoreRestSiblings: true,
          args: 'none',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '(^_)',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-unused-private-class-members': 'off',
    },
  },
  {
    files: ['tests/**/*.algo.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
]
