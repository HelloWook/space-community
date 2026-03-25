const baseConfig = require('./index');

/** @type {import("eslint").Linter.Config[]} */
module.exports = [
  ...baseConfig,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    ignores: ['.next/', 'node_modules/', 'coverage/'],
  },
];
