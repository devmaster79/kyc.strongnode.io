module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'react-app',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:sonarjs/recommended',
    'plugin:promise/recommended',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  ignorePatterns: [
    '*.md',
    'src/assets',
    '*.css',
    'src/contracts/generated',
    '*.svg',
    'src/contracts/defaultTokenDictionary.json'
  ],
  plugins: [
    'react',
    'prettier',
    '@typescript-eslint',
    'sonarjs',
    'promise',
    'jsx-a11y',
    'prettier'
  ],
  rules: {
    /* ----------------- Additional lints: ----------------- */
    'no-console': ['error', { allow: ['warn', 'error'] }],

    /* ----------------- Turned off lints: ----------------- */
    'react/react-in-jsx-scope': 'off',
    // conflicts with @emotion Theme overrides
    // and with class components with empty props
    '@typescript-eslint/no-empty-interface': 'off',
    // conflicts with component order
    '@typescript-eslint/no-use-before-define': 'off',
    'no-use-before-define': 'off',
    // it doesn't make any sense
    'promise/always-return': 'off',
    // ts validates implicit anys anyways
    'react/prop-types': 'off',
    // usually not useful
    'sonarjs/no-duplicate-string': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/alt-text': 'off',

    /* ----------------- Enable later: ----------------- */
    'jsx-a11y/no-autofocus': 'warn'
  },
  settings: {
    react: {
      version: 'detect'
    },
    propWrapperFunctions: [
      // for rules that check exact prop wrappers
      { property: 'forbidExtraProps', exact: true }
    ]
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
}
