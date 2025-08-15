import js from '@eslint/js';

// Export ESLint configuration array
export default [
  // Use recommended ESLint rules as base
  js.configs.recommended,
  
  // Project-specific configuration
  {
    languageOptions: {
      ecmaVersion: 2022, // Support ES2022 features
      sourceType: 'module', // Use ES modules
    },
    
    // Custom rule definitions
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Warn about unused variables, ignore underscore-prefixed args
      'no-console': 'off', // Allow console.log statements
      semi: ['error', 'always'], // Require semicolons
      quotes: ['error', 'single', { avoidEscape: true }], // Prefer single quotes, allow double when escaping
    },
    
    // Files and directories to ignore during linting
    ignores: ['node_modules/**', 'coverage/**', 'dist/**', 'eslint.config.js'],
  },
  // Jest test files: define Jest globals so linter recognizes them
  {
    files: ['tests/**/*.test.js', 'tests/*.test.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        jest: 'readonly',
      },
    },
  },
];


