module.exports = {
  env: {
    browser: false,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:sonarjs/recommended',
    'plugin:promise/recommended',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  ignorePatterns: ['*.md', 'src/app/scripts/cryptoData', '*.png', '*.jpg'],
  plugins: ['@typescript-eslint', 'sonarjs', 'promise', 'prettier'],
  rules: {
    /* ----------------- Additional lints: ----------------- */
    'no-console': ['error'],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    /* ----------------- Turned off lints: ----------------- */
    // It doesn't make any sense
    'promise/always-return': 'off',
    // Usually not useful
    'sonarjs/no-duplicate-string': 'off',
    // If we want to run some js without a loader we have to use require instead of import
    '@typescript-eslint/no-var-requires': 'off'
  }
}
