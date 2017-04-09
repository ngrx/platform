const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.ts', '.js']
  },
  entry: './spec/integration.spec.ts',
  output: {
    path: path.join(process.cwd(), 'release'),
    publicPath: 'release/',
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          'ts-loader'
        ]
      }
    ]
  }
};