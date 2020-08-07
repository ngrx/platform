/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const Package = require('dgeni').Package;
const apiPackage = require('../angular-api-package');
const { API_SOURCE_PATH } = require('../config');

const packageMap = {
  store: ['store/index.ts', 'store/testing/index.ts'],
  'store-devtools': ['store-devtools/index.ts'],
  effects: ['effects/index.ts', 'effects/testing/index.ts'],
  entity: ['entity/index.ts'],
  'router-store': ['router-store/index.ts'],
  data: ['data/index.ts'],
  schematics: ['schematics/index.ts'],
  'component-store': ['component-store/index.ts']
};


function createPackage(packageName) {

  return new Package('author-api', [apiPackage])
    .config(function(readTypeScriptModules) {
      readTypeScriptModules.sourceFiles = packageMap[packageName];
    })
    .config(function(readFilesProcessor) {
      readFilesProcessor.sourceFiles = [
        {
          basePath: API_SOURCE_PATH,
          include: `${API_SOURCE_PATH}/examples/${packageName}/**/*`,
          fileReader: 'exampleFileReader'
        }
      ];
    });
}


module.exports = {
  createPackage
};
