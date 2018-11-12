/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/* eslint no-console: "off" */

function createPackage(changedFile) {
  const marketingMatch = /^projects\/ngrx\.io\/content\/(?:marketing\/|navigation\.json)/.exec(changedFile);
  if (marketingMatch) {
    console.log('Building marketing docs');
    return require('./marketing-package').createPackage();
  }

  const tutorialMatch = /^projects\/ngrx\.io\/content\/tutorial\/([^.]+)\.md/.exec(changedFile);
  const tutorialExampleMatch = /^projects\/ngrx\.io\/content\/examples\/(toh-[^\/]+)\//.exec(changedFile);
  if (tutorialMatch || tutorialExampleMatch) {
    const tutorialName = tutorialMatch && tutorialMatch[1] || tutorialExampleMatch[1];
    console.log('Building tutorial docs');
    return require('./tutorial-package').createPackage(tutorialName);
  }

  const guideMatch = /^projects\/ngrx\.io\/content\/guide\/([^.]+)\.md/.exec(changedFile);
  const exampleMatch = /^projects\/ngrx\.io\/content\/examples\/(?:cb-)?([^\/]+)\//.exec(changedFile);
  if (guideMatch || exampleMatch) {
    const guideName = guideMatch && guideMatch[1] || exampleMatch[1];
    const guide = require('../config').GUIDE_EXAMPLE_MAP[guideName] || guideName;
    console.log(`Building guide doc: ${guide}.md`);
    return require('./guide-package').createPackage(guide);
  }

  const apiExamplesMatch = /^packages\/examples\/([^\/]+)\//.exec(changedFile);
  const apiMatch = /^modules\/([^\/]+)\//.exec(changedFile);
  if (apiExamplesMatch || apiMatch) {
    const packageName = apiExamplesMatch && apiExamplesMatch[1] || apiMatch[1];
    console.log('Building API docs for', packageName);
    return require('./api-package').createPackage(packageName);
  }
}

module.exports = {
  generateDocs: function(changedFile, options = {}) {
    const {Dgeni} = require('dgeni');
    const package = createPackage(changedFile);

    if (options.silent) {
      package.config(function(log) { log.level = 'error'; });
    }
    var dgeni = new Dgeni([package]);
    const start = Date.now();
    return dgeni.generate()
      .then(
        () => console.log('Generated docs in ' + (Date.now() - start)/1000 + ' secs'),
        err => console.log('Error generating docs', err));
  }
};
