import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.browser';

// Deactivate service worker from old ngrx.io app
// TODO: Remove after 6 months
if (typeof window !== 'undefined') {
  window.navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}

bootstrapApplication(AppComponent, config).catch((err) => console.error(err));
