import eslint from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import tseslint from 'typescript-eslint'

export default tseslint.config(
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
      'packages-temp/**',
      'docs/_html/',
      '**/.astro/',
      '**/.puya',
      'tests/code-fix/fixed/**',
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.eslintRecommended,
  tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    rules: {
      'prettier/prettier': 'warn',
      'no-console': 'warn',
      '@typescript-eslint/no-unused-expressions': 'off',
      'prefer-template': 'error',
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
  {
    files: ['tests/approvals/out/**/*.client.ts'],
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
  },
)
