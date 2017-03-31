var path = require('path');
var webpack = require('webpack');

module.exports = function(karma) {
  'use strict';

  karma.set({
    basePath: __dirname,

    frameworks: ['jasmine'],

    files: [
      { pattern: 'tests.bundle.ts', watched: false }
    ],

    exclude: [],

    preprocessors: {
      'tests.bundle.ts': ['coverage', 'webpack', 'sourcemap']
    },

    reporters: ['mocha', 'coverage'],

    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'text-summary' },
        { type: 'json' },
        { type: 'html' }
      ]
    },

    mime: {
      'text/x-typescript': ['ts', 'tsx']
    },

    browsers: ['Chrome'],

    port: 9018,
    runnerPort: 9101,
    colors: true,
    logLevel: karma.LOG_INFO,
    autoWatch: true,
    singleRun: false,
    webpackServer: { noInfo: true },
    webpack: {
      devtool: 'inline-source-map',
      resolve: {
        extensions: ['.ts', '.js']
      },
      module: {
        loaders: [
          {
            test: /\.ts?$/,
            exclude: /(node_modules)/,
            loader: 'ts-loader'
          },
          {
            enforce: 'post',
            test: /\.(js|ts)$/, loader: 'istanbul-instrumenter-loader',
            include: path.resolve(__dirname, 'src'),
            exclude: [
              /\.(e2e|spec|bundle)\.ts$/,
              /node_modules/
            ]
          }
        ]
      },
      plugins: [
        new webpack.LoaderOptionsPlugin({
          options: {
            tslint: {
              emitErrors: false,
              failOnHint: false,
              resourcePath: 'src'
            }
          }
        }),
        new webpack.ContextReplacementPlugin(
          // The (\\|\/) piece accounts for path separators in *nix and Windows
          /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
          path.resolve('src'),
          {}
        )
      ]
    }
  });
};
