/**
 * ESLint configuration file
 * Defines code quality rules and linting configuration for the project
 */

// @ts-check
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
];


