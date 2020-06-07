import * as tasks from './tasks';
import { createBuilder } from './util';
import { packages } from './config';

const deploy = createBuilder([
  ['Deploy builds', tasks.publishToRepo],
  ['Deploy docs', tasks.publishDocs],
]);

deploy({
  scope: '@ngrx',
  packages,
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
