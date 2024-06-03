import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.browser';

bootstrapApplication(AppComponent, config).catch((err) => console.error(err));
