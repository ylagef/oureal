/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['universe', 'prettier', 'plugin:json/recommended'],
  plugins: ['simple-import-sort'],
  rules: {
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error'
  }
}
