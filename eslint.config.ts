import eslint from '@eslint/js';
import angular from 'angular-eslint';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
    {
        files: ['**/*.ts'],
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommended,
            ...tseslint.configs.stylistic,
            ...angular.configs.tsRecommended,
        ],
        processor: angular.processInlineTemplates as never,
        rules: {
            '@angular-eslint/directive-selector': [
                'error',
                { type: 'attribute', prefix: 'app', style: 'camelCase' },
            ],
            '@angular-eslint/component-selector': [
                'error',
                { type: ['element', 'attribute'], prefix: 'app', style: 'kebab-case' },
            ],
            '@angular-eslint/prefer-standalone': 'error',
            '@angular-eslint/component-class-suffix': 'error',
            '@angular-eslint/directive-class-suffix': 'error',

            '@typescript-eslint/explicit-function-return-type': [
                'error',
                {
                    allowExpressions: true,
                    allowTypedFunctionExpressions: true,
                    allowHigherOrderFunctions: true,
                    allowDirectConstAssertionInArrowFunctions: true,
                },
            ],
            '@typescript-eslint/no-explicit-any': 'warn',

            'no-console': ['error', { allow: ['warn', 'error'] }],
        },
    },
    {
        files: ['**/*.html'],
        extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
        rules: {
            '@angular-eslint/template/no-negated-async': 'error',
            '@angular-eslint/template/prefer-control-flow': 'error',
            '@angular-eslint/template/no-duplicate-attributes': 'error',
        },
    },
]);
