var path = require('path');
module.exports = function(karma) {
  'use strict';

  karma.set({
    basePath: __dirname,
    frameworks: ['jasmine'],
    files: [
      'node_modules/core-js/client/core.js',
      'node_modules/reflect-metadata/Reflect.js',

      // Zone.js dependencies
      'node_modules/zone.js/dist/zone.js',
      'node_modules/zone.js/dist/long-stack-trace-zone.js',
      'node_modules/zone.js/dist/proxy.js',
      'node_modules/zone.js/dist/sync-test.js',
      'node_modules/zone.js/dist/jasmine-patch.js',
      'node_modules/zone.js/dist/async-test.js',
      'node_modules/zone.js/dist/fake-async-test.js',

      { pattern: 'release/bundle.js', watched: false }
    ],

    browsers: ['Chrome'],
    colors: true,
    logLevel: karma.LOG_INFO,
    singleRun: true
  });
};