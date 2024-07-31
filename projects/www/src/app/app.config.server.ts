import {
  mergeApplicationConfig,
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideServerRendering,
  ɵSERVER_CONTEXT as SERVER_CONTEXT,
} from '@angular/platform-server';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideServerRendering(),
    { provide: SERVER_CONTEXT, useValue: 'ssr-analog' },
    provideNoopAnimations(),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
