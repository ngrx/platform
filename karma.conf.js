const webpack = require('webpack');

module.exports = function(config) {
  config.set({
    // ... normal karma configuration
    files: [
      'node_modules/reflect-metadata/Reflect.js',
	  'node_modules/zone.js/dist/zone.js',
      'node_modules/zone.js/dist/proxy.js',
      'node_modules/zone.js/dist/sync-test.js',
      'node_modules/zone.js/dist/jasmine-patch.js',
      'node_modules/zone.js/dist/async-test.js',
      'node_modules/zone.js/dist/fake-async-test.js',
     { pattern: 'test.all.ts', watched: false }
    ],

	frameworks: ['jasmine'],

    preprocessors: {
      // add webpack as preprocessor
      'test.all.ts': ['webpack'],

    },

	mime: {
      'text/x-typescript': ['ts','tsx']
    },

	browsers: ['Chrome'],

    webpack: {
      resolve: {
        extensions: ['.ts','.js']
      },
      module: {
		  rules: [
			  { test: /\.ts?$/, loader: 'ts-loader' }
		  ]
	  },
	  plugins: [
		  new webpack.ContextReplacementPlugin(
        // The (\\|\/) piece accounts for path separators in *nix and Windows
        /angular(\\|\/)core(\\|\/)src(\\|\/)linker/,
        'modules', // location of your src
        {
          // your Angular Async Route paths relative to this root directory
        }
      ),

	  ]
    },

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      stats: 'errors-only'
    }
  });
};
