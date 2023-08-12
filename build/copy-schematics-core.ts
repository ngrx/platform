import * as tasks from './tasks';
import { createBuilder } from './util';
import { packages } from './config';

const copySchematics = createBuilder([
  ['Copy Schematics Core Files', tasks.copySchematicsCore],
]);

copySchematics({
  scope: '@ngrx',
  // TODO: Remove signals when released as a stable package
  packages: [...packages, { name: 'signals' }],
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
