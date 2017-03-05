declare var global, require, Symbol;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

const _ = require('lodash');
const root = require('rxjs/util/root').root;
import {TestScheduler} from 'rxjs/testing/TestScheduler';

import * as marbleHelpers from './marble-testing';

global.rxTestScheduler = null;
global.cold = marbleHelpers.cold;
global.hot = marbleHelpers.hot;
global.expectObservable = marbleHelpers.expectObservable;
global.expectSubscriptions = marbleHelpers.expectSubscriptions;

const assertDeepEqual = marbleHelpers.assertDeepEqual;

const glit = global.it;

global.it = function(description, cb, timeout) {
  if (cb.length === 0) {
    glit(description, function() {
      global.rxTestScheduler = new TestScheduler(assertDeepEqual);
      cb();
      global.rxTestScheduler.flush();
    });
  } else {
    glit.apply(this, arguments);
  }
};

global.it.asDiagram = function() {
  return global.it;
};

const glfit = global.fit;

global.fit = function(description, cb, timeout) {
  if (cb.length === 0) {
    glfit(description, function() {
      global.rxTestScheduler = new TestScheduler(assertDeepEqual);
      cb();
      global.rxTestScheduler.flush();
    });
  } else {
    glfit.apply(this, arguments);
  }
};

function stringify(x) {
  return JSON.stringify(x, function(key, value) {
    if (Array.isArray(value)) {
      return '[' + value
        .map(function(i) {
          return '\n\t' + stringify(i);
        }) + '\n]';
    }
    return value;
  })
    .replace(/\\"/g, '"')
    .replace(/\\t/g, '\t')
    .replace(/\\n/g, '\n');
}

beforeEach(function() {
  jasmine.addMatchers({
    toDeepEqual: function(util, customEqualityTesters) {
      return {
        compare: function(actual, expected) {
          let result: any = { pass: _.isEqual(actual, expected) };

          if (!result.pass && Array.isArray(actual) && Array.isArray(expected)) {
            result.message = 'Expected \n';
            actual.forEach(function(x) {
              result.message += stringify(x) + '\n';
            });
            result.message += '\nto deep equal \n';
            expected.forEach(function(x) {
              result.message += stringify(x) + '\n';
            });
          }

          return result;
        }
      };
    }
  });
});

afterEach(function() {
  global.rxTestScheduler = null;
});

(function() {
  Object.defineProperty(Error.prototype, 'toJSON', {
    value: function() {
      let alt = {};

      Object.getOwnPropertyNames(this).forEach(function(key) {
        if (key !== 'stack') {
          alt[key] = this[key];
        }
      }, this);
      return alt;
    },
    configurable: true
  });

  global.__root__ = root;
})();

global.lowerCaseO = function lowerCaseO() {
  const values = [].slice.apply(arguments);

  const o = {
    subscribe: function(observer) {
      values.forEach(function(v) {
        observer.next(v);
      });
      observer.complete();
    }
  };

  o[(<any>Symbol).observable] = function() {
    return this;
  };

  return o;
};
