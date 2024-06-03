import {
  mergeApplicationConfig,
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [provideExperimentalZonelessChangeDetection()],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
