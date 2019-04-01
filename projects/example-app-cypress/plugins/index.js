const cypressTypeScriptPreprocessor = require('./cy-ts-preprocessor');

module.exports = on => 
  on('file:preprocessor', cypressTypeScriptPreprocessor);

require('@applitools/eyes-cypress')(module);
