import * as tasks from './tasks';
import { createBuilder } from './util';
import { packages } from './config';

const deploy = createBuilder([
  ['Deploy docs preview', tasks.publishDocsPreview],
  ['Post GitHub Preview URL', tasks.postGithubComment],
]);

deploy({
  scope: '@ngrx',
  packages,
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
