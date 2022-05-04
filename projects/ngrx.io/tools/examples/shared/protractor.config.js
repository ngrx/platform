// FIRST TIME ONLY- run:
//   ./node_modules/.bin/webdriver-manager update
//
//   Try: `npm run webdriver:update`
//
// AND THEN EVERY TIME ...
//   1. Compile with `tsc`
//   2. Make sure the test server (e.g., http-server: localhost:8080) is running.
//   3. ./node_modules/.bin/protractor protractor.config.js
//
//   To do all steps, try:  `npm run e2e`

var fs = require('fs');
var path = require('canonical-path');
var _ = require('lodash');


exports.config = {
  directConnect: true,

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome',
    // For Travis
    chromeOptions: {
      binary: process.env.CHROME_BIN,
      args: ['--no-sandbox']
    }
  },

  // Framework to use. Jasmine is recommended.
  framework: 'jasmine',

  // For angular tests
  useAllAngular2AppRoots: true,

  // Base URL for application server
  baseUrl: 'http://localhost:8080',

  // doesn't seem to work.
  // resultJsonOutputFile: "foo.json",

  onPrepare: function() {
    //// SpecReporter
    //var SpecReporter = require('jasmine-spec-reporter');
    //jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'none'}));
    //// jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));

    // debugging
    // console.log('browser.params:' + JSON.stringify(browser.params));

    jasmine.getEnv().addReporter(new Reporter( browser.params ));
  },

  jasmineNodeOpts: {
    // defaultTimeoutInterval: 60000,
    defaultTimeoutInterval: 10000,
    showTiming: true,
    print: function() {}
  },

  beforeLaunch: function() {
    // add TS support for specs
    require('ts-node').register({
      project: './tsconfig.json'
    });
  }
};

// See http://jasmine.github.io/2.1/custom_reporter.html
function Reporter(options) {
  var _defaultOutputFile = path.resolve(__dirname, '../../protractor-results.txt');
  options.outputFile = options.outputFile || _defaultOutputFile;

  var _root = { appDir: options.appDir, suites: [] };
  log('AppDir: ' + options.appDir, +1);
  var _currentSuite;

  this.suiteStarted = function(suite) {
    _currentSuite = { description: suite.description, status: null, specs: [] };
    _root.suites.push(_currentSuite);
    log('Suite: ' + suite.description, +1);
  };

  this.suiteDone = function(suite) {
    var statuses = _currentSuite.specs.map(function(spec) {
      return spec.status;
    });
    statuses = _.uniq(statuses);
    var status = statuses.indexOf('failed') >= 0 ? 'failed' : statuses.join(', ');
    _currentSuite.status = status;
    log('Suite ' + _currentSuite.status + ': ' + suite.description, -1);
  };

  this.specStarted = function(spec) {

  };

  this.specDone = function(spec) {
    var currentSpec = {
      description: spec.description,
      status: spec.status
    };
    if (spec.failedExpectations.length > 0) {
      currentSpec.failedExpectations = spec.failedExpectations;
    }

    _currentSuite.specs.push(currentSpec);
    log(spec.status + ' - ' + spec.description);
    if (spec.status === 'failed') {
      spec.failedExpectations.forEach(function(err) {
        log(err.message);
      });
    }
  };

  this.jasmineDone = function() {
    outputFile = options.outputFile;
    //// Alternate approach - just stringify the _root - not as pretty
    //// but might be more useful for automation.
    // var output = JSON.stringify(_root, null, 2);
    var output = formatOutput(_root);
    fs.appendFileSync(outputFile, output);
  };

  // for output file output
  function formatOutput(output) {
    var indent = '  ';
    var pad = '  ';
    var results = [];
    results.push('AppDir:' + output.appDir);
    output.suites.forEach(function(suite) {
      results.push(pad + 'Suite: ' + suite.description + ' -- ' + suite.status);
      pad+=indent;
      suite.specs.forEach(function(spec) {
        results.push(pad + spec.status + ' - ' + spec.description);
        if (spec.failedExpectations) {
          pad+=indent;
          spec.failedExpectations.forEach(function (fe) {
            results.push(pad + 'message: ' + fe.message);
          });
          pad=pad.substring(2);
        }
      });
      pad = pad.substring(2);
      results.push('');
    });
    results.push('');
    return results.join('\n');
  }

  // for console output
  var _pad;
  function log(str, indent) {
    _pad = _pad || '';
    if (indent == -1) {
      _pad = _pad.substring(2);
    }
    console.log(_pad + str);
    if (indent == 1) {
      _pad = _pad + '  ';
    }
  }

}
