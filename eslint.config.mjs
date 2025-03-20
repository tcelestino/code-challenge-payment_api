import pluginJs from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['src/**/*.ts'] },
  { ignores: ['node_modules/**', 'dist/**', 'tests/**/*.ts', 'mocks/**/**/*.js'] },
  { languageOptions: { globals: globals.node } },
  {
    rules: {
      '@typescript-eslint/no-empty-object-type': [
        'error',
        {
          allowInterfaces: 'with-single-extends',
        },
      ],
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
