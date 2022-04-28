import { createBuilder } from './util';

const update = createBuilder([
  [
    'Update config',
    () => require('../modules/eslint-plugin/scripts/generate-config'),
  ],
  [
    'Update overview',
    () => require('../modules/eslint-plugin/scripts/generate-overview'),
  ],
  [
    'Update docs',
    () => require('../modules/eslint-plugin/scripts/generate-docs'),
  ],
]);

update({
  scope: '@ngrx',
  packages: [{ name: 'eslint-plugin' }],
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
