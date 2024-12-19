import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
/* eslint-disable no-redeclare */

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
      '**/.eslintrc.js',
      '**/node_modules',
      '**/dist',
      '**/build',
      '**/coverage',
      '**/generated/types.d.ts',
      '**/generated/types.ts',
      '**/.idea',
      '**/.vscode',
      '**/packages',
    ],
  },
  ...compat.extends('@makerx/eslint-config'),
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },

      ecmaVersion: 5,
      sourceType: 'commonjs',

      parserOptions: {
        project: true,
        tsconfigRootDir: '.',
      },
    },

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
]
