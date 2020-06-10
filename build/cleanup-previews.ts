import * as tasks from './tasks';
import { createBuilder } from './util';
import { packages } from './config';

const cleanup = createBuilder([
  ['Cleanup docs previews', tasks.cleanupDocsPreviews],
]);

cleanup({
  scope: '',
  packages,
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
