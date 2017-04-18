import build from './builder';


build({
  scope: '@ngrx',
  packages: [
    'store',
    'effects',
    'router-store',
    'store-devtools',
  ]
}).catch(err => {
  console.error(err);
  process.exit(1);
});
