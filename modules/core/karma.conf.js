var path = require('path');

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
        root: __dirname,
        extensions: ['', '.ts', '.js']
      },
      module: {
        preLoaders: [
          {
            test: /\.ts$/,
            loader: 'tslint-loader',
            exclude: [
              /node_modules/
            ]
          }
        ],
        loaders: [
          {
            test: /\.ts?$/,
            exclude: /(node_modules)/,
            loader: 'ts'
          }
        ],
        postLoaders: [
          {
            test: /\.(js|ts)$/, loader: 'istanbul-instrumenter',
            include: path.resolve(__dirname, 'src'),
            exclude: [
              /\.(e2e|spec|bundle)\.ts$/,
              /node_modules/
            ]
          }
        ]
      },
      tslint: {
        emitErrors: false,
        failOnHint: false,
        resourcePath: 'src'
      }
    }
  });
};