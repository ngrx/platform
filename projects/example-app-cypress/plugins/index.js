const cypressTypeScriptPreprocessor = require('./cy-ts-preprocessor');

module.exports = on =>
  on('file:preprocessor', cypressTypeScriptPreprocessor);

// TODO: uncomment once Applitools work properly
// require('@applitools/eyes-cypress')(module);
