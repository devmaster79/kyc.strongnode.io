const { off } = require("process");

module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    "react-app",
    "plugin:jsx-a11y/recommended",
    'plugin:@typescript-eslint/recommended',
    'plugin:sonarjs/recommended',
    'plugin:promise/recommended',
    'standard',
    'standard-jsx'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'sonarjs',
    'promise',
    "jsx-a11y",
  ],
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    /*
     * turned off lints:
     */
    'react/react-in-jsx-scope': 'off',
    // conflicts with @emotion Theme overrides
    // and with class components with empty props
    '@typescript-eslint/no-empty-interface': 'off',
    // conflicts with component order
    '@typescript-eslint/no-use-before-define': 'off',
    // it doesn't make any sense
    'promise/always-return': 'off',

    /*
     * Lints to enable later:
     */
     'jsx-quotes': 'warn',
     'no-undef': 'warn',
     'react/jsx-boolean-value': 'warn',
     'react/jsx-closing-bracket-location': 'warn',
     'react/jsx-closing-tag-location': 'warn',
     'react/jsx-curly-brace-presence': 'warn',
     'react/jsx-curly-newline': 'warn',
     'react/jsx-curly-spacing': 'warn',
     'react/jsx-indent': 'warn',
     'react/jsx-indent-props': 'warn',
     'react/jsx-pascal-case': 'warn',
     'react/jsx-props-no-multi-spaces': 'warn',
     'react/jsx-tag-spacing': 'warn',
     'react/jsx-wrap-multilines': 'warn',
     'react/self-closing-comp': 'warn',
    '@typescript-eslint/ban-types':'warn',
    'array-bracket-spacing':'warn',
    'operator-linebreak':'warn',
    'sonarjs/no-duplicate-string':'warn',
    'object-curly-newline':'warn',
    'keyword-spacing':'warn',
    'comma-spacing':'warn',
    'block-spacing':'warn',
    'no-multiple-empty-lines':'warn',
    'array-callback-return':'warn',
    'eqeqeq':'warn',
    'import/no-duplicates':'warn',
    'semi':'warn',
    'space-infix-ops':'warn',
    'indent':'warn',
    'camelcase':'warn',
    'key-spacing':'warn',
    'eol-last':'warn',
    'quotes':'warn',
    'space-before-function-paren':'warn',
    'comma-dangle':'warn',
    'object-curly-spacing':'warn',
    'dot-notation':'warn',
    'no-multi-spaces':'warn',
    'no-use-before-define':'warn',
    'curly':'warn',
    'multiline-ternary':'warn',
    'no-unused-vars':'warn',
    'sonarjs/cognitive-complexity': 'warn',
    'promise/catch-or-return': 'warn',
    'prefer-promise-reject-errors': 'warn',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',
    'jsx-a11y/alt-text': 'warn',
  },
  'settings': {
    'react': {
      'version': 'detect',
    },
    'propWrapperFunctions': [
        // for rules that check exact prop wrappers
        {'property': 'forbidExtraProps', 'exact': true}
    ],
    //'formComponents': [
    //  // Components used as alternatives to <form> for forms, eg. <Form endpoint={ url } />
    //  'CustomForm',
    //  {'name': 'Form', 'formAttribute': 'endpoint'}
    //],
    //'linkComponents': [
    //  // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
    //  'Hyperlink',
    //  {'name': 'Link', 'linkAttribute': 'to'}
    //]
  }
};