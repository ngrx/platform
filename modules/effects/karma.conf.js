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
        rules: [
          {
            test: /\.ts$/,
            loader: 'tslint-loader',
            enforce: 'pre',
            exclude: [
              /node_modules/
            ]
          },
          {
            test: /\.ts?$/,
            exclude: /(node_modules)/,
            loader: 'ts'
          },
          {
            test: /\.(js|ts)$/, loader: 'istanbul-instrumenter',
            include: path.resolve(__dirname, 'src'),
            enforce: 'post',
            exclude: [
              /\.(e2e|spec|bundle)\.ts$/,
              /node_modules/
            ]
          }
        ]
      },
      plugins: [
        new webpack.LoaderOptionsPlugin({
          tslint: {
            emitErrors: false,
            failOnHint: false,
            resourcePath: 'src'
          }
        })
      ]      
    }
  });
};
