const js = require('@eslint/js');
const globals = require('globals');
const jestPlugin = require('eslint-plugin-jest');

module.exports = [
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2021,
            },
        },
        rules: {
            'no-console': 'off',
            'no-param-reassign': 'off',
            'class-methods-use-this': 'off',
            'no-plusplus': 'off',
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'max-len': ['warn', { code: 120 }],
            'prefer-template': 'warn',
        },
    },

    {
        files: ['__tests__/**/*.js', '**/*.test.js'],
        ...jestPlugin.configs['flat/recommended'],
        languageOptions: {
            globals: {
                ...globals.jest,
            },
        },
    },

    {
        ignores: [
            'dist/',
            'node_modules/',
            'coverage/',
            'webpack.config.js',
            'jest.config.js',
            'eslint.config.js',
            '.pnp.*',      // Добавляем PnP файлы
            '.yarn/',      // Добавляем папку Yarn
            '**/.pnp.*',   // Рекурсивно игнорируем
        ],
    },
];
