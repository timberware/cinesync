import eslintPluginSvelte from 'eslint-plugin-svelte';
import * as svelteParser from 'svelte-eslint-parser';
import * as typescriptParser from '@typescript-eslint/parser';
import svelteConfig from './svelte.config.js';

export default [
  {
    ignores: [
      '**/.svelte-kit/**',
      '**/build/**',
      '**/static/**',
      '**/test/**',
      '**/*.spec.ts',
      '**/eslint.config.mjs'
    ]
  },
  ...eslintPluginSvelte.configs['flat/recommended'],
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: typescriptParser,
        project: './tsconfig.json',
        extraFileExtensions: ['.svelte'],
        svelteConfig
      }
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'error',
      semi: [2, 'always'],
      curly: 'error'
    }
  }
];
