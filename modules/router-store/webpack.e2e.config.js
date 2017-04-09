const ngtools = require('@ngtools/webpack');

module.exports = {
  resolve: {
    extensions: ['.ts', '.js']
  },
  entry: './e2e/main.ts',
  output: {
    path: "./dist/e2e",
    filename: "bundle.js"
  },
  plugins: [
    new ngtools.AotPlugin({
      tsConfigPath: './tsconfig.e2e.json'
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          '@ngtools/webpack'
        ]
      }
    ]
  }
};