/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
*/
module.exports = {
  singleQuote: true,
  trailingComma: 'es5',
  overrides: [
    {
      files: '*.md',
      options: {
        printWidth: 70,
      },
    },
  ],
};
