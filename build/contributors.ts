import { packages } from './config';
import * as util from './util';
import * as tasks from './tasks';

const contributors = util.createBuilder([
  ['Reading migrations', tasks.getMigrations],
  ['Retrieving contributors', tasks.getContributors],
  ['Saving contributors', tasks.saveContributors],
]);

contributors({
  scope: '',
  packages,
}).catch(err => {
  console.error(err);
  process.exit(1);
});
