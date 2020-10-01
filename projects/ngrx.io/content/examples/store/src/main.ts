import './polyfills';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule).then(ref => {
  // Ensure Angular destroys itself on hot reloads.
  if (window['ngRef']) {
    window['ngRef'].destroy();
  }
  window['ngRef'] = ref;

<<<<<<< HEAD
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
=======
  // Otherwise, log the boot error
}).catch(err => console.error(err));
>>>>>>> Update store and testing-store examples in docs
